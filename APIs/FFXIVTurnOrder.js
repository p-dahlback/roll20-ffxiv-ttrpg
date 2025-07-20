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

    let logger = new class {

        constructor(debug) {
            this.debug = debug;
        }

        d(string) {
            if (this.debug) {
                log(`${scriptName}: ${string}`);
            }
        }

        i(string) {
            log(`${scriptName}: ${string}`);
        }
    }(true);

    var lastTurnOrder = "";
    var newEncounter = false;

    const unpackNaN = (value, defaultValue = 0) => {
        let intValue = parseInt(value);
        if (isNaN(intValue)) {
            return defaultValue;
        }
        return intValue;
    };

    const generateUUID = (() => {
        let a = 0;
        let b = [];
        return () => {
            let c = (new Date()).getTime() + 0;
            let f = 7;
            let e = new Array(8);
            let d = c === a;
            a = c;
            for (; 0 <= f; f--) {
                e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                c = Math.floor(c / 64);
            }
            c = e.join("");
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--) {
                    b[f] = 0;
                }
                b[f]++;
            } else {
                for (f = 0; 12 > f; f++) {
                    b[f] = Math.floor(64 * Math.random());
                }
            }
            for (f = 0; 12 > f; f++) {
                c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
            }
            return c;
        };
    })();

    const generateRowID = () => generateUUID().replace(/_/g, "Z");

    const tokenCharacterForTurn = (turn) => {
        let token = getObj("graphic", turn.id);
        if (!token || !token.get("represents")) {
            logger.d("Token or character missing");
            return undefined;
        }
        let character = getObj("character", token.get("represents"));
        return { token: token, character: character };
    };

    const handleSpecialEffects = (character, effectName) => {
        switch (effectName.trim().toLowerCase()) {
            case "astral fire": {
                logger.d("Cancelling MP recovery block from Astral Fire");
                let mpRecoveryBlock = findObjs({ type: "attribute", characterid: character.id, name: "mpRecoveryBlock" })[0];
                mpRecoveryBlock.set("current", "off");
                break;
            }
            case "lightweight refit - proc": {
                logger.d("Resetting speed from Lightweight Refit");
                let speed = findObjs({ type: "attribute", characterid: character.id, name: "speed"})[0];
                if (speed) {
                    let currentValue = unpackNaN(speed.get("current"), 6);
                    speed.set("current", Math.max(currentValue - 1, 0));
                } else {
                    createObj("attribute", { characterid: character.id, current: 5 });
                }
                break;
            }
            case "lucid dreaming": {
                logger.d("Cancelling extra MP recovery from Lucid Dreaming");
                let mpRecovery = findObjs({ type: "attribute", characterid: character.id, name: "mpRecovery" })[0];
                mpRecovery.set("current", "2");
                break;
            }
        }
    };

    const isEffectTypeExecutable = (type, expiries) => {
        switch (type.trim().toLowerCase()) {
            case "aetherial focus":
                return expiries.includes("encounterstart");
            case "dot(x)":
                return expiries.includes("step");
            case "improved padding":
                return expiries.includes("stepstart");
            case "lightweight refit":
                return expiries.includes("encounterstart");
            case "precision opener":
                return expiries.includes("encounterstart");
            case "regen(x)":
                return expiries.includes("step");
            default:
                return false;
        }
    };

    const actionableEffects = (character, attributes, expiries, updateNextTurnExpiries) => {
        return attributes.reduce(
            (accumulator, currentValue) => {
                let match = currentValue.get("name").match(/^repeating_effects_([-\w]+)_([\w_]+)$/);
                if (!match || match.length < 3) {
                    return accumulator;
                }
                let id = match[1];

                switch (match[2]) {
                    case "expiry": {
                        let expiry = currentValue.get("current");
                        if (expiries.includes(expiry)) {
                            accumulator.ids.push(id);
                        } else if (updateNextTurnExpiries && expiry === "turn2") {
                            accumulator.toUpdate.push(currentValue);
                        }
                        break;
                    }
                    case "type":
                    case "specialType": {
                        let type = currentValue.get("current");
                        if (isEffectTypeExecutable(type, expiries)) {
                            if (accumulator.toExecute[id]) {
                                accumulator.toExecute[id].name = type;
                            } else {
                                accumulator.toExecute[id] = {
                                    name: type
                                };
                            }
                        }
                        break;
                    }
                    case "value": {
                        if (accumulator.toExecute[id]) {
                            accumulator.toExecute[id].value = currentValue.get("current");
                        } else {
                            // Assign into toExecute just in case
                            accumulator.toExecute[id] = {
                                value: currentValue.get("current")
                            };
                        }
                        break;
                    }
                }
                return accumulator;
            },
            { ids: [], toUpdate: [], toExecute: {} }
        );
    };

    const executeEffect = (character, name, value) => {
        switch (name.trim().toLowerCase()) {
            case "aetherial focus": {
                let magicPoints = findObjs({ type: "attribute", characterid: character.id, name: "magicPoints" })[0];
                if (magicPoints) {
                    var max = parseInt(magicPoints.get("max"));
                    if (isNaN(max)) {
                        max = 5;
                    }
                    magicPoints.set("current", max + 1);
                } else {
                    createObj("attribute", { characterid: character.id, name: "magicPoints", current: 6, max: 5 });
                }
                return [`<b>Aetherial Focus</b>, giving 1 additional MP (6/5)`];
            }
            case "dot(x)": {
                var damage = unpackNaN(value);
                if (damage < 1) {
                    logger.i("Unable to perform dot(x); no value given");
                    return [];
                }
                let hitPoints = findObjs({ type: "attribute", characterid: character.id, name: "hitPoints" })[0];
                if (!hitPoints) {
                    logger.i("Unable to perform dot(x); no hitPoints");
                    return [];
                }

                let barrierPoints = findObjs({ type: "attribute", characterid: character.id, name: "barrierPoints" })[0];
                var barrierDefinition = "";
                if (barrierPoints) {
                    let barrierValue = unpackNaN(barrierPoints.get("current"));
                    if (barrierValue > 0) {
                        var newBarrierValue = barrierValue - damage;
                        damage = -newBarrierValue;

                        newBarrierValue = Math.max(newBarrierValue, 0);
                        barrierPoints.set("current", newBarrierValue);
                        barrierDefinition = `${barrierValue} to ${newBarrierValue} Barrier`;
                    }
                }

                var hitPointDefinition = "";
                if (damage > 0) {
                    let hitPointValue = unpackNaN(hitPoints.get("current"));
                    let max = unpackNaN(hitPoints.get("max"));
                    let newValue = Math.max(hitPointValue - damage, 0);
                    hitPoints.set("current", newValue);
                    hitPointDefinition = `${hitPointValue} to ${newValue}/${max} HP`;
                }
                let changeSummary = [barrierDefinition, hitPointDefinition].filter(element => element).join(", ");
                return [`<b>DOT (${value})</b> (${changeSummary})`];
            }
            case "improved padding": {
                let barrierPoints = findObjs({ type: "attribute", characterid: character.id, name: "barrierPoints" })[0];
                if (barrierPoints) {
                    let value = unpackNaN(barrierPoints.get("current"));
                    if (value < 1) {
                        barrierPoints.set("current", 1);
                        return [`Improved Padding (1 Barrier)`];
                    }
                } else {
                    createObj("attribute", { characterid: character.id, name: "barrierPoints", current: 1 });
                    return [`<b>Improved Padding</b> (1 Barrier)`];
                }
                return [];
            }
            case "lightweight refit": {
                let speed = findObjs({ type: "attribute", characterid: character.id, name: "speed" })[0];
                let newValue;
                if (speed) {
                    let value = unpackNaN(speed.get("current"), 5);
                    newValue = value + 1;
                    speed.set("current", newValue);
                } else {
                    newValue = 6;
                    createObj("attribute", { characterid: character.id, name: "speed", current: newValue });
                }

                // Create effect to make the speed increase temporary
                let id = generateRowID();
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_icon`, current: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/augment.png" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_type`, current: "special" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_specialType`, current: "Lightweight Refit - Proc" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_expiry`, current: "turn" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_editable`, current: "off" });

                return [`<b>Lightweight Refit</b>, +1 to speed (${newValue}, valid until end of turn)`];
            }
            case "precision opener": {
                // Create advantage die effect until end of turn
                let id = generateRowID();
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_icon`, current: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/advantage.png" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_type`, current: "advantage" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_expiry`, current: "turn" });
                createObj("attribute", { characterid: character.id, name: `repeating_effects_${id}_editable`, current: "off" });

                return ["<b>Precision Opener</b>, +1 advantage die on one ability roll (valid until end of turn)"];
            }
            case "regen(x)": {
                var healing = unpackNaN(value);
                if (healing < 1) {
                    logger.i("Unable to perform regen(x); no value given");
                    return [];
                }
                let hitPoints = findObjs({ type: "attribute", characterid: character.id, name: "hitPoints" })[0];
                if (!hitPoints) {
                    logger.i("Unable to perform regen(x); no hitPoints");
                    return [];
                }

                let hitPointValue = unpackNaN(hitPoints.get("current"));
                let max = unpackNaN(hitPoints.get("max"));
                let newValue = Math.min(hitPointValue + healing, max);

                hitPoints.set("current", newValue);
                return [`<b>Regen (${value})</b> (${hitPointValue} to ${newValue}/${max} HP)`];
            }
            default:
                return [];
        }
    };

    const manageEffects = (character, expiries, updateNextTurnExpiries) => {
        logger.d(`Clearing effects for ${character.get("name")} matching ${expiries}`);
        let attributes = findObjs({ type: "attribute", characterid: character.id });
        let actionables = actionableEffects(character, attributes, expiries, updateNextTurnExpiries);
        logger.d(`Found ${actionables.ids.length} removable and ${actionables.toUpdate.length} updateable effects.`);

        // Update turn expiry
        for (let attribute of actionables.toUpdate) {
            logger.d(`Changing turn on attribute ${attribute.get("name")} for ${character.get("name")}.`);
            attribute.set("current", "turn");
        }

        var executionSummaries = [];
        // Execute effects
        for (let effect of Object.entries(actionables.toExecute)) {
            if (!effect[1].name) {
                continue;
            }
            logger.d(`Executing effect ${effect[1].name}`);
            executionSummaries = executionSummaries.concat(executeEffect(character, effect[1].name, effect[1].value));
        }

        var removalSummaries = {};
        // Remove effects
        for (let attribute of attributes) {
            let name = attribute.get("name");
            let match = name.match(/^repeating_effects_([-\w]+)_/);
            if (!match || match.length < 2) {
                // It's not a repeating effect attribute, skip
                continue;
            }
            let id = match[1];
            if (!actionables.ids.includes(id)) {
                // It's not one of the effects we need to clear, skip
                continue;
            }

            let nameMatch = name.match(/(special)?[tT]ype$/);
            if (nameMatch) {
                var summaryForId = removalSummaries[id];
                if (!summaryForId || nameMatch[0] === "specialType") {
                    let value = attribute.get("current");
                    if (value.trim().toLowerCase() !== "none") {
                        removalSummaries[id] = { attribute: nameMatch[0], summary: attribute.get("current") };
                        handleSpecialEffects(character, attribute.get("current"));
                    }
                }
            }

            // Remove all attributes for effects with the appropriate expiry
            logger.d(`Removing attribute ${attribute.get("name")} for ${character.get("name")}.`);
            attribute.remove();
        }

        var finalSummaries = [];
        let executionSummary = executionSummaries.join(", ");
        if (executionSummary) {
            finalSummaries.push(`Executed ${executionSummary}`);
        }
        let removalSummary = Object.entries(removalSummaries).map(entry => entry[1].summary).join(", ");
        if (removalSummary) {
            finalSummaries.push(`Removed ${removalSummary}`);
        }
        return finalSummaries.join(", ");
    };

    const manageEffectsOnTurnChange = (turn, expiries, turnChange, updateNextTurnExpiries) => {
        if (!config.manageEffects) {
            logger.d("Skipping effect changes; disabled in config.");
            return;
        }

        let tokenCharacter = tokenCharacterForTurn(turn);
        if (!tokenCharacter || !tokenCharacter.character) {
            logger.d("No token/character found");
            return;
        }
        logger.d(`Perform ${turnChange} for ${tokenCharacter.token.get("name")}`);
        let summary = manageEffects(tokenCharacter.character, expiries, updateNextTurnExpiries);
        if (!summary) {
            logger.d("No effects removed.");
            return;
        }

        let fullSummary = `<h4>${turnChange}:</h4> ${summary}.`;
        logger.d(`Notifying chat of effect update: ${fullSummary}`);
        try {
            sendChat(tokenCharacter.token.get("name"), fullSummary);
        } catch (e) {
            logger.i(`ERROR PARSING: ${fullSummary}`);
            logger.i(`ERROR: ${e}`);
        }
    };

    const recoverResource = (character, resource) => {
        if (!config.recover) {
            logger.d(`Skipping ${resource} recovery for ${character.get("name")}; disabled in config.`);
            return;
        }

        let sheetType = getAttrByName(character.id, "sheet_type");
        if (sheetType != "unique") {
            return;
        }

        let resourceName = getAttrByName(character.id, resource);
        if (!resourceName || resourceName.trim().toLowerCase() === "none") {
            return;
        }

        logger.d(`Recovering resource ${resourceName}`);
        var resourceObject = findObjs({ type: "attribute", characterid: character.id, name: `${resource}Value` })[0];
        if (!resourceObject) {
            logger.d("No resource");
            return;
        }
        let recovery = getAttrByName(character.id, `${resource}Recovery`) ?? 0;
        if (recovery <= 0) {
            logger.d("No recovery");
            return;
        }
        let currentValue = unpackNaN(resourceObject.get("current"));
        let max = unpackNaN(resourceObject.get("max"));
        if (max <= 0) {
            logger.d("Max is zero; cancelling recovery");
            return;
        }

        let updatedValue = Math.min(currentValue + unpackNaN(recovery), max);

        resourceObject.set("current", updatedValue);

        let summary = `Recovered ${recovery} ${resourceName} (${currentValue} -> ${updatedValue}/${max})`;
        logger.d(summary);
        return summary;
    };

    const recoverMp = (token, character) => {
        var mpObject = findObjs({ type: "attribute", characterid: character.id, name: "magicPoints" })[0];
        if (!mpObject) {
            logger.d("No MP");
            return;
        }
        let mpRecoveryBlock = getAttrByName(character.id, "mpRecoveryBlock") ?? "off";
        if (mpRecoveryBlock == "on") {
            logger.d("MP recovery is blocked");
            return;
        }
        let mpRecovery = getAttrByName(character.id, "mpRecovery") ?? "2";
        if (mpRecovery <= 0) {
            logger.d("No recovery");
            return;
        }
        let currentMp = unpackNaN(token.get("bar3_value"));
        let maxMp = unpackNaN(token.get("bar3_max"));
        if (maxMp <= 0) {
            logger.d("Max is zero; cancelling recovery");
            return;
        }

        if (currentMp >= maxMp) {
            logger.d("MP is maxed out; cancelling recovery");
            return;
        }

        let updatedMp = Math.min(currentMp + unpackNaN(mpRecovery), maxMp);

        token.set("bar3_value", updatedMp);

        let summary = `Recovered ${mpRecovery} MP (${currentMp} -> ${updatedMp}/${maxMp})`;
        logger.d(summary);
        return summary;
    };

    const performRecoveryForToken = (token, character) => {
        let summaries = [
            recoverMp(token, character),
            recoverResource(character, "resource"),
            recoverResource(character, "resource2")
        ].filter(element => element);

        return summaries.join("\n");
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
                    manageEffectsOnTurnChange(turn, ["encounterstart"], "Start of encounter", false);
                }
                continue;
            }
            var expiries = ["stepstart"];
            if (i == 0) {
                expiries.push("turn");
            }
            if (newEncounter) {
                expiries.push("encounterstart");
            }
            manageEffectsOnTurnChange(turn, expiries, "Start of step", false);
        }
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
                    manageEffectsOnTurnChange(turn, ["round"], "End of round", false);
                }
                continue;
            }
            let content = performRecoveryForToken(tokenCharacter.token, tokenCharacter.character);
            try {
                sendChat(tokenCharacter.token.get("name"), content);
            } catch (e) {
                logger.i(`ERROR PARSING: ${content}`);
                logger.i(`ERROR: ${e}`);
            }
            let expiries;
            if (team === "enemy") {
                expiries = ["step", "round"];
            } else {
                expiries = ["step"];
            }
            manageEffectsOnTurnChange(turn, expiries, "End of step", false);
        }
    };

    const performStartOfTurn = (turn) => {
        manageEffectsOnTurnChange(turn, ["start"], "Start of turn", false);
    };

    const performEndOfTurn = (turn) => {
        manageEffectsOnTurnChange(turn, ["turn"], "End of turn", true);
    };

    const teamForStep = (step, reverse) => {
        switch (step.custom) {
            case "End of Adventurer Step":
                return reverse ? "enemy" : "adventurer";
            case "End of Enemy Step":
                return reverse? "adventurer" : "enemy";
            default:
                return "";
        }
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
        } else {
            // Check prerequisites before proceeding
            if (config.block) {
                logger.d("Mod configured to block all activity; not performing any actions.");
                return;
            }
            if (config.blockUntilEmpty) {
                logger.d("Mod configured to block all activity until the turn order is emptied");
                if (turnOrder.length === 0) {
                    logger.d("Empty turn order; lifting block");
                    config.blockUntilEmpty = false;
                }
                return;
            }

            if (turnOrder.length > previousTurnOrder.length) {
                logger.d("Turn added; not performing any actions.");
                logger.d("----------");
                return;
            }

            if (
                turnOrder[0].id === previousTurnOrder[previousTurnOrder.length - 1].id &&
                turnOrder[0].custom === previousTurnOrder[previousTurnOrder.length - 1].custom
            ) {
                logger.d("Running turn backwards; not performing any actions.");
                logger.d("----------");
                return;
            }

            if (config.blockTurn > 0) {
                logger.d(`Blocking changes for ${config.blockTurn} turns; not performing any actions.`);
                logger.d("----------");
                config.blockTurn--;
                return;
            }

            if (firstInTurn.id === previousFirstInTurn.id && firstInTurn.id !== "-1") {
                logger.d("Same character; ignore");
                logger.d("----------");
                return;
            }
        }

        if (previousFirstInTurn.id != "-1") {
            performEndOfTurn(previousFirstInTurn);
        }

        if (firstInTurn.custom && firstInTurn.custom !== previousFirstInTurn.custom) {
            logger.d("Custom step discovered");
            let affectedTeam = teamForStep(firstInTurn);
            if (!affectedTeam) {
                logger.d("No team step; ignore");
                return;
            }
            logger.d(`Perform end of step for team ${affectedTeam}`);
            performEndOfStep(turnOrder, affectedTeam);
        } else if (previousFirstInTurn.custom && firstInTurn.custom !== previousFirstInTurn.custom) {
            let affectedTeam = teamForStep(previousFirstInTurn, true);
            if (affectedTeam) {
                logger.d(`Perform start of step for team ${affectedTeam}`);
                performStartOfStep(turnOrder, affectedTeam);
            } else {
                performStartOfTurn(firstInTurn);
            }
        } else if (firstInTurn.id != "-1") {
            if (previousTurnOrder.length === 0) {
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

        logger.d("==============================================");
        logger.d(`Parsing command ${msg.content}`);
        logger.d("==============================================");
        let args = msg.content.split(/\s+--/);

        args.forEach(a => {
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
                        `<li><code>--block X</code> - block any turn management until X turns have passed in the turn order.</li>` +
                        `<li><code>--config</code> - output the current configuration of ${scriptName} to chat.</li>` +
                        `<li><code>--end</code> - blocks any turn management until the Turn Order has been rendered empty.</li>` +
                        `<li><code>--force</code> - immediately carries out turn management on the current first in turn order.</li>` +
                        `<li><code>--fx X</code> - enables/disables the effect management part of turn management. 1 or on to enable, 0 or off to disable.</li>` +
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
        });
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
        registerEventHandlers();
    });
})();