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
                case "reassemble":
                    criticalUp += 99;
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
            updatedMacro = updatedMacro.replace(/cs>?20/, `cs>${20 - Math.min(criticalUp, 19)}`);
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

    this.applyCriticalMultiplierIfNeeded = function(damageRoll, effects) {
        // Calculate hit roll with added bonuses
        var bonusValue = 0;
        if (damageRoll.useRollBonus) {
            bonusValue = effects.reduce(
                (accumulator, currentValue) => {
                    if (currentValue.data.maskedType != "roll(x)") {
                        return accumulator;
                    }
                    if (currentValue.value) {
                        return accumulator + parseInt(currentValue.value);
                    }
                    return accumulator;
                }, 0
            );
        }

        // Determine critical multiplier
        var criticalMultiplier = 1;
        if (damageRoll.hitRoll) {
            criticalMultiplier = damageRoll.hitRoll + bonusValue >= effects.criticalThreshold ? 2 : 1;
        }
        let baseRoll = damageRoll.baseRoll;
        var modifiedRoll = damageRoll;
        if (criticalMultiplier > 1) {
            if (baseRoll && baseRoll.includes("d")) {
                modifiedRoll.baseRoll = "[[" + criticalMultiplier + "[crit multiplier] * " + baseRoll[0] + "]]" + baseRoll.substring(1);;
            }
        }

        // Monk's Opo-Opo Form forces crits in two particular circumstances:
        // - 1. 'Bootshine' Direct Hits
        // - 2. 'Bestial Fury: Opo-Opo' when comboed from a Direct Hitting Bootshine
        if (damageRoll.monkForm === "Opo-Opo Form") {
            if (damageRoll.title === "Bootshine") {
                // Force crit on 'Bootshine' Direct Hit
                criticalMultiplier = 2;
            } else if (damageRoll.title === "Bestial Fury: Opo-Opo" && criticalMultiplier < 2) {
                // If the initial hit roll was an outright crit, it's already been applied as a modifier to the base roll and we don't need to do anything here.
                // Otherwise, we handle the forced crit scenario by adding a duplicate roll to Direct Hit to simulate the forced crit.
                // I.e.: Base Roll + Direct Hit Roll = 2 x Base Roll, which is the same as a crit.
                // This way players can choose the base value or the full damage total depending on if the ability Direct Hits (crits) their chosen target.
                modifiedRoll.directHitRoll = baseRoll;
                return modifiedRoll;
            }
        }

        if (criticalMultiplier > 1) {
            let directHitRoll = modifiedRoll.directHitRoll;
            if (directHitRoll && directHitRoll.includes("d")) {
                modifiedRoll.directHitRoll = "[[" + criticalMultiplier + "[crit multiplier] * " + directHitRoll[0] + "]]" + directHitRoll.substring(1);
            }
            return modifiedRoll;
        } else {
            return damageRoll;
        }
    };

    this.applyEffectModifiersToDamageRolls = function(damageRoll, characterLevel, effects) {
        var adds = [];
        var negatives = [];
        var summaries = effects.notifyProcs;
        summaries.push(...this.getHitModifierSummaries(damageRoll, effects));

        let isFireType = damageRoll.type.toLowerCase().includes("fire-aspect");
        if (isFireType && effects.astralFire) {
            let addedDamage = characterLevel >= 50 ? "2d6" : "1d6";
            adds.push(`${addedDamage}[Astral Fire]`);
            summaries.push("Astral Fire proc");
        }

        if (effects.dpsChanges && damageRoll.damageType === "Damage") {
            for (let effect of effects.dpsChanges) {
                if (effect.data.name == "Raging Strikes" && !damageRoll.type.includes("Primary")) {
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
            var modifiedRoll = damageRoll;
            let baseRoll = modifiedRoll.baseRoll;
            let directHitRoll = modifiedRoll.directHitRoll;
            if (baseRoll) {
                baseRoll = `${baseRoll}${adds.join(" + ")}${negatives.join(" - ")}`;
                modifiedRoll.baseRoll = baseRoll;
            } else if(directHitRoll) {
                directHitRoll = `${directHitRoll}${adds.join(" + ")}${negatives.join(" - ")}`;
                modifiedRoll.directHitRoll = directHitRoll;
            }
            return {
                damageRoll: modifiedRoll,
                summaries: summaries
            };
        } else {
            return {
                damageRoll: damageRoll,
                summaries: summaries
            };
        }
    };

    this.applyEffectModifiersAfterDamageRolls = function(effects, damageType, damageRolls) {
        var result = {};
        var summaries = [];

        if (damageType == "Damage" && effects.damageRerolls.length > 0 && damageRolls.some(roll => roll.dice && roll.dice.length > 0)) {
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

    this.getHitModifierSummaries = function(damageRoll, effects) {
        if (!damageRoll.hitRoll) {
            return [];
        }

        var summaries = [];
        if (effects.expireOnHitRoll.find(effect => effect.specialType === "Reassemble")) {
            summaries.push("Reassemble proc");
        }
        summaries.push(...effects.abilityAdvantages.map(advantageEffect => `${advantageEffect.data.name} proc`));
        if (effects.monkForm && damageRoll.type.includes("Physical")) {
            summaries.push(`${effects.monkForm.data.name} advantage`);
        }
        return summaries;
    };

    this.applyAdvantage = function(advantage, abilityType, dice, effects) {
        if (effects.abilityAdvantages) {
            advantage += effects.abilityAdvantages.length;
        }
        if (effects.monkForm && abilityType.includes("Physical")) {
            advantage += 1;
        }
        if (advantage === 0) {
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