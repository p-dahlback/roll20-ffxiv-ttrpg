/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported rollModifiers*/
const engine = {};
/*build:end*/

const DamageModifiers = function() {

    this.applyEffectModifiersToRolls = function(damageRoll, characterLevel, effects) {
        var modifiedRoll = this.applyCriticalMultiplierIfNeeded(damageRoll, effects);
        var adds = [];
        var negatives = [];
        var summaries = effects.notifyProcs;
        summaries.push(...this.getHitModifierSummaries(damageRoll, effects));

        if (effects.astralFire && damageRoll.type.includes("Fire-aspect")) {
            let addedDamage = characterLevel >= 50 ? "2d6" : "1d6";
            adds.push(`${addedDamage}[Astral Fire]`);
            summaries.push("Astral Fire proc");
        } else if (effects.gemEffect && damageRoll.type.includes("Gem")) {
            let result = this.applyGemEffect(damageRoll, effects.gemEffect);
            modifiedRoll = result.roll;
            adds.push(...result.adds);
            summaries.push(result.summary);
        }

        if (damageRoll.conditionalValue) {
            let conditionalResult = this.applyConditionalEffects(modifiedRoll, effects);
            modifiedRoll = conditionalResult.roll;
            summaries.push(conditionalResult.summary);
            adds.push(...conditionalResult.adds);
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
                damageRoll: modifiedRoll,
                summaries: summaries
            };
        }
    };

    this.applyEffectModifiersAfterRolls = function(effects, damageType, damageRolls) {
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

    //#region Helpers
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

    this.applyConditionalEffects = function(damageRoll, effects) {
        let conditions = damageRoll.conditionalValue.split(",");
        for (let condition of conditions) {
            let match = condition.match(/^([\w' -]+)\(([\w: '-|]+)\)$/);
            if (match.length < 3 || !match[1] || !match[2]) {
                engine.logd("Malformed condition " +  condition);
                continue;
            }
            let effectName = match[1];
            if (effectName !== "Default" && !effects.effects.find(effect => effect.data.name === effectName)) {
                engine.logd("Skipping conditional, the prerequisite effect is not in play");
                continue;
            }

            // Condition matches; return value
            return this.parseConditional(damageRoll, effectName, match[2]);
        }
        return {
            roll: damageRoll,
            summary: "",
            adds: []
        };
    };

    this.parseConditional = function(damageRoll, effectName, attributeSpecification) {
        let attributes = attributeSpecification.split("|");
        let summary = "";
        var adds = [];
        for (let attribute of attributes) {
            let attributeParts = attribute.split(":");
            let key = attributeParts[0];
            let value = attributeParts[1];
            switch (key) {
                case "description":
                    summary = value;
                    break;
                case "roll":
                    if (effectName !== "Default") {
                        adds.push(`${value}[${effectName}]`);
                        summary = `${effectName} proc`;
                    } else {
                        adds.push(`${value}`);
                    }
                    break;
            }
        }

        return {
            roll: damageRoll,
            summary: summary,
            adds: adds
        };
    };

    this.applyGemEffect = function(damageRoll, gemEffect) {
        var modifiedRoll = damageRoll;
        var adds = [];
        let summary;

        modifiedRoll.type = this.typeAdjustedForGemEffect(damageRoll.type, gemEffect);
        switch (gemEffect.specialType) {
            case "Emerald":
                summary = "Emerald proc; target two additional characters within 10 squares of you";
                break;
            case "Ruby":
                adds.push("1d6[Ruby]");
                summary = "Ruby proc";
                break;
            case "Topaz":
                adds.push("2[Topaz]");
                summary = "Topaz proc";
                break;
            default:
                break;
        }
        return {
            roll: modifiedRoll,
            adds: adds,
            summary: summary
        };
    };

    this.typeAdjustedForGemEffect = function(type, gemEffect) {
        if (!gemEffect) {
            return type;
        }
        switch (gemEffect.specialType) {
            case "Emerald":
                return type.replace("Gem", "Wind-Aspected");
            case "Ruby":
                return type.replace("Gem", "Fire-Aspected");
            case "Topaz":
                return type.replace("Gem", "Earth-Aspected");
            default:
                return type;
        }
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
};

const damageModifiers = new DamageModifiers();
this.export.DamageModifiers = DamageModifiers;
this.export.damageModifiers = damageModifiers;