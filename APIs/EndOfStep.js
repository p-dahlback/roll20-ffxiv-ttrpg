/*
    EndOfStep.js

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
*/
// eslint-disable-next-line no-unused-vars
const EndOfStep = (() => {
    const scriptName = "EndOfStep";
    const version = "0.1.0";

    const logger = new class {

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

    const unpackNaN = (value) => {
        let intValue = parseInt(value);
        if (isNaN(intValue)) {
            return 0;
        }
        return intValue;
    };

    const tokenCharacterForTurn = (turn) => {
        let token = getObj("graphic", turn.id);
        if (!token || !token.get("represents")) {
            logger.d("Token or character missing");
            return undefined;
        }
        let character = getObj("character", token.get("represents"));
        return { token: token, character: character };
    };

    const clearEffects = (character, expiries, updateNextTurnExpiries) => {
        logger.d(`Clearing effects for ${character.get("name")} matching ${expiries}`);
        let attributes = findObjs({ type: "attribute", characterid: character.id });
        let actionables = attributes.reduce(
            (accumulator, currentValue) => {
                let match = currentValue.get("name").match(/^repeating_effects_([-\w]+)_expiry$/);
                if (!match || match.length < 2) {
                    return accumulator;
                }
                let expiry = currentValue.get("current");
                if (expiries.includes(expiry)) {
                    accumulator.ids.push(match[1]);
                } else if (updateNextTurnExpiries && expiry === "turn2") {
                    accumulator.toUpdate.push(currentValue);
                }
                return accumulator;
            },
            { ids: [], toUpdate: [] }
        );
        logger.d(`Found ${actionables.ids.length} removable and ${actionables.toUpdate.length} updateable effects.`);

        // Update turn expiry
        for (let attribute of actionables.toUpdate) {
            logger.d(`Changing turn on attribute ${attribute.get("name")} for ${character.get("name")}.`);
            attribute.set("current", "turn");
        }

        var summaries = {};
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
                var summaryForId = summaries[id];
                if (!summaryForId || nameMatch[0] === "specialType") {
                    summaries[id] = { attribute: nameMatch[0], summary: attribute.get("current") };
                }
            }

            // Remove all attributes for effects with the appropriate expiry
            logger.d(`Removing attribute ${attribute.get("name")} for ${character.get("name")}.`);
            attribute.remove();
        }
        let summary = Object.entries(summaries).map(entry => entry[1].summary).join(", ");
        if (summary) {
            return `Removed ${summary}`;
        }
        return "";
    };

    const performEffectRemovalOnTurnChange = (turn, expiries, turnChange, updateNextTurnExpiries) => {
        let tokenCharacter = tokenCharacterForTurn(turn);
        if (!tokenCharacter || !tokenCharacter.character) {
            logger.d("No token/character found");
            return;
        }
        logger.d(`Perform ${turnChange} for ${tokenCharacter.token.get("name")}`);
        let summary = clearEffects(tokenCharacter.character, expiries, updateNextTurnExpiries);
        if (!summary) {
            logger.d("No effects removed.");
            return;
        }

        let fullSummary = `${summary} at ${turnChange}.`;
        logger.d(`Notifying chat of effect update: ${fullSummary}`);
        try {
            sendChat(tokenCharacter.token.get("name"), fullSummary);
        } catch (e) {
            log(`EndOfStep: ERROR PARSING: ${fullSummary}`);
            log(`EndOfStep: ERROR: ${e}`);
        }
    };

    const recoverResource = (character, resource) => {
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

        let updatedMp = Math.min(currentMp + unpackNaN(mpRecovery), maxMp);

        token.set("bar3_value", updatedMp);

        let summary = `Recovered ${mpRecovery} MP (${currentMp} -> ${updatedMp}/${maxMp})`;
        logger.d(summary);
        return summary;
    };

    const performEndOfStepForToken = (token, character) => {
        let summaries = [
            recoverMp(token, character),
            recoverResource(character, "resource"),
            recoverResource(character, "resource2")
        ].filter(element => element);

        return summaries.join("\n");
    };

    const performEndOfStep = (turnOrder, affectedTeam) => {
        for (let turn of turnOrder) {
            let tokenCharacter = tokenCharacterForTurn(turn);
            if (!tokenCharacter) {
                continue;
            }
            let token = tokenCharacter.token;
            let character = tokenCharacter.character;
            let team = getAttrByName(character.id, "team");
            if (team != affectedTeam) {
                if (affectedTeam === "enemy") {
                    // Enemies go last, so this ends the round for everyone
                    performEffectRemovalOnTurnChange(turn, ["round"], "end of round", false);
                }
                continue;
            }
            let content = performEndOfStepForToken(token, character);
            try {
                sendChat(token.get("name"), content);
            } catch (e) {
                log(`EndOfStep: ERROR PARSING: ${content}`);
                log(`EndOfStep: ERROR: ${e}`);
            }
            let expiries;
            if (team === "enemy") {
                expiries = ["step", "round"];
            } else {
                expiries = ["step"];
            }
            performEffectRemovalOnTurnChange(turn, expiries, "end of step", false);
        }
    };

    const performStartOfTurn = (turn) => {
        performEffectRemovalOnTurnChange(turn, ["start"], "start of turn", false);
    };

    const performEndOfTurn = (turn) => {
        performEffectRemovalOnTurnChange(turn, ["turn"], "end of turn", true);
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

    const checkTurnOrder = (obj, prev) => {
        logger.d("==============================================");
        logger.d("Checking turn order");
        logger.d("==============================================");
        let turnOrder = JSON.parse(obj.get("turnorder") ?? "[]");
        let previousTurnOrder = JSON.parse(prev.turnorder ?? "[]");
        let firstInTurn = turnOrder.length > 0 ? turnOrder[0] : { id: "-1" };
        let previousFirstInTurn = previousTurnOrder.length > 0 ? previousTurnOrder[0] : { id: "-1" };

        if (firstInTurn.id === previousFirstInTurn.id && firstInTurn.id !== "-1") {
            // No change in which character has a turn, ignore
            logger.d("Same character; ignore");
            return;
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
        } else if (firstInTurn.id != "-1") {
            performStartOfTurn(firstInTurn);
        }
        logger.d("----------")
    };

    const registerEventHandlers = () => {
        on(
            "change:campaign:turnorder",
            (obj, prev) => setTimeout(() => checkTurnOrder(Campaign(), prev), 1000)
        );
    };

    on("ready", () => {
        state[scriptName] = {
            version: version
        };
        registerEventHandlers();
    });
})();