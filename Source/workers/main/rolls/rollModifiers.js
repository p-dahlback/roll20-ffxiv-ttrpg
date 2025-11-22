/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported rollModifiers*/
const engine = {};
/*build:end*/

const RollModifiers = function() {
    
    this.addEffectsToHitRoll = function(effects, rollMacro, rollType) {
        var penalty = 0;
        var hasParalysis = false;
        var criticalUp = 0;
        var attributeUp = {};
        var blindPenalty = 0;
        var hasHawksEye = false;
        for (let effect of effects.effects) {
            var effectName = effect.type;
            if (effect.type == "special") {
                effectName = effect.specialType.trim().toLowerCase();
            }
            switch (effectName) {
                case "blind":
                    blindPenalty = 2;
                    break;
                case "brink":
                    penalty += 5;
                    break;
                case "critical(x)":
                    if (effect.value) {
                        criticalUp += parseInt(effect.value);
                    }
                    break;
                case "hawk's eye":
                    hasHawksEye = true;
                    break;
                case "paralyzed":
                    if (rollType == "primary") {
                        hasParalysis = true;
                    }
                    break;
                case "petrified":
                    penalty += 5;
                    break;
                case "prone":
                    penalty += 2;
                    break;
                case "sleep":
                    penalty += 3;
                    break;
                case "slow":
                    penalty += 2;
                    break;
                case "stun":
                    penalty += 5;
                    break;
                case "weak":
                    penalty += 2;
                    break;
            }
        }
        var updatedMacro = rollMacro;
        if (hasParalysis) {
            updatedMacro = updatedMacro.replace(/cs>?20/, "cs>20cf<5[chance of paralysis]");
        }
        if (criticalUp > 0) {
            updatedMacro = updatedMacro.replace(/cs>?20/, `cs>${20 - criticalUp}`);
        }
        if (!hasHawksEye) {
            // Hawk's Eye nullifies penalty from Blind
            penalty += blindPenalty;
        }
        if (penalty > 0) {
            updatedMacro = `${updatedMacro} - ${penalty}[penalty]`;
        }
        const matches = [...updatedMacro.matchAll(/@\{([a-z]{3})\}/g)];
        for (let match of matches) {
            const attributeName = match[1];
            const attributeValue = attributeUp[attributeName];
            if (!attributeValue) {
                continue;
            }
            updatedMacro = updatedMacro.replace(
                match[0],
                `${match[0]}[${attributeName.toUpperCase()}] + ${attributeUp[attributeName]}[${attributeName.toUpperCase()} bonus]`
            );
        }
        return updatedMacro;
    };

    this.addEffectsToPreDamageRolls = function(effects, level, type, damageType, damageRoll, directHitRoll) {
        var adds = [];
        var negatives = [];
        var summaries = [];

        let isFireType = type.toLowerCase().includes("fire-aspect");
        if (isFireType && effects.astralFire) {
            let addedDamage = level >= 50 ? "2d6" : "1d6";
            adds.push(`${addedDamage}[Astral Fire]`);
            summaries.push("Astral Fire proc");
        }

        if (effects.dpsChanges && damageType === "Damage") {
            for (let effect of effects.dpsChanges) {
                if (effect.data.name == "Raging Strikes" && !type.includes("Primary")) {
                    // This effect only applies to primary abilities
                    continue;
                }
                if (effect.data.maskedType === "ddown(x)" || parseInt(effect.value) < 0) {
                    negatives.push(`${effect.value}[${effect.data.name}]`);
                } else {
                    adds.push(`${effect.value}[${effect.data.name}]`);
                }
                summaries.push(`${effect.data.name} proc`);
            }
        }

        // Insert empty elements so the joined string starts with an operator +/-
        if (adds.length > 0) {
            adds.splice(0, 0, "");
        }
        if (negatives.length > 0) {
            negatives.splice(0, 0, "");
        }

        if (adds.length > 0 || negatives.length > 0) {
            engine.logd("Adding damage to roll");
            if (damageRoll) {
                damageRoll = `${damageRoll}${adds.join(" + ")}${negatives.join(" - ")}`;
            } else {
                directHitRoll = `${directHitRoll}${adds.join(" + ")}${negatives.join(" - ")}`;
            }
            return {
                damage: damageRoll,
                directHit: directHitRoll,
                summaries: summaries
            };
        } else {
            return {
                damage: damageRoll,
                directHit: directHitRoll,
                summaries: []
            };
        }
    };

    this.addEffectsToPostDamageRolls = function(effects, damageType, damageRolls) {
        var result = {};
        var summaries = [];
        if (damageType == "Damage" && effects.damageRerolls && damageRolls.some(roll => roll.dice && roll.dice.length > 0)) {
            summaries.push(`Damage reroll available (${effects.damageRerolls.join(", ")})`);
        }

        if (effects.surgingTempest) {
            var rolls = [];
            var total = 0;
            var appliedSurgingTempest = false;
            for (let roll of damageRolls) {
                if (!roll || !roll.result) {
                    rolls.push("");
                    continue;
                }

                let dice = roll.dice;
                if (!dice || dice.length == 0) {
                    total += roll.result;
                    rolls.push(roll.result);
                    continue;
                }
                let diceResult = dice.reduce(
                    (accumulator, currentValue) => {
                        if (currentValue == 1) {
                            appliedSurgingTempest = true;
                            return 2 + accumulator;
                        }
                        return currentValue + accumulator;
                    },
                    0
                );
                let rawAdditions = roll.expression.split("+").reduce(
                    (accumulator, currentValue) => {
                        let trimmed = currentValue.trim();
                        if (trimmed.includes("d")) {
                            return accumulator;
                        }
                        let value = parseInt(trimmed);
                        if (isNaN(value)) {
                            log(`Unexpected NaN ${trimmed} from expression ${roll.expression}`);
                            return accumulator;
                        }
                        return accumulator + parseInt(trimmed);
                    },
                    0
                );

                let newResult = diceResult + rawAdditions;
                total += newResult;
                rolls.push(newResult);
            }
            result.rolls = rolls;
            result.total = total;
            if (appliedSurgingTempest) {
                summaries.push("Surging Tempest proc");
            }
        } else {
            let rolls = damageRolls.map(roll => roll.result);
            let total = rolls.reduce(
                (accumulator, currentValue) => (currentValue ?? 0) + accumulator,
                0
            );
            result.rolls = rolls;
            result.total = total;
        }
        result.summary = summaries.join(", ");

        return result;
    };

    this.applyAdvantage = function(advantage, dice) {
        if (advantage == 0) {
            return dice;
        }
        if (!dice.includes("d")) {
            return dice;
        }
        const highOrLow = advantage > 0 ? "kh" : "kl";
        const multiplier = Math.abs(advantage) + 1;

        var searchString = dice;
        var newDice = "";
        var index;
        while ((index = searchString.indexOf("d")) >= 0) {
            let numberOfDice;
            if (index == 0) {
                numberOfDice = 1;
                searchString = `1${searchString}`;
                index = 1;
            } else {
                newDice += searchString.substring(0, index - 1);
                numberOfDice = searchString.substring(index - 1, index);
            }
            const numberOfDiceWithMultiplier = numberOfDice * multiplier;

            // Find end of roll
            let match = /[-+* /)]/.exec(searchString.substring(index));
            if (match) {
                const matchIndex = match.index + index;
                newDice += `${numberOfDiceWithMultiplier}${searchString.substring(index, matchIndex)}${highOrLow}${numberOfDice}`;
                searchString = searchString.substring(matchIndex);
            } else {
                newDice += `${numberOfDiceWithMultiplier}${searchString.substring(index).trim()}${highOrLow}${numberOfDice}`;
                searchString = "";
                break;
            }
        }
        newDice += searchString;
        return newDice;
    };
};

const rollModifiers = new RollModifiers();
this.export.RollModifiers = RollModifiers;
this.export.rollModifiers = rollModifiers;