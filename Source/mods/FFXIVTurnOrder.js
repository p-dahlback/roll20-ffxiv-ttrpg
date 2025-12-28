/*
    FFXIVTurnOrder.js

    An API that performs resource recovery for respective Adventurer and Enemy teams when encountering the following custom turn orders:
    * End of Adventurer Step
    * End of Enemy Step
  
    MP update is performed on token bar3. Tokens need to be attached to a sheet to check the attributes:
    * mpRecovery - an integer value of how much MP will be recovered at the end of a given step
    * team - string value controlling which steps will trigger recovery. Valid values are "adventurer" or "enemy".
    
    Resource update is only performed on sheets with "sheet_type" attribute set to "unique". The sheet will also be checked for the following attributes:
    * resource - The name of the resource
    * resourceValue - The current and max values of the resource
    * resourceRecovery - an integer value of how much resource will be recovered at the end of the given step
    
    For jobs with additional resources like Monk, the additional resource can also be updated:
    * resource2 - The name of the secondary resource
    * resource2Value - The current and max values of the secondary resource
    * resource2Recovery - an integer value of how much secondary resource will be recovered at the end of the given step

    ---

    The API further supports expiring enhancements/enfeeblements on turn change, as well as configuration via chat.
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
/*build:import turnorder/effectResolver.js*/
/*build:import turnorder/resourceResolver.js*/
const FFXIVTurnOrderImports = {};
/*build:end*/

// eslint-disable-next-line no-unused-vars
const FFXIVTurnOrder = (() => {
    const scriptName = "FFXIVTurnOrder";
    const version = "0.1.0";

    let config = {
        recover: true,
        manageEffects: true,
        manageEffectRemoval: true,
        blockUntilEmpty: false,
        blockTurn: 0,
        block: false
    };

    let imports = FFXIVTurnOrderImports.export;
    let logger = new imports.Logger(scriptName, true);

    var lastTurnOrder = "";
    var lastMessage = {
        content: "",
        who: "",
        time: 0
    };

    var newEncounter = false;

    const tokenCharacterForTurn = (turn) => {
        let token = getObj("graphic", turn.id);
        if (!token || !token.get("represents")) {
            logger.d("Token or character missing");
            return undefined;
        }
        let character = getObj("character", token.get("represents"));
        return { token: token, character: character };
    };

    const effectResolver = (token, character, effectCache) => {
        let sheetType = imports.unpackAttribute(character, "sheet_type").get("current");
        let engineFactory = function(sheetType, token, character) {
            if (sheetType === "unique") {
                return new imports.ModEngine(logger, character);
            }
            return new imports.TokenEngine(logger, token, character, effectCache);
        };
        let engine = engineFactory(sheetType, token, character);
        let removeEffects = new imports.RemoveEffects(engine);
        return new imports.EffectResolver(engine, removeEffects, engineFactory);
    };

    const manageEffectsOnTurnChange = (turn, expiries, turnChange, shouldUpdateExpiries) => {
        if (!config.manageEffects) {
            logger.d("Skipping effect changes; disabled in config.");
            return;
        }

        let tokenCharacter = tokenCharacterForTurn(turn);
        if (!tokenCharacter || !tokenCharacter.character || !tokenCharacter.token) {
            logger.d("No token/character found");
            return;
        }
        
        logger.d(`Perform ${turnChange} for ${tokenCharacter.token.get("name")}`);
        let effectCache = new imports.EffectCache(state["FFXIVCache"].effects);
        let resolver = effectResolver(tokenCharacter.token, tokenCharacter.character, effectCache);
        if (!resolver) {
            return;
        }
        let resolverSummary;
        resolver.resolve(expiries, shouldUpdateExpiries, summary => {
            if (!summary) {
                logger.d("No effects removed.");
                return;
            }
            resolverSummary = summary;
        });
        state["FFXIVCache"].effects = effectCache;
        return resolverSummary;
    };

    const performRecoveryForToken = (token, character) => {
        if (!config.recover) {
            logger.d(`Skipping recovery for ${character.get("name")}; disabled in config.`);
            return;
        }
        if (!token) {
            return;
        }

        let resolver = new imports.ResourceResolver(logger);
        let summaries = [
            resolver.recoverMp(token, character),
            resolver.recoverResource(character, "resource"),
            resolver.recoverResource(character, "resource2")
        ].filter(element => element);

        return summaries.join(", ");
    };
 
    const performStartOfStep = (turnOrder, affectedTeam) => {
        for (let i = 0; i < turnOrder.length; i++) {
            let turn = turnOrder[i];
            let tokenCharacter = tokenCharacterForTurn(turn);
            if (!tokenCharacter) {
                continue;
            }
            let team = getAttrByName(tokenCharacter.character.id, "team");
            if (team != affectedTeam) {
                if (newEncounter) {
                    let summary = manageEffectsOnTurnChange(turn, ["encounterstart"], "Start of encounter", false);
                    postSummary(tokenCharacter, summary, "Start of encounter");
                }
                continue;
            }
            var expiries = ["stepstart"];
            var turnType = "step";
            if (i == 0) {
                expiries.push("start");
                turnType += "/turn";
            }
            if (newEncounter) {
                expiries.push("encounterstart");
                turnType += "/encounter";
            }
            let summary = manageEffectsOnTurnChange(turn, expiries, `Start of ${turnType}`, false);
            postSummary(tokenCharacter, summary, `Start of ${turnType}`);
        }
        newEncounter = false;
    };

    const performEndOfStep = (turnOrder, affectedTeam) => {
        for (let turn of turnOrder) {
            let tokenCharacter = tokenCharacterForTurn(turn);
            if (!tokenCharacter) {
                continue;
            }
            let team = getAttrByName(tokenCharacter.character.id, "team");
            if (team != affectedTeam) {
                if (affectedTeam === "enemy") {
                    // Enemies go last, so this ends the round for everyone
                    let summary = manageEffectsOnTurnChange(turn, ["round"], "End of round", false);
                    postSummary(tokenCharacter, summary, "End of round");
                }
                continue;
            }

            let expiries;
            let stepType;
            let forcePost;
            if (team === "enemy") {
                // The end of the [Enemy step] marks the end of the round
                expiries = ["step", "round"];
                stepType = "round";
                forcePost = false;
            } else {
                expiries = ["step"];
                stepType = "step";
                forcePost = true;
            }
            let recoverySummary = performRecoveryForToken(tokenCharacter.token, tokenCharacter.character, `End of ${stepType}`);
            let effectSummary = manageEffectsOnTurnChange(turn, expiries, `End of ${stepType}`, false);
            let fullSummary = [recoverySummary, effectSummary].filter(element => element).join("</li><li>");
            postSummary(tokenCharacter, fullSummary, `End of ${stepType}`, forcePost);
        }
    };

    const performStartOfTurn = (turn) => {
        let summary = manageEffectsOnTurnChange(turn, ["start"], "Start of turn", false);
        postSummary(tokenCharacterForTurn(turn), summary, "Start of turn");
    };

    const performEndOfTurn = (turn) => {
        let summary = manageEffectsOnTurnChange(turn, ["turn"], "End of turn", true);
        postSummary(tokenCharacterForTurn(turn), summary, "End of turn");
    };

    const performEndOfPhase = (campaign) => {
        let turnOrder = JSON.parse(campaign.get("turnorder") ?? "[]");
        for (let turn of turnOrder) {
            if (turn.custom) {
                continue;
            }
            let summary = manageEffectsOnTurnChange(turn, ["phase"], "End of phase", true);
            postSummary(tokenCharacterForTurn(turn), summary, "End of phase");
        }
    };

    const postSummary = (tokenCharacter, summary, turnChange, forcePost=false) => {
        if (!summary && !forcePost) {
            return;
        } else {
            summary = summary || "No changes";
        }
        let team = getAttrByName(tokenCharacter.character.id, "team");
        let prefix;
        if (team === "enemy") {
            prefix = "/w gm ";
        } else {
            prefix = "";
        }
        logger.d(`Notifying chat of update: ${summary}`);
        let fullSummary = `${prefix}<h4>${turnChange}:</h4><ul><li>${summary}</li></ul>`;
        try {
            sendChat(tokenCharacter.token.get("name"), fullSummary);
        } catch (e) {
            logger.i(`ERROR PARSING: ${summary}`);
            logger.i(`ERROR: ${e}`);
        }
    };

    const oppositeTeam = (team) => {
        switch (team) {
            case "enemy": return "adventurer";
            case "adventurer": return "enemy";
            default: return team;
        }
    };

    const teamForStep = (step) => {
        switch (step.custom) {
            case "End of Adventurer Step":
                return "adventurer";
            case "End of Enemy Step":
                return "enemy";
            default:
                return "";
        }
    };

    const validateTurnOrder = (turnOrder, previousTurnOrder) => {
        let firstInTurn = turnOrder.length > 0 ? turnOrder[0] : { id: "-1" };
        let previousFirstInTurn = previousTurnOrder.length > 0 ? previousTurnOrder[0] : { id: "-1" };

        // Check prerequisites before proceeding
        if (turnOrder.length === 0) {
            logger.d("Turn order is empty; no action to perform");
            config.blockUntilEmpty = false;
            return false;
        }

        if (config.block) {
            logger.d("Mod configured to block all activity; not performing any actions.");
            return false;
        }

        if (turnOrder.length > previousTurnOrder.length) {
            logger.d("Turn added; not performing any actions.");
            logger.d("----------");
            return false;
        }

        if (
            turnOrder[0].id === previousTurnOrder[previousTurnOrder.length - 1].id &&
            turnOrder[0].custom === previousTurnOrder[previousTurnOrder.length - 1].custom
        ) {
            logger.d("Running turn backwards; not performing any actions.");
            logger.d("----------");
            return false;
        }

        if (config.blockTurn > 0) {
            logger.d(`Blocking changes for ${config.blockTurn} turns; not performing any actions.`);
            logger.d("----------");
            config.blockTurn--;
            return false;
        }

        if (firstInTurn.id === previousFirstInTurn.id && firstInTurn.id !== "-1") {
            logger.d("Same character; ignore");
            logger.d("----------");
            return false;
        }
        return true;
    };

    const checkTurnOrder = (obj, prev, force) => {
        logger.d("==============================================");
        logger.d("Checking turn order");
        logger.d("==============================================");
        let turnOrder = JSON.parse(obj.get("turnorder") ?? "[]");
        let previousTurnOrder = JSON.parse(prev.turnorder ?? "[]");
        let firstInTurn = turnOrder.length > 0 ? turnOrder[0] : { id: "-1" };
        let previousFirstInTurn = previousTurnOrder.length > 0 ? previousTurnOrder[0] : { id: "-1" };

        if (force) {
            logger.d("Forcing start of turn for current token");
        } else if (!validateTurnOrder(turnOrder, previousTurnOrder)) {
            return;
        }

        if (previousFirstInTurn.id != "-1") {
            performEndOfTurn(previousFirstInTurn);
        }

        if (firstInTurn.custom && firstInTurn.custom !== previousFirstInTurn.custom) {
            // End of team step occurs when the related custom turn reaches first in turn order
            logger.d("Custom step discovered");
            let affectedTeam = teamForStep(firstInTurn);
            if (!affectedTeam) {
                logger.d("No team step; ignore");
                return;
            }
            logger.d(`Perform end of step for team ${affectedTeam}`);
            performEndOfStep(turnOrder, affectedTeam);
        } else if (previousFirstInTurn.custom && firstInTurn.custom !== previousFirstInTurn.custom) {
            // Start of team step occurs when the step for the opposite team has passed in the turn order
            let affectedTeam = oppositeTeam(teamForStep(previousFirstInTurn));
            if (affectedTeam) {
                logger.d(`Perform start of step for team ${affectedTeam}`);
                performStartOfStep(turnOrder, affectedTeam);
            } else {
                // The custom step had no team; just run start of turn on the current first in turn order.
                performStartOfTurn(firstInTurn);
            }
        } else if (firstInTurn.id != "-1") {
            if (previousTurnOrder.length === 0) {
                // Start of encounter occurs if there is no previous state
                newEncounter = true;
                performStartOfStep(turnOrder, "adventurer");
            } else {
                performStartOfTurn(firstInTurn);
            }
        }
        logger.d("----------");
    };

    const handleInput = (msg) => {
        if ("api" !== msg.type) {
            return;
        }
        if (!msg.content.match(/^!fft(\b\s|$)/)) {
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

        logger.d("==============================================");
        logger.d(`Parsing command ${msg.content}`);
        logger.d("==============================================");
        let args = msg.content.split(/\s+--/);

        for (let a of args) {
            let parts = a.split(/\s+/);
            switch (parts[0].toLowerCase()) {
                case "!fft":
                    // Do nothing for the API keyword
                    break;

                case "help": {
                    let helpContent = `<h4>${scriptName} !fft --help</h4>` +
                        `<p>Note that passing of turns only applies in one direction, and that adding to the turn order does not count as passing a turn.</p>` +
                        `<h5>Options</h5><ul>` +
                        `<li><code>--help</code> - displays this message in chat.</li>` +
                        `<li><code>--clean</code> - cleans out the internal cache for token status markers.</li>` + 
                        `<li><code>--block X</code> - block any turn management until X turns have passed in the turn order.</li>` +
                        `<li><code>--config</code> - output the current configuration of ${scriptName} to chat.</li>` +
                        `<li><code>--end</code> - blocks any turn management until the Turn Order has been rendered empty.</li>` +
                        `<li><code>--force</code> - immediately carries out turn management on the current first in turn order.</li>` +
                        `<li><code>--fx X</code> - enables/disables the effect management part of turn management. 1 or on to enable, 0 or off to disable.</li>` +
                        `<li><code>--phase</code> - activates a phase shift, which expires phase-dependent effects.</li>` +
                        `<li><code>--recover X</code> - enables/disables the resource recovery part of turn management. 1 or on to enable. 0 or off to disable.</li>` +
                        `<li><code>--reset</code> - resets the configuration to standard: no blocks on turn management, all subsystems enabled.</li>` +
                        `<li><code>--start</code> - removes any blocks on turn management and runs <code>--force</code> on the current first in turn order. For effect management, this will be treated as the start of the encounter.</li>` +
                        `<li><code>--stop</code> - blocks all turn management until <code>--start</code> or <code>--reset</code> is called.</li>` +
                        `</ul>`
                        ;
                    try {
                        sendChat(scriptName, helpContent);
                    } catch (e) {
                        logger.i(`ERROR: ${e}`);
                    }
                    break;
                }

                case "clean": {
                    state["FFXIVCache"] = {
                        effects: new imports.EffectCache()
                    };
                    return;
                }

                case "block": {
                    if (parts.length === 1) {
                        logger.d("Blocking all future activity.");
                        config.blockTurn = 10000;
                        return;
                    }

                    let turns = parseInt(parts[1]);
                    if (isNaN(turns)) {
                        logger.i(`Unrecognized --block value ${parts[1]}`);

                        try {
                            sendChat(scriptName, `Unrecognized block value in ${msg.content}`);
                        } catch (e) {
                            logger.i(`ERROR: ${e}`);
                        }
                    } else {
                        logger.d(`Blocking activity for ${turns} turns.`);
                        config.blockTurn = turns;
                    }
                    break;
                }
                case "config":
                    try {
                        sendChat(scriptName, `<h4>Current ${scriptName} configuration</h4><ul><li>Auto-recovery: ${config.recover}</li><li>Effect management: ${config.manageEffects}</li><li>Number of turns to block activity: ${config.blockTurn}</li><li>Block until turn order is empty: ${config.blockUntilEmpty}</li></ul>`);
                    } catch (e) {
                        logger.i(`ERROR: ${e}`);
                    }
                    break;
                case "end": {
                    logger.d("Blocking activity until the turn order has been cleared.");
                    config.blockUntilEmpty = true;
                    break;
                }
                case "force":
                    logger.d("Forcing a repeat of starting the current turn");
                    checkTurnOrder(Campaign(), { turnorder: lastTurnOrder }, true);
                    break;
                case "fx":
                    if (parts[1] === "1" || parts[1] === "on") {
                        logger.d("Enabling effect management");
                        config.manageEffects = true;
                    } else if (parts[1] === "0" || parts[1] === "off") {
                        logger.d("Disabling effect management");
                        config.manageEffects = false;
                    } else {
                        logger.i(`Unrecognized --fx setting ${parts[1]}`);

                        try {
                            sendChat(scriptName, `Unrecognized fx value in ${msg.content}`);
                        } catch (e) {
                            logger.i(`ERROR: ${e}`);
                        }
                        return;
                    }
                    break;
                case "phase":
                    logger.d("Triggering phase shift");
                    config.blockUntilEmpty = false;
                    config.blockTurn = 0;
                    config.block = false;
                    performEndOfPhase(Campaign());
                    break;
                case "recover":
                    if (parts[1] === "1" || parts[1] === "on") {
                        logger.d("Enabling resource recovery");
                        config.recover = true;
                    } else if (parts[1] === "0" || parts[1] === "off") {
                        logger.d("Disabling resource recovery");
                        config.recover = false;
                    } else {
                        logger.i(`Unrecognized --recover setting ${parts[1]}`);

                        try {
                            sendChat(scriptName, `Unrecognized recover value in ${msg.content}`);
                        } catch (e) {
                            logger.i(`ERROR: ${e}`);
                        }
                        return;
                    }
                    break;
                case "reset":
                    logger.d("Resetting configuration to standard.");
                    config.recover = true;
                    config.manageEffects = true;
                    config.blockUntilEmpty = false;
                    config.blockTurn = 0;
                    config.block = false;
                    break;
                case "start":
                    logger.d("Resetting any turn management blocks");
                    config.blockUntilEmpty = false;
                    config.blockTurn = 0;
                    config.block = false;
                    checkTurnOrder(Campaign(), { turnorder: "[]" }, true);
                    break;
                case "stop":
                    logger.d("Blocking all turn management");
                    config.block = true;
                    break;
                default:
                    try {
                        sendChat(scriptName, `Unrecognized argument ${parts[0]} in ${msg.content}`);
                    } catch (e) {
                        logger.i(`ERROR: ${e}`);
                    }
                    break;
            }
        }
    };

    const registerEventHandlers = () => {
        on(
            "change:campaign:turnorder",
            (obj, prev) => {
                let campaign = Campaign();
                let turnorder = campaign.get("turnorder");
                if (turnorder === lastTurnOrder) {
                    logger.d("Duplicate request, ignoring");
                    return;
                }
                lastTurnOrder = turnorder;
                checkTurnOrder(Campaign(), prev, false);
            }
        );
        on("chat:message", handleInput);
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