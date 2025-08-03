/*
    FFXIVAddEffect.js

    An API that enables adding FFXIV TTRPG effects to any given character from Macros.

*/

/*build:remove*/
/*build:import ../common/utilities.js*/
/*build:import common/modutilities.js*/
/*build:import ../common/effects.js*/
const effectData = {};
class Logger {};
/*eslint-disable-next-line no-redeclare*/
const generateRowID = {}; const unpackNaN = {}; const unpackAttribute = {}; const setAttribute = {};
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

    let logger = new Logger(scriptName, true);

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
                characters.push(character);
                logger.d("Adding character " + JSON.stringify(character));
            }
            return { result: characters, error: null };
        } else if (target == "mine") {
            let characters = findObjs({ type: "character", controlledby: msg.playerid });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters controlled by player");
                return { result: [], error: "No available controlled characters to apply status effects to." };
            }
        } else {
            logger.d("Searching for character " + target);
            let characters = findObjs({ type: "character", name: target });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters named " + target);
                return { result: [], error: `No characters named ${target}` };
            }
        }
    };

    const resetAttribute = (character, attributeName, attributeValue) => {
        if (!["str", "dex", "vit", "int", "mnd", "defense", "magicdefense", "vigilance", "speed"].includes(attributeName.toLowerCase())) {
            logger.d(`Unsupported attribute for ${attributeName}`);
            return;
        }
        let attribute = unpackAttribute(character, attributeName, 0);
        let currentValue = attribute.get("current");
        if (currentValue === 0) {
            logger.d(`Couldn't find attribute ${attributeName} on character ${character.get("name")}`);
            return;
        }
        let valueChange = unpackNaN(attributeValue);
        if (valueChange === 0) {
            logger.d(`No value change in effect for attribute ${attributeName} on character ${character.get("name")}`);
            return;
        }
        logger.d(`Resetting attribute change to ${attributeName} by ${valueChange}`);
        setAttribute(attribute, "current", currentValue - valueChange);
    };

    const removeEffectsForFilter = (character, filter) => {
        let attributes = findObjs({ type: "attribute", characterid: character.id });
        let actionables = attributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let match = name.match(/^repeating_effects_([-\w]+)_([\w_]+)/);
                if (!match || match.length < 2) {
                    // It's not a repeating effect attribute, skip
                    return accumulator;
                }
                let id = match[1];
                let subname = match[2];
                if (accumulator.byId[id]) {
                    accumulator.byId[id][subname] = currentValue;
                } else {
                    accumulator.byId[id] = {};
                    accumulator.byId[id][subname] = currentValue;
                }
                if (filter(id, subname, currentValue)) {
                    accumulator.idsToDelete.push(id);
                }
                return accumulator;
            },
            { byId: {}, idsToDelete: [] }
        );
        for (let id of actionables.idsToDelete) {
            let actionable = actionables.byId[id];
            if (actionable["attribute"] && actionable["attributeValue"]) {
                resetAttribute(character, actionable["attribute"].get("current"), actionable["attributeValue"].get("current"));
            }
            for (let entry of Object.entries(actionables.byId[id])) {
                let attribute = entry[1];
                logger.d(`Removing attribute ${attribute.get("name")} for ${character.get("name")}.`);
                attribute.remove();
            }
        }
    };

    const getEffectsWithName = (name, character) => {
        let objects = findObjs({ type: "attribute", characterid: character.id, current: name });
        let effects = objects.reduce((accumulator, object) => {
            let objectName = object.get("name");
            let normalizedName = objectName.toLowerCase();
            if (!normalizedName.includes("repeating_effects") || !normalizedName.includes("type")) {
                return accumulator;
            }
            let id = objectName.replace("repeating_effects_", "").replace(/_\w*[Tt]{1}ype/, "");
            accumulator.push({
                id: id,
                characterid: character.id
            });
            return accumulator;
        }, []);
        return effects;
    };

    const performAdditionalEffectChanges = (id, effect, character) => {
        switch ((effect.specialType || effect.type).toLowerCase()) {
            case "astral fire": {
                // Clear MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off");
                setAttribute(mpRecoveryBlock, "current", "on");
                break;
            }
            case "attribute(x)": {
                let definition = effect.value.split(",");
                if (!definition) {
                    logger.d("No value given for attribute(x)");
                    return;
                }
                let attributeName = definition[0];
                if (!["str", "dex", "vit", "int", "mnd", "defense", "magicdefense", "vigilance", "speed"].includes(attributeName.toLowerCase())) {
                    logger.d(`Unsupported attribute for attribute(x): ${attributeName}, from value ${effect.value}`);
                    return;
                }
                let baseAttributeName;
                if (getAttrByName(character.id, `${attributeName}Block`) === "on") {
                    baseAttributeName = `${attributeName}Unblocked`;
                } else {
                    baseAttributeName = attributeName;
                }
                let attribute = unpackAttribute(character, baseAttributeName, 0);
                let attributeValue = attribute.get("current");
                if (attributeValue === 0) {
                    logger.d(`Couldn't find attribute ${baseAttributeName} on character ${character.get("name")}`);
                    return;
                }
                var value = 1;
                if (definition.length > 1) {
                    value = unpackNaN(definition[1], 1);
                }
                logger.d(`attribute(x) increments ${baseAttributeName} by ${value}`);
                setAttribute(attribute, "current", attributeValue + value);

                let originalAttribute = unpackAttribute(character, `${attributeName}Original`, "");
                if (isNaN(parseInt(originalAttribute.getr("current")))) {
                    setAttribute(originalAttribute, "current", attributeValue);
                }

                let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                setAttribute(attributeReference, "current", attributeName);

                let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                setAttribute(attributeValueReference, "current", value);
                break;
            }
            case "barrier": {
                let barrierPoints = unpackAttribute(character, "barrierPoints", 0);
                let currentPoints = unpackNaN(barrierPoints.get("current"));
                let value = unpackNaN(effect.value);

                setAttribute(barrierPoints, "current", Math.max(currentPoints, value));
                break;
            }
            case "bound": {
                let attributes = [];
                attributes.push(unpackAttribute(character, "speed", 0));
                if (unpackAttribute(character, "speedBlock", "off").get("current") === "on") {
                    attributes.push(unpackAttribute(character, "speedUnblocked", 0));
                }

                let diff;
                if (getAttrByName(character.id, "size") === "large") {
                    attributes.forEach(attribute => setAttribute(attribute, "current", unpackNaN(attribute.get("current")) - 2));
                    diff = 2;
                } else {
                    diff = unpackNaN(attributes[0].get("current"));
                    attributes.forEach(attribute => setAttribute(attribute, "current", 0));
                }

                let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                setAttribute(attributeReference, "current", "speed");
                let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                setAttribute(attributeValueReference, "current", -diff);
                break;
            }
            case "clear":
            case "clear enfeeblements":
            case "transcendent": {
                logger.d("Clearing all enfeeblements");
                removeEffectsForFilter(character, (attributeId, name, attribute) => {
                    return attributeId !== id && name === "statusType" && attribute.get("current").trim().toLowerCase() === "enfeeblement";
                });
                break;
            }
            case "comatose":
            case "knocked out": {
                // Trigger the rest action to clear out all prior effects
                logger.d(`Triggering character rest due to ${effect.specialType || effect.type}`);
                removeEffectsForFilter(character, (attributeId, name, attribute) => {
                    return attributeId !== id && name === "expiry" && !["end", "permanent"].includes(attribute.get("current"));
                });
                break;
            }
            case "defender's boon": {
                let effectValue = unpackNaN(effect.value, 1);
                let defense = unpackAttribute(character, "defense", 0);
                let magicDefense = unpackAttribute(character, "magicDefense", 0);

                let defenseValue = defense.get("current");
                let magicDefenseValue = magicDefense.get("current");
                if (defenseValue === 0 || magicDefenseValue === 0) {
                    logger.d("Character has no defense; unable to apply Defender's Boon");
                    return;
                } else if (defenseValue === magicDefenseValue) {
                    logger.d("No effect from Defender's Boon - same value");
                    return;
                } else if (defenseValue < magicDefenseValue) {
                    logger.d("Defender's Boon increments Defense by " + effectValue);
                    setAttribute(defense, "current", defenseValue + effectValue);

                    let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                    setAttribute(attributeReference, "current", "defense");

                    let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                    setAttribute(attributeValueReference, "current", effectValue);
                } else if (magicDefenseValue < defense) {
                    logger.d("Defender's Boon increments Magic Defense by " + effectValue);
                    setAttribute(magicDefense, "current", magicDefenseValue + effectValue);

                    let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                    setAttribute(attributeReference, "current", "magicDefense");

                    let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                    setAttribute(attributeValueReference, "current", effectValue);
                }
                break;
            }
            case "slow":
            case "heavy": {
                let speed = unpackAttribute(character, "speed", 0);
                let originalSpeed = unpackAttribute(character, "speedOriginal", 0);

                let originalSpeedValue = parseInt(originalSpeed.get("current"));
                let currentSpeedValue = parseInt(speed.get("current"));
                let speedValue = originalSpeedValue > 0 ? originalSpeedValue : currentSpeedValue;
                let newValue = Math.floor(speedValue / 2) + speedValue % 2;

                let speedBlock = unpackAttribute(character, "speedBlock", "off");
                if (speedBlock.get("current") === "on") {
                    logger.d(`Speed was already blocked when activating ${effect.type}`);
                } else {
                    setAttribute(speedBlock, "current", "on");

                    let speedUnblocked = unpackAttribute(character, "speedUnblocked", "");
                    setAttribute(speedUnblocked, "current", speed.get("current"));

                    setAttribute(originalSpeed, "current", speedValue);
                }

                let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                setAttribute(attributeReference, "current", "speed");

                let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                setAttribute(attributeValueReference, "current", newValue - speedValue);
                break;
            }
            case "umbral ice": {
                // Reset MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off");
                setAttribute(mpRecoveryBlock, "current", "off");
                break;
            }
        }

        if (!effect.abilities) {
            return;
        }

        logger.d("Creating abilities for effect");
        for (let section of Object.entries(effect.abilities)) {
            let sectionName = section[0];
            for (let ability of section[1]) {
                logger.d("Creating ability " + ability.title);
                let id = generateRowID();
                for (let entry of Object.entries(ability)) {
                    var attributeValue = entry[1];
                    if (effect.value && attributeValue && isNaN(attributeValue)) {
                        attributeValue = attributeValue.replace("{value}", effect.value);
                    }
                    createObj("attribute", { characterid: character.id, name: `repeating_${sectionName}_${id}_${entry[0]}`, current: attributeValue });
                }
                createObj("attribute", { characterid: character.id, name: `repeating_${sectionName}_${id}_repeatingOverride`, current: "auto" });
                createObj("attribute", { characterid: character.id, name: `repeating_${sectionName}_${id}_augment`, current: "1" });
            }
        }
    };

    const addEffect = (effect) => {
        let summaryIntro = `${effect.typeName.replace("X", effect.value)} to `;
        var summaries = [];

        logger.d(`Adding effect ${effect.typeName} to ${effect.characters.length} character(s)`);
        for (let character of effect.characters) {
            let existingEffects = getEffectsWithName(effect.specialType ?? effect.type, character);
            if (effect.duplicate === "block") {
                if (existingEffects.some(element => element.characterid === character.id)) {
                    logger.d(`Skipping ${character.get("name")} due to duplicate effect`);
                    continue;
                }
            }

            var update = false;
            var id = "";
            if (effect.duplicate == "replace") {
                let duplicate = existingEffects.find(element => element.characterid == character.id);
                if (duplicate) {
                    // Overwrite the contents of the effect with the new specification
                    id = duplicate.id;
                    update = true;
                    logger.d(`Replacing existing effect`);
                } else {
                    id = generateRowID();
                }
            } else {
                id = generateRowID();
            }

            if (effect.expiry != "ephemeral") {
                let attributes = {
                    icon: effect.icon,
                    type: effect.type,
                    statusType: effect.statusType,
                    specialType: effect.specialType,
                    source: effect.source,
                    description: effect.description,
                    name: effect.typeName,
                    value: effect.value,
                    expiry: effect.expiry,
                    editable: ["1", "on"].includes(effect.editable) ? "on" : "off",
                    curable: ["1", "on"].includes(effect.curable) ? "on" : "off",
                    origin: effect.origin,
                    effectsExpandItem: "on"
                };
                for (let entry of Object.entries(attributes)) {
                    if (!entry[1]) {
                        continue;
                    }

                    if (update) {
                        let object = unpackAttribute(
                            character,
                            `repeating_effects_${id}_${entry[0]}`,
                            null
                        );
                        setAttribute(object, "current", entry[1]);
                    } else {
                        createObj("attribute", {
                            name: `repeating_effects_${id}_${entry[0]}`,
                            current: entry[1],
                            characterid: character.id
                        });
                    }
                }
            }
            summaries.push(character.get("name"));
            performAdditionalEffectChanges(id, effect, character);
        }
        let summary = summaryIntro + summaries.join(", ");
        return { who: effect.who, summary: summary };
    };

    const outputEvent = (type, event) => {
        switch (type) {
            case "add":
                sendChat(event.who, `Added effect: <b>${event.summary}</b>. <i>(FFXIVAddEffect)</i>`);
                break;

            case "error":
                sendChat("FFXIV Effects", `/w gm ${event}`);
                break;

            default:
                logger.i(`Unrecognized type: ${type}`);
                break;
        }
    };

    const help = () => {

        let helpContent = `<h4>${scriptName} !eos --help</h4>` +
            `<h5>Arguments</h5>` +
            `<li><code>--{name}</code> - Required: The name of the effect</li>` +
            `<li><code>--source {X}</code> - Required: The name of the effect's originator</li>` +
            `<hr />` +
            `<h5>Options</h5>` +
            `<ul>` +
            `<li><code>--help</code> - displays this message in chat.</li>` +
            `<li><code>--v {X}</code> - the value for the effect, useful for some effects like attribute(x), which expects a value to apply to an attribute. <b>Default:</b> no value.</li>` +
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
            `</ul>` +
            `<li><code>--l {X}</code> - the level of the effect, for any cases where that may matter. <b>Default:</b> no value.</li>` +
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
        }
        lastMessage.content = msg.content;
        lastMessage.who = msg.who;
        lastMessage.time = time;

        let who = (getObj("player", msg.playerid) || { get: () => "API" }).get("_displayname");
        let args = msg.content.split(/\s+--/);

        let effect = {
            id: "-1",
            type: "none",
            statusType: "Enhancement",
            typeName: "",
            specialType: "",
            value: "",
            source: "",
            abilities: undefined,
            expiry: "turn",
            editable: "1",
            target: "selected",
            characters: [],
            player: msg.playerid,
            who: who,
            origin: "FFXIVAddEffect",
            level: null
        };

        logger.d("==============================================");
        logger.d("Parsing command " + msg.content);
        logger.d("==============================================");
        for (let a of args) {
            let parts = a.split(/\s+/);
            switch (parts[0].toLowerCase()) {
                case "!ffe":
                    // Do nothing for the API keyword
                    break;

                case "help":
                    help();
                    return;

                case "v":
                    effect.value = parts[1];
                    break;

                case "source":
                    effect.source = parts[1];
                    break;

                case "expire": {
                    let expiry = parts[1].toLowerCase();
                    if (effectData.expiryTypes.includes(expiry)) {
                        effect.expiry = expiry;
                    } else {
                        logger.i("Unrecognized expiry type " + expiry);
                        return;
                    }
                    break;
                }

                case "edit":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effect.editable = parts[1];
                    } else {
                        logger.i("Unrecognized editable type " + parts[1]);
                        return;
                    }
                    break;

                case "curable":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effect.curable = parts[1];
                    } else {
                        logger.i("Unrecognized curable type " + parts[1]);
                        return;
                    }
                    break;

                case "dupe":
                    if (["block", "replace", "allow"].includes(parts[1])) {
                        effect.duplicate = parts[1];
                    } else {
                        logger.i("Unrecognized dupe type " + parts[1]);
                        return;
                    }
                    break;

                case "t": {
                    let target = parts.slice(1).join(" ");
                    effect.target = target;
                    break;
                }

                case "l": {
                    let parsedLevel = parseInt(parts[1]);
                    if (isNaN(parsedLevel)) {
                        logger.i("Invalid level value " + parts[1]);
                        return;
                    }
                    effect.level = parsedLevel;
                    break;
                }

                default: {
                    let name = parts.join(" ");
                    let match = effectData.matches.find(type => type.matches.includes(name.toLowerCase())) ?? { type: "special", specialType: name };
                    let specialType;
                    if (match.type == "special") {
                        specialType = match.specialType;
                        effect.maskedType = match.maskedType;
                        effect.typeName = match.specialType;
                        if (match.ability) {
                            effect.abilities = effectData.abilities[match.ability];
                        }
                    } else {
                        specialType = "";
                        effect.typeName = match.name;
                    }
                    effect.type = match.type;
                    effect.statusType = match.statusType;
                    effect.specialType = specialType;
                    effect.description = match.description;
                    break;
                }
            }
        }
        if (!effect.source) {
            logger.i("No source given");
            help();
            return;
        }
        if (effect.type == "none") {
            logger.i("Found no matching effect for " + msg.content);
            return;
        }
        effect.icon = effectData.icon(effect);
        let targetResult = getCharacters(msg, effect.target);
        if (targetResult.error) {
            outputEvent("error", targetResult.error);
            return;
        }

        effect.characters = targetResult.result;
        let event = addEffect(effect);
        if (!playerIsGM(msg.playerid)) {
            outputEvent("add", event);
        }
    };

    const registerEventHandlers = () => {
        on("chat:message", handleInput);
    };

    on("ready", () => {
        state[scriptName] = {
            version: version
        };
        registerEventHandlers();
    });
})();