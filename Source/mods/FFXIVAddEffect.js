/*
    FFXIVAddEffect.js

    An API that enables adding FFXIV TTRPG effects to any given character from Macros.

*/

/*build:remove*/
/*build:import ../common/utilities.js*/
/*build:import ../common/effects.js*/
/*build:import ../common/effectUtilities.js*/
/*build:import common/modengine.js*/
/*build:import common/effectcache.js*/
/*build:import common/tokenengine.js*/
/*build:import common/modutilities.js*/
/*build:import ../common/addEffects.js*/
/*build:import ../common/removeEffects.js*/
/*build:import addeffect/addEffectParser.js*/
const FFXIVAddEffectImports = {};
/*build:end*/

// eslint-disable-next-line no-unused-vars
const FFXIVAddEffect = (() => {
    const scriptName = "FFXIVAddEffect";
    const version = "0.1.0";

    var lastMessage = {
        content: "",
        who: "",
        time: 0
    };

    let imports = FFXIVAddEffectImports.export;
    let logger = new imports.Logger(scriptName, true);

    const getCharacters = (msg, target) => {
        if (target == "selected") {
            let tokens = msg.selected;
            if (!tokens) {
                return { result: [], error: "Select a token to apply an status effect." };
            }

            var characters = [];
            for (let token of tokens) {
                if (token._type != "graphic") {
                    continue;
                }
                let object = getObj("graphic", token._id);
                if (!object || !object.get("represents")) {
                    logger.d("No representation for token; skipping");
                    continue;
                }
                let character = getObj("character", object.get("represents"));
                characters.push({
                    token: object,
                    character: character
                });
                logger.d("Adding character " + JSON.stringify(character));
            }
            return { result: characters, error: null };
        } else if (target == "mine") {
            let characters = findObjs({ type: "character", controlledby: msg.playerid }).map(value => { return { character: value }; });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters controlled by player");
                return { result: [], error: "No available controlled characters to apply status effects to." };
            }
        } else {
            logger.d("Searching for character " + target);
            let characters = findObjs({ type: "character", name: target }).map(value => { return { character: value }; });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters named " + target);
                return { result: [], error: `No characters named ${target}` };
            }
        }
    };

    const addEffects = (effects, characters, effectCache) => {
        var summaries = [];

        logger.d(`Adding ${effects.length} effects to ${characters.length} character(s)`);
        for (let object of characters) {
            for (let effect of effects) {
                let character = object.character;
                let token = object.token;
                let sheetType = imports.unpackAttribute(character, "sheet_type").get("current");
                let engine;
                if (sheetType === "unique") {
                    logger.d(`Using character engine for ${sheetType} token`);
                    engine = new imports.ModEngine(logger, character);
                } else if (token) {
                    logger.d(`Using token engine for ${sheetType} token`);
                    engine = new imports.TokenEngine(logger, token, character, effectCache);
                } else {
                    logger.i(`Will not add effect; character ${character.get("name")} isn't unique. Generic characters only support adding to selected token.`);
                }
                let removalHandler = new imports.RemoveEffects(engine);
                let addHandler = new imports.AddEffects(engine, removalHandler);
                engine.getAttrsAndEffects(["hitPoints", "barrierPoints"], (values, effects) => {
                    let state = new imports.EffectState(
                        values.hitPoints, 
                        values.hitPoints_max, 
                        values.barrierPoints, 
                        null, 
                        effects
                    );
                    let summary = addHandler.add(state, [effect]);
                    summaries.push(`${summary} on <b>${character.get("name")}</b>`);
                });
            }
        }
        let summary = summaries.join("</li><li>");
        if (summary) {
            summary = `<ul><li>${summary}</li></ul>`;
        }
        return summary;
    };

    const outputEvent = (type, who, summary, playerid) => {
        logger.d("Outputting to chat");
        let prefix;
        if (playerIsGM(playerid)) {
            prefix = "/w gm ";
        } else {
            prefix = "";
        }
        switch (type) {
            case "add": {
                if (!summary) {
                    logger.d("Nothing to post; posting an error instead");
                    sendChat("FFXIV Effects", `${prefix}Unable to post add effect summary; no summary found`);
                    break;
                }
                sendChat(who, `${prefix}<h4>Effects:</h4>${summary}`);
                break;
            }

            case "error":
                sendChat(who, `${prefix}${summary}`);
                break;

            default:
                logger.i(`Unrecognized type: ${type}`);
                break;
        }
    };

    const help = () => {

        let helpContent = `<h4>${scriptName} !eos --help</h4>` +
            `<h5>Arguments</h5>` +
            `<li><code>--{effects}</code> - Required: The specification of the effect(s), a comma separated list of effect names and values. <b>Examples:</b> <code>dot(3)</code>, <code>dot(3),stun</code></li>` +
            `</ul>` +
            `<li><code>name</code> - the name of the effect, needs to match any of the available FFXIV effects.</li>` +            
            `<li><code>value</code> Optional - An optional value in parentheses. Required for certain effects.</li>` +
            `<ul>` +
            `<h5>Options</h5>` +
            `<ul>` +
            `<li><code>--help</code> - displays this message in chat.</li>` +
            `<li><code>--clean</code> - cleans out the internal cache for token status markers.<li>` +
            `<li><code>--source {X}</code> - the name of the character that originated the effect, or "Self."</li>` +
            `<li><code>--match {X}</code> - the id of a matching effect on the character that originated this effect. Used to link effects together between two characters./li>` +
            `<li><code>--expire {X}</code> - when the effect should expire. <b>Default:</b><code>turn</code>. Valid values are:</li>` +
            `<ul>` +
            `<li><code>encounterstart</code> - Start of an encounter</li>` +
            `<li><code>stepstart</code> - Start of the [Adventurer Step]/[Enemy step], depending on the character's affiliation</li>` +
            `<li><code>start</code> - Start of the character's turn</li>` +
            `<li><code>turn</code> - End of the character's turn</li>` +
            `<li><code>turn2</code> - End of the character's next turn</li>` +
            `<li><code>step</code> - End of the [Adventurer Step]/[Enemy step], depending on the character's affiliation</li>` +
            `<li><code>round</code> - End of this round. Triggers after the end of the [Enemy Step]</li>` +
            `<li><code>phase</code> - End of phase</li>` +
            `<li><code>encounter</code> - End of encounter</li>` +
            `<li><code>rest</code> - After rest</li>` +
            `<li><code>end</code> - After adventure/module</li>` +
            `<li><code>permanent</code> - Never expires</li>` +
            `<li><code>use</code> - On use</li>` +
            `<li><code>damage</code> - When the character receives damage</li>` +
            `</ul>` +
            `<li><code>--edit {X}</code> - whether the effect should be manually editable in the character sheet. 1 or on to enable editing, 0 or off to disable. <b>Default:</b> enabled.</li>` +
            `<li><code>--curable {X}</code> - if the effect can be removed by abilities like Esuna, or certain items. 1 or on to enable, 0 or off to disable. <b>Default:</b> disabled.</li>` +
            `<li><code>--dupe {X}</code> - how duplicates of the effect should be handled. <b>Default:</b><code>allow</code>. Valid values are:</li>` +
            `<ul>` +
            `<li><code>allow</code> - any number of this effect can be added to the same character</li>` +
            `<li><code>block</code> - the same effect cannot be applied again, and will be discarded if an attempt is made</li>` +
            `<li><code>replace</code> - if the same effect is applied again, it will replace the previous instance</li>` +
            `</ul>` +
            `<li><code>--t {X}</code> - the target. Default: <code>selected</code>. Valid values are:</li>` +
            `<ul>` +
            `<li><code>selected</code> - the selected token(s)</li>` +
            `<li><code>mine</code> - the tokens controlled by the player who triggered this call</li>` +
            `<li>A character name</li>` +
            `</ul>`
            ;

        logger.d("Posting help text");
        try {
            sendChat(scriptName, helpContent);
        } catch (e) {
            logger.i(`ERROR: ${e}`);
        }
    };

    const handleInput = (msg) => {
        if ("api" !== msg.type) {
            return;
        }
        if (!msg.content.match(/^!ffe(\b\s|$)/)) {
            return;
        }

        let time = (new Date()).getTime();
        if (lastMessage.content === msg.content && lastMessage.who === msg.who && time - lastMessage.time < 200) {
            logger.d("Duplicate message, ignoring");
            return;
        } else if (lastMessage.content === msg.content && lastMessage.who === msg.who) {
            logger.d("Message receipt diff: " + (time - lastMessage.time));
        }
        lastMessage.content = msg.content;
        lastMessage.who = msg.who;
        lastMessage.time = time;

        let who = (getObj("player", msg.playerid) || { get: () => "API" }).get("_displayname");
        let args = msg.content.split(/\s+--/);
        let parser = new imports.AddEffectParser(msg);

        var effects = [];
        let target = "selected";

        logger.d("==============================================");
        logger.d("Parsing command " + msg.content);
        logger.d("==============================================");
        for (let a of args) {
            let parts = a.split(/\s+/);
            switch (parts[0].toLowerCase()) {
                case "!ffe":
                    // Do nothing for the API keyword
                    break;
                case "clean":
                    state["FFXIVCache"] = {
                        effects: new imports.EffectCache()
                    };
                    return;
                case "curable":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effects.forEach(effect => effect.curable = ["1", "on"].includes(parts[1]) ? "on" : "off");
                    } else {
                        logger.i("Unrecognized curable type " + parts[1]);
                        return;
                    }
                    break;
                case "edit":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effects.forEach(effect => effect.editable = parts[1]);
                    } else {
                        logger.i("Unrecognized editable type " + parts[1]);
                        return;
                    }
                    break;
                case "expire": {
                    let expiry = parts[1].toLowerCase();
                    if (imports.effectData.expiryTypes.includes(expiry)) {
                        effects.forEach(effect => effect.expiry = expiry);
                    } else {
                        logger.i("Unrecognized expiry type " + expiry);
                        return;
                    }
                    break;
                }
                case "dupe":
                    if (["block", "replace", "allow"].includes(parts[1])) {
                        effects.forEach(effect => effect.duplicate = parts[1]);
                    } else {
                        logger.i("Unrecognized dupe type " + parts[1]);
                        return;
                    }
                    break;
                case "help":
                    help();
                    return;
                case "match":
                    effects.forEach(effect => effect.match = parts[1]);
                    break;
                case "source":
                    effects.forEach(effect => effect.source = parts[1]);
                    break;
                case "t": {
                    let target = parts.slice(1).join(" ");
                    effects.forEach(effect => effect.target = target);
                    break;
                }
                default: {
                    let specificationText = parts.join(" ");
                    let parseResult = parser.parseEffectSpecification(specificationText);
                    if (!parseResult.success) {
                        outputEvent("error", who, parseResult.message, msg.playerid);
                        return;
                    }
                    effects = parseResult.effects;
                    break;
                }
            }
        }
        if (effects.length === 0) {
            logger.i("Found no matching effect for " + msg.content);
            outputEvent("error", who, "Found no matching effect for " + msg.content, msg.playerid);
            return;
        }
        let targetResult = getCharacters(msg, target);
        if (targetResult.error) {
            outputEvent("error", who, targetResult.error, msg.playerid);
            return;
        }

        let characters = targetResult.result;
        let effectCache = new imports.EffectCache(state["FFXIVCache"].effects);
        let summary = addEffects(effects, characters, effectCache);
        state["FFXIVCache"].effects = effectCache;
        outputEvent("add", who, summary, msg.playerid);
    };

    const reconfigureMarkers = (token) => {
        logger.d("Status markers changed for token " + token.get("_id"));
        if (!token.get("represents")) {
            logger.d("No representation for token; cancelling marker update");
            return;
        }
        let character = getObj("character", token.get("represents"));
        let sheetType = imports.unpackAttribute(character, "sheet_type").get("current");
        if (sheetType === "unique") {
            logger.d("Character is unique; no need to update status markers");
            return;
        }

        let effectCache = new imports.EffectCache(state["FFXIVCache"].effects);
        let tokenCache = effectCache.get(token);
        tokenCache.reconfigureMarkerMap();
        state["FFXIVCache"].effects = effectCache;
    };

    const registerEventHandlers = () => {
        on("chat:message", handleInput);
        on("change:graphic:statusmarkers", reconfigureMarkers);
    };

    on("ready", () => {
        state[scriptName] = {
            version: version
        };
        if (!state["FFXIVCache"]) {
            logger.d("Initialising effect cache");
            state["FFXIVCache"] = {
                effects: new imports.EffectCache()
            };
        }
        registerEventHandlers();
    });
})();