/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported abilityRolls*/
const effectData = {}; const getEffects = {}; const addEffects = {}; const removeEffects = {};
const rollModifiers = {}; const rollTemplates = {}; const performAbility = {};
/*build:end*/

class AbilityRolls {

    // Roll ability
    roll(eventInfo) {
        log("Activate ability " + JSON.stringify(eventInfo));
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];

        getEffects.attrs([
            `repeating_${section}_${rowId}_icon`,
            `repeating_${section}_${rowId}_title`,
            `repeating_${section}_${rowId}_type`,
            `repeating_${section}_${rowId}_cost`,
            `repeating_${section}_${rowId}_resource`,
            `repeating_${section}_${rowId}_condition`,
            `repeating_${section}_${rowId}_trigger`,
            `repeating_${section}_${rowId}_uses`,
            `repeating_${section}_${rowId}_uses_max`,

            `repeating_${section}_${rowId}_target`,
            `repeating_${section}_${rowId}_range`,

            `repeating_${section}_${rowId}_baseEffect`,
            `repeating_${section}_${rowId}_directHit`,

            `repeating_${section}_${rowId}_effectName`,
            `repeating_${section}_${rowId}_effect`,
            `repeating_${section}_${rowId}_effectSelf`,
            `repeating_${section}_${rowId}_effectTarget`,

            `repeating_${section}_${rowId}_stat`,
            `repeating_${section}_${rowId}_damageType`,
            `repeating_${section}_${rowId}_hitType`,
            `repeating_${section}_${rowId}_hitDie`,
            `repeating_${section}_${rowId}_baseValue`,
            `repeating_${section}_${rowId}_cr`,
            `repeating_${section}_${rowId}_restore`,
            `repeating_${section}_${rowId}_combo`,

            "strEffective", "dexEffective", "vitEffective", "intEffective", "mndEffective",
            "magicPoints", "magicPoints_max", "resourceValue", "resourceValue_max",
            "advantage", "character_name"
        ], (values, effects) => {
            // Perform roll
            const title = values[`repeating_${section}_${rowId}_title`];
            const icon = values[`repeating_${section}_${rowId}_icon`];
            const usesMax = values[`repeating_${section}_${rowId}_uses_max`];

            const cost = values[`repeating_${section}_${rowId}_cost`];

            const statType = values[`repeating_${section}_${rowId}_stat`].toLowerCase();
            const damageType = values[`repeating_${section}_${rowId}_damageType`];
            const hitType = values[`repeating_${section}_${rowId}_hitType`];
            const restoration = values[`repeating_${section}_${rowId}_restore`];
            const statValue = values[`${statType}Effective`];
            const baseEffect = values[`repeating_${section}_${rowId}_baseEffect`];
            const baseValue = values[`repeating_${section}_${rowId}_baseValue`];
            const directHit = values[`repeating_${section}_${rowId}_directHit`];
            const effectName = values[`repeating_${section}_${rowId}_effectName`];
            const effect = values[`repeating_${section}_${rowId}_effect`];
            const effectSelf = values[`repeating_${section}_${rowId}_effectSelf`];
            const effectTarget = values[`repeating_${section}_${rowId}_effectTarget`];

            const combo = values[`repeating_${section}_${rowId}_combo`];

            setAttrs({
                currentCombo: "" // Reset combo indicators
            });
            const crString = this.stringWithTitle("CR:", values[`repeating_${section}_${rowId}_cr`]);
            const typeString = this.stringWithTitle("Type:", values[`repeating_${section}_${rowId}_type`]);
            const condition = rollTemplates.unpackValueWithTitle("Condition:", values[`repeating_${section}_${rowId}_condition`]);
            const triggerString = this.stringWithTitle("Trigger:", values[`repeating_${section}_${rowId}_trigger`]);

            var hitDie = values[`repeating_${section}_${rowId}_hitDie`];
            hitDie = rollModifiers.applyAdvantage(values.advantage, hitDie);

            var hitTitle = "";
            var hitDefinition = "";
            var button = "";

            if (effects.isStunned) {
                button = "Abilities cannot be used when stunned!";
            } else if (effects.isSilenced && typeString.toLowerCase().includes("invoked")) {
                button = "Invoked ability cannot be used when silenced!";
            } else if (hitDie || baseValue) {
                var bonusButton = "";
                if (hitType != "None" && hitDie) {
                    hitTitle = `${hitType}: `;
                    if (statValue > 0) {
                        hitDie = `${hitDie} + @{${statType}Effective}`;
                    }
                    hitDie = rollModifiers.addEffectsToHitRoll(effects, hitDie, section);
                    hitDefinition = `[[${hitDie}]]`;

                    // Option to improve the hit roll
                    if (effects.effects.some((effect) => effect.type == "roll(x)")) {
                        bonusButton = ` [${damageType} + Roll Up(X)](~${values.character_name}|repeating_${section}_${rowId}_rolldamagewithbonus)`;
                    }
                }
                button = `[${damageType}](~${values.character_name}|repeating_${section}_${rowId}_rolldamage)${bonusButton}`;
            } else if (cost > 0 || usesMax > 0 || restoration || combo || effectSelf || effectTarget) {
                button = `[Effect](~${values.character_name}|repeating_${section}_${rowId}_rolldamage)`;
            }

            var directHitTitle = "";
            if (directHit) {
                directHitTitle = "Direct Hit:";
            }

            var attributes = {};
            attributes[`repeating_${section}_${rowId}_currentRoll`] = "";
            setAttrs(attributes);

            let rollTemplate = `&{template:hit} {{icon=[icon](${icon})}} {{name=${title}}} ` +
                `{{type=${typeString}}} {{conditionTitle=${condition[0]}}} {{condition=${condition[1]}}} {{trigger=${triggerString}}} ` +
                `{{hitTitle=${hitTitle}}} {{hit=${hitDefinition}}} {{cr=${crString}}} {{baseEffect=${baseEffect}}} ` +
                `{{directHitTitle=${directHitTitle}}} {{directHit=${directHit}}} {{effectTitle=${effectName}}} {{effect=${effect}}}` +
                `{{button=${button}}}`;
            log(rollTemplate);
            startRoll(rollTemplate, results => {
                var hitRoll = results.results.hit;
                if (!hitRoll) {
                    hitRoll = {
                        result: undefined,
                        dice: undefined,
                        expression: undefined
                    };
                }
                const hitValue = hitRoll.result;
                var computedValue = hitValue;
                if (hitRoll.dice) {
                    var die;
                    if (hitRoll.expression.includes("kl")) {
                        die = Math.min(...hitRoll.dice);
                    }
                    else {
                        die = Math.max(...hitRoll.dice);
                    }
                    attributes[`repeating_${section}_${rowId}_currentRoll`] = die;
                }
                if (hitValue && parseInt(computedValue) < 0) {
                    computedValue = 0;
                }

                setAttrs(attributes);

                finishRoll(results.rollId, {
                    hit: computedValue
                });
            });
        });
    }

    rollDamage(useRollBonus, eventInfo) {
        log("Roll damage " + JSON.stringify(eventInfo));
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];
        getEffects.attrs([
            `repeating_${section}_${rowId}_title`,
            `repeating_${section}_${rowId}_type`,
            `repeating_${section}_${rowId}_damageType`,
            `repeating_${section}_${rowId}_baseValue`,
            `repeating_${section}_${rowId}_dhValue`,
            `repeating_${section}_${rowId}_combo`,
            `repeating_${section}_${rowId}_currentRoll`,

            `repeating_${section}_${rowId}_cost`,
            `repeating_${section}_${rowId}_uses`,
            `repeating_${section}_${rowId}_uses_max`,
            `repeating_${section}_${rowId}_restore`,
            `repeating_${section}_${rowId}_resource`,

            `repeating_${section}_${rowId}_effectSelf`,
            `repeating_${section}_${rowId}_effectTarget`,
            `repeating_${section}_${rowId}_condition`,

            "level", "barrierPoints",
            "hitPoints", "hitPoints_max",
            "magicPoints", "magicPoints_max",
            "resource", "resourceValue", "resourceValue_max",
            "resource2", "resource2Value", "resource2Value_max",

            "speedEffective", "speedBlock", "speedUnblocked", "speedOriginal",

            "character_name", "sheet_type"
        ], (values, effects) => {
            const name = values[`repeating_${section}_${rowId}_title`];
            const type = values[`repeating_${section}_${rowId}_type`];
            const baseValue = values[`repeating_${section}_${rowId}_baseValue`];
            const directHitValue = values[`repeating_${section}_${rowId}_dhValue`];
            const damageType = values[`repeating_${section}_${rowId}_damageType`];
            const combo = values[`repeating_${section}_${rowId}_combo`];
            const roll = parseInt(values[`repeating_${section}_${rowId}_currentRoll`]);

            const selfEffects = values[`repeating_${section}_${rowId}_effectSelf`].split(",");
            const targetEffects = values[`repeating_${section}_${rowId}_effectTarget`].split(",");
            const condition = values[`repeating_${section}_${rowId}_condition`];

            var bonusValue = 0;
            if (useRollBonus) {
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

            var criticalMultiplier = 1;
            if (roll) {
                criticalMultiplier = roll + bonusValue >= effects.criticalThreshold ? 2 : 1;
            }

            // Add crit multiplier to other dice rolls
            var baseValueWithMultipliers = baseValue;
            if (baseValue.includes("d")) {
                baseValueWithMultipliers = "[[" + criticalMultiplier + "[crit multiplier] * " + baseValue[0] + "]]" + baseValue.substring(1);
            }
            var directHitValueWithMultipliers = directHitValue;
            if (directHitValue.includes("d")) {
                directHitValueWithMultipliers = "[[" + criticalMultiplier + "[crit multiplier] * " + directHitValue[0] + "]]" + directHitValue.substring(1);
            }
            let rolls = rollModifiers.addEffectsToPreDamageRolls(effects, values.level, type, damageType, baseValueWithMultipliers, directHitValueWithMultipliers);

            var damageTitle = "";
            var damageDice = "";
            if (rolls.damage) {
                damageTitle = `${damageType}: `;
                damageDice = `[[${rolls.damage}]]`;
            }
            var directHitTitle = "";
            var directHitDice = "";
            if (rolls.directHit) {
                directHitTitle = "Direct Hit: ";
                directHitDice = `[[${rolls.directHit}]]`;
            }

            var totalTitle = "";
            if (rolls.damage && rolls.directHit) {
                totalTitle = `Full ${damageTitle}`;
            }

            var button = "";
            var comboTitle = "";
            if (combo) {
                setAttrs({
                    currentCombo: combo
                });
                var choices = [combo];
                comboTitle = "Combo";
                if (combo.includes(",")) {
                    choices = combo.split(",");
                }
                for (let i = 0; i < choices.length; i++) {
                    button += `[${choices[i].trim()}](~${values.character_name}|repeating_${section}_${rowId}_runcombo${i + 1})`;
                }
            }

            const resourceCost = performAbility.resolveResources(section, rowId, values, effects);

            if (!damageDice && !directHitDice && !combo && !resourceCost && !selfEffects && !targetEffects) {
                log("No reason to roll damage");
                return;
            }

            var targetEffectTitle = "";
            let targetEffectButtons = this.buttonsForTargetEffects(targetEffects, values.level);
            if (targetEffectButtons) {
                targetEffectTitle = "Effects";
            }

            // Roll damage
            let rollTemplate = `&{template:damage} {{title=${name}}} {{damageTitle=${damageTitle}}} {{damage=${damageDice}}} ` +
                `{{directHitTitle=${directHitTitle}}} {{directHit=${directHitDice}}} {{totalTitle=${totalTitle}}} {{total=[[0]]}}` +
                `{{comboTitle=${comboTitle}}} {{button=${button}}} {{cost=${resourceCost}}} {{proc=[[0]]}} ` +
                `{{targetEffectTitle=${targetEffectTitle}}} {{targetEffects=${targetEffectButtons}}}`;
            log(rollTemplate);
            startRoll(rollTemplate, results => {
                const damageRoll = results.results.damage ?? { result: 0, dice: [], expression: "" };
                const directHitRoll = results.results.directHit ?? { result: 0, dice: [], expression: "" };

                let computedResults = rollModifiers.addEffectsToPostDamageRolls(effects, damageType, [damageRoll, directHitRoll]);
                let consumedEffectSummary = removeEffects.consumeOnAbility(name, condition, effects);

                let dice = {
                    hit: roll,
                    damage: damageRoll,
                    directHit: directHitRoll
                };
                let effectSummary = addEffects.addToSelf(values, dice, selfEffects, effects);
                let procSummary = rolls.summaries.concat([computedResults.summary, consumedEffectSummary, effectSummary]).filter(element => element).join(", ");

                var attributes = {};
                attributes[`repeating_${section}_${rowId}_currentCriticalMultiplier`] = 1;
                setAttrs(attributes);

                finishRoll(
                    results.rollId,
                    {
                        proc: procSummary,
                        damage: computedResults.rolls[0],
                        directHit: computedResults.rolls[1],
                        total: totalTitle ? computedResults.total : ""
                    }
                );
            });
        });
    }

    activateCombo(eventInfo, index) {
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];
        log("Combo activated " + JSON.stringify(eventInfo));
        getAttrs([
            `repeating_${section}_${rowId}_combo`
        ], values => {
            const combo = values[`repeating_${section}_${rowId}_combo`];
            var abilityName = combo.trim().toLowerCase();
            if (combo.includes(",")) {
                const choices = combo.split(",");
                if (index < choices.length) {
                    abilityName = choices[index].trim().toLowerCase();
                } else {
                    log(`Combo index out of bonds: selected ${index}, not in ${combo}`);
                    return;
                }
            }
            getSectionIDs(`repeating_${section}`, ids => {
                const attributes = ids.map((element) => `repeating_${section}_${element}_title`);
                getAttrs(attributes, values => {
                    for (let i = 0; i < ids.length; i++) {
                        const id = ids[i];
                        const attribute = attributes[i];
                        if (values[attribute].trim().toLowerCase() == abilityName) {
                            const triggerEvent = {
                                sourceAttribute: `repeating_${section}_${id}_runcomboFrom_${rowId}`
                            };
                            log("Activating " + abilityName);
                            this.roll(triggerEvent);
                            return;
                        }
                    }
                    log("Couldn't find ability with name " + abilityName);
                });
            });
        });
    }

    buttonsForTargetEffects(effects, level) {
        var buttons = [];

        log("Preparing target effects: " + JSON.stringify(effects));
        for (let effect of effects) {
            let adjustedEffect = getEffects.searchableName(effect.trim());
            let data = effectData.effects[adjustedEffect];
            if (!data) {
                log("Unhandled effect " + adjustedEffect);
                continue;
            }

            var value = "";
            let match = effect.match(/\(([-|\s\w]+)\)/);
            if (match && match.length >= 2) {
                value = match[1];
            }

            let valueDefinition = value ? `--v ${value}` : "";
            let duplicateDefinition = data.duplicate ? ` --dupe ${data.duplicate}` : "";
            let effectName = (data.specialType || data.type).replace(/\([Xx]{1}\)/, "");
            let button = `[${data.name.replace("(X)", `(${value})`)}](!ffe --${effectName} ${valueDefinition} --expire ${data.expiry} ` +
                `--edit ${0} --curable ${data.curable ? 1 : 0}${duplicateDefinition} --l ${level})`;
            buttons.push(button);
        }
        return buttons.join("\n");
    }

    stringWithTitle(title, value) {
        if (value) {
            return `${title} ${value}`;
        }
        return "";
    }
};

const abilityRolls = new AbilityRolls();