/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported addEffects*/
const effectData = {}; const getEffects = {}; const removeEffects = {};
/*build:end*/

class AddEffects {
    // Adds the given effects. Values should contain level, barrierPoints.
    addToSelf(values, dice, effects, existingEffects) {
        var attributes = {};
        var summaries = [];

        let existingEffectTypes = existingEffects.effects.map(effect => {
            if (effect.type == "special") {
                return effect.specialType
                    .replaceAll("'", "")
                    .replaceAll(" ", "_")
                    .toLowerCase();
            }
            return effect.type;
        });

        log("Adding effects to self: " + JSON.stringify(effects));
        for (let effect of effects) {
            if (!effect) {
                continue;
            }
            effect = effect.trim();

            if (!this.matchesCondition(effect, dice)) {
                log("Condition not fulfilled; skipping effect " + effect);
                continue;
            }

            let searchableName = getEffects.searchableName(effect);
            let replacement = this.replacementEffect(searchableName, existingEffects);
            if (!replacement.valid) {
                continue;
            }
            let adjustedEffect = replacement.name;
            let data = effectData.effects[adjustedEffect];
            if (!data) {
                log("Unhandled effect " + adjustedEffect);
                continue;
            }
            let duplicatesResult = this.resolveDuplicates(adjustedEffect, data, existingEffectTypes, existingEffects);
            if (!duplicatesResult.result) {
                continue;
            }
            summaries = summaries.concat(duplicatesResult.summaries);

            var value = null;
            let match = effect.match(/\(([-|\s\w]+)\)/);
            if (match && match.length >= 2) {
                value = match[1];
            }

            let initValues = {
                id: generateRowID(),
                type: data.type,
                specialType: data.specialType,
                statusType: data.statusType,
                value: value,
                description: data.description,
                expiry: data.expiry,
                curable: data.curable
            };

            let specialEffectResult = this.resolveSpecialEffects(initValues.id, adjustedEffect, value, dice, values, existingEffects);
            summaries = summaries.concat(specialEffectResult.summaries.filter(element => element));
            if (specialEffectResult.skip) {
                continue;
            }

            attributes = specialEffectResult.attributes;
            attributes[`repeating_effects_${initValues.id}_type`] = initValues.type;
            if (initValues.specialType) {
                attributes[`repeating_effects_${initValues.id}_specialType`] = initValues.specialType;
            }
            if (initValues.value) {
                attributes[`repeating_effects_${initValues.id}_value`] = initValues.value;
            }
            attributes[`repeating_effects_${initValues.id}_statusType`] = initValues.statusType;
            attributes[`repeating_effects_${initValues.id}_expiry`] = initValues.expiry;
            attributes[`repeating_effects_${initValues.id}_source`] = "Self";
            attributes[`repeating_effects_${initValues.id}_description`] = initValues.description;
            attributes[`repeating_effects_${initValues.id}_curable`] = initValues.curable ? "on" : "off";
            attributes[`repeating_effects_${initValues.id}_editable`] = "off";
            attributes[`repeating_effects_${initValues.id}_origin`] = "automatic";
            attributes[`repeating_effects_${initValues.id}_effectsExpandItem`] = "on";

            if (duplicatesResult.summaries.length === 0) {
                summaries.push(`Activated ${data.name.replace("(X)", initValues.value)}`);
            }
        }
        if (Object.keys(attributes).length > 0) {
            setAttrs(attributes);
        }
        return summaries.join(", ");
    }

    resolveDuplicates(name, effect, existingEffectTypes, existingEffects) {
        if (effect.duplicate == "block" && existingEffectTypes.includes(name)) {
            log("Effect " + effect.name + " already exists, skipping");
            return { result: false, summaries: [] };
        }

        var summaries = [];
        if (effect.duplicate == "replace") {
            for (let replacable of existingEffects.effects) {
                if (replacable.type == effect.type && replacable.specialType == effect.specialType) {
                    summaries.push(`Reactivated ${effect.name}`);
                    removeRepeatingRow(replacable.fullId);
                }
            }
        }
        return { result: true, summaries: summaries };
    }

    resolveAttributes(id, effectName, value) {
        switch (effectName) {
            case "attribute": {
                log("Resolving attributes for attribute(x)");
                if (!value) {
                    // Unable to deal with this until value has been set
                    return;
                }
                let definition = value.split(",");
                if (!definition) {
                    log("Invalid value " + value);
                    return;
                }
                let attributeName = definition[0];
                let attributeValue;
                if (definition[1]) {
                    attributeValue = unpackNaN(definition[1].trim(), 1);
                } else {
                    attributeValue = 1;
                }
                getAttrs([`${attributeName}Effective`, `${attributeName}Override`, `${attributeName}Unblocked`], values => {
                    var attributes = {};
                    let baseAttributeName;
                    let isBlocked = unpackNaN(values[`${attributeName}Block`], 0) > 0;
                    if (isBlocked) {
                        baseAttributeName = `${attributeName}Unblocked`;
                    } else {
                        baseAttributeName = `${attributeName}Effective`;
                    }

                    let currentValue = unpackNaN(values[`${baseAttributeName}`], 0);
                    let newValue = currentValue + attributeValue;
                    log(`${attributeName}: ${newValue}, unblocked: ${values[`${attributeName}Unblocked`]}`);
                    attributes[`repeating_effects_${id}_attribute`] = attributeName;
                    attributes[`repeating_effects_${id}_attributeValue`] = attributeValue;
                    
                    attributes[baseAttributeName] = newValue;
                    if (!isBlocked) {
                        attributes[`${attributeName}Display`] = Math.max(newValue, 0);
                    }
                    log(`Setting ${baseAttributeName} to ${newValue}`);
                    setAttrs(attributes);
                });
                break;
            }
            case "bound": {
                log("Resolving attributes for bound");
                getAttrs(["size", "speedEffective", "speedOverride", "speedUnblocked"], values => {
                    let speed = unpackNaN(values.speedEffective, 0);
                    let unblocked = unpackNaN(values.speedUnblocked ?? values.speed, 0);
                    let newValue;
                    let diff;
                    if (values.size === "large") {
                        newValue = Math.max(speed - 2, 0);
                        unblocked = Math.max(unblocked - 2, 0);
                        diff = 2;
                    } else {
                        newValue = -99;
                        diff = speed - newValue;
                        unblocked -= diff;
                    }

                    var attributes = {};
                    if (unpackNaN(values.speedOverride, 0) > 0) {
                        attributes.speedUnblocked = unblocked;
                    }
                    log(`speed: ${newValue}, unblocked: ${attributes.speedUnblocked}`);
                    attributes.speedEffective = newValue;
                    attributes.speedDisplay = Math.max(newValue, 0);
                    attributes[`repeating_effects_${id}_attribute`] = "speed";
                    attributes[`repeating_effects_${id}_attributeValue`] = -diff;
                    setAttrs(attributes);
                });
                break;
            }
            case "defenders_boon": {
                log("Resolving attributes for Defender's Boon");
                let attributeValue;
                if (value) {
                    attributeValue = unpackNaN(value.trim(), 1);
                } else {
                    attributeValue = 1;
                }
                getAttrs(["defense", "magicDefense"], values => {
                    let defense = unpackNaN(values.defense, 0);
                    let magicDefense = unpackNaN(values.magicDefense, 0);
                    let attributeName;
                    let newValue;
                    if (defense === magicDefense) {
                        // Do nothing
                        return;
                    } else if (defense < magicDefense) {
                        attributeName = "defense";
                        newValue = defense + attributeValue;
                    } else if (magicDefense < defense) {
                        attributeName = "magicDefense";
                        newValue = magicDefense + attributeValue;
                    }

                    var attributes = {};
                    attributes[`${attributeName}Effective`] = newValue;
                    attributes[`${attributeName}Display`] = Math.max(newValue, 0);
                    attributes[`repeating_effects_${id}_attribute`] = attributeName;
                    attributes[`repeating_effects_${id}_attributeValue`] = attributeValue;
                    log(`Setting ${attributeName} to ${newValue}`);
                    setAttrs(attributes);
                });
                break;
            }
            case "slow":
            case "heavy": {
                log(`Resolving attributes for ${effectName}`);
                getAttrs(["speed", "speedEffective", "speedOverride", "speedOverrideSources", "speedUnblocked"], values => {
                    let speed = unpackNaN(values.speed, 0);
                    let newValue = Math.floor(speed / 2) + speed % 2;
                    let diff = speed - newValue;
                    var attributes = {};
                    if (unpackNaN(values.speedOverride, 0) > 0) {
                        log(`Speed was already blocked when activating ${effectName}`);
                        attributes.speedOverrideSources = unpackNaN(values.speedOverrideSources, 1) + 1;
                    } else {
                        attributes.speedOverride = newValue;
                        attributes.speedOverrideSources = 1;
                        attributes.speedUnblocked = values.speedEffective;

                        log(`speed: ${newValue}, unblocked: ${attributes.speedUnblocked}`);
                        let effectiveValue = Math.min(newValue, values.speedEffective - diff);
                        attributes.speedEffective = effectiveValue;
                        attributes.speedDisplay = Math.max(effectiveValue, 0);
                    }
                    attributes[`repeating_effects_${id}_attribute`] = "speed";
                    attributes[`repeating_effects_${id}_attributeValue`] = -diff;
                    setAttrs(attributes);
                });
                break;
            }
        }
    }

    resolveAbilities(effect, value = "") {
        let data = effectData.effects[effect];
        if (!data || !data.ability) {
            return;
        }

        let abilityDefinition = effectData.abilities[data.ability];
        if (!abilityDefinition) {
            return;
        }
        var attributes = {};
        for (let section of Object.entries(abilityDefinition)) {
            for (let ability of section[1]) {
                log("Generating effect ability " + ability.title);
                let id = generateRowID();
                for (let entry of Object.entries(ability)) {
                    var attributeValue = entry[1];
                    if (value && attributeValue && isNaN(attributeValue)) {
                        attributeValue = attributeValue.replace("{value}", value);
                    }
                    attributes[`repeating_${section[0]}_${id}_${entry[0]}`] = attributeValue;
                }
                attributes[`repeating_${section[0]}_${id}_repeatingOverride`] = "auto";
                attributes[`repeating_${section[0]}_${id}_augment`] = "1";
            }
        }
        setAttrs(attributes);
    }

    resolveSpecialEffects(id, effect, value, dice, values, existingEffects) {
        var attributes = {};
        var summaries = [];
        let skip = effectData.effects[effect].expiry === "ephemeral";

        this.resolveAbilities(effect);
        this.resolveAttributes(id, effect, value);

        switch (effect) {
            case "astral_fire":
                // Clear MP recovery
                attributes.mpRecoveryBlock = "on";

                // Remove Umbral Ice
                if (existingEffects.umbralIceId) {
                    summaries.push("Removed Umbral Ice");
                    removeRepeatingRow(existingEffects.umbralIceId);
                }
                summaries.push(this.addToSelf(values, dice, ["Thunderhead Ready"], existingEffects));
                break;
            case "barrier":
                setAttrs({
                    barrierPoints: Math.max(values.barrierPoints ?? 0, parseInt(value))
                });
                summaries.push(`Granted ${value} HP barrier`);
                break;
            case "clear_enfeeblements":
            case "transcendent": {
                log("Clearing all enfeeblements");
                for (let effect of existingEffects.effects) {
                    if (effect.statusType.trim().toLowerCase() === "enfeeblement") {
                        log(`Clearing ${effect.data.name}`);
                        removeEffects.remove(effect);
                    }
                }
                break;
            }
            case "consume": {
                let specification = value.split("|");
                let item = specification[0].trim();
                var effectValue = "";
                if (specification.length > 1) {
                    effectValue = specification[1];
                }

                // Consume item
                log("Consuming item");
                summaries.push(`Consumed item ${item}`);
                getSectionIDs("repeating_items", ids => {
                    let attributes = ids.flatMap(id => [`repeating_items_${id}_title`, `repeating_items_${id}_effect`, `repeating_items_${id}_count`]);
                    getAttrs(attributes, values => {
                        for (let id of ids) {
                            let title = values[`repeating_items_${id}_title`].trim();
                            let itemDescription = values[`repeating_items_${id}_effect`];
                            if (effectValue && !itemDescription.toLowerCase().includes(effectValue.toLowerCase())) {
                                continue;
                            }

                            if (item.toLowerCase() !== title.toLowerCase()) {
                                continue;
                            }

                            let count = parseInt(values[`repeating_items_${id}_count`]);
                            if (isNaN(count) || count <= 1) {
                                log("Removing item linked to ability");
                                removeRepeatingRow(`repeating_items_${id}`);
                            } else {
                                log("Removing one count of item linked to ability");
                                var newAttributes = {};
                                newAttributes[`repeating_items_${id}_count`] = count - 1;
                                setAttrs(newAttributes);
                            }
                        }
                    });
                });

                // Remove effect
                let adjustedItemName = getEffects.searchableName(item);
                for (let effect of existingEffects.effects) {
                    let adjustedSpecialType = getEffects.searchableName(effect.specialType);
                    if (adjustedSpecialType !== adjustedItemName) {
                        continue;
                    }
                    removeEffects.remove(effect);
                }
                break;
            }
            case "comatose":
            case "knocked_out": {
                // Clear all non-permanent/adventure-wide effects
                log(`Clearing all non-permanent/adventure-wide effects from ${effect.type}`);
                for (let effect of existingEffects.effects) {
                    if (effect.expiry !== "end" && effect.expiry !== "permanent") {
                        log(`Removing ${effect.data.name}`);
                        removeEffects.remove(effect);
                    }
                }
                attributes.mpRecoveryBlock = "on";
                break;
            }
            case "lucid_dreaming":
                attributes.mpRecovery = 3;
                break;
            case "restore": {
                let components = value.split("-");
                let section = components[0].toLowerCase();
                let abilityName = components[1];
                let normalizedName = abilityName.toLowerCase();
                let increment = parseInt(components[2]);
                if (isNaN(increment)) {
                    log("Cannot read value for effect " + effect);
                }

                summaries.push(`Restored ${increment} use(s) of ${abilityName}`);
                log("Restoring uses of " + abilityName);
                getSectionIDs(`repeating_${section}`, ids => {
                    let attributes = ids.flatMap(id => [`repeating_${section}_${id}_title`, `repeating_${section}_${id}_uses`, `repeating_${section}_${id}_uses_max`]);
                    getAttrs(attributes, values => {
                        for (let id of ids) {
                            let title = values[`repeating_${section}_${id}_title`];
                            if (title.toLowerCase() === normalizedName) {
                                let uses = values[`repeating_${section}_${id}_uses`];
                                let max = values[`repeating_${section}_${id}_uses_max`];
                                if (uses < max) {
                                    log("Restored " + abilityName);
                                    var attributes = {};
                                    attributes[`repeating_${section}_${id}_uses`] = Math.min(uses + increment, max);
                                    setAttrs(attributes);
                                }
                                return;
                            }
                        }
                        log("Failed to find " + abilityName);
                    });
                });
                break;
            }
            case "thrill_of_battle": {
                // Heal by roll total and add a barrier for anything that exceeds max HP
                let result = parseInt(dice.damage.result);
                if (isNaN(result)) {
                    log("Invalid dice roll for Thrill of Battle: " + JSON.stringify(dice.damage));
                } else {
                    let difference = values.hitPoints_max - values.hitPoints;
                    var hitPointsToAdd = Math.min(result, difference);

                    if (hitPointsToAdd > 0) {
                        var barrierPoints = values.barrierPoints;
                        if (difference > 0) {
                            summaries.push(`Healed ${hitPointsToAdd} HP`);
                        }
                        if (result > difference) {
                            let remainder = result - difference;
                            barrierPoints = Math.max(barrierPoints, remainder);
                            summaries.push(`Added a ${remainder} HP barrier`);
                        }
                        setAttrs({
                            hitPoints: hitPointsToAdd + values.hitPoints,
                            barrierPoints: barrierPoints
                        });
                    }
                }
                break;
            }
            case "umbral_ice":
                if (existingEffects.astralFireId) {
                    summaries.push("Removed Astral Fire");
                    removeRepeatingRow(existingEffects.astralFireId);

                    // Reset MP recovery
                    attributes.mpRecoveryBlock = "off";
                }
                summaries.push(this.addToSelf(values, dice, ["Thunderhead Ready"], existingEffects));
                break;
            default:
                break;
        }

        return { attributes: attributes, summaries: summaries, skip: skip };
    }

    matchesCondition(effect, dice) {
        let conditionMatch = effect.match(/\[([-+><=\w]+)\]/);
        if (!conditionMatch || conditionMatch.length < 2) {
            return true;
        }

        let operator = conditionMatch[1].match(/[><=]+/)[0];
        let operands = conditionMatch[1].split(operator);
        var value;
        if (operands[0].toLowerCase() == "d") {
            value = dice.hit;
        } else {
            log("Unrecognized operand " + operands[0]);
            return false;
        }

        let compareTo = parseInt(operands[1]);
        if (isNaN(value) || isNaN(compareTo)) {
            log("Unrecognized operands " + conditionMatch[1]);
            return false;
        }

        switch (operator) {
            case ">": return value > compareTo;
            case "<": return value < compareTo;
            case ">=": return value >= compareTo;
            case "<=": return value <= compareTo;
            case "=":
            case "==":
                return value == compareTo;
            default:
                log("Unrecognized operator " + operator);
                return false;
        }
    }

    replacementEffect(effect, existingEffects) {
        if (effect == "transpose") {
            if (existingEffects.astralFireId) {
                return { name: "umbral_ice", valid: true };
            } else if (existingEffects.umbralIceId) {
                return { name: "astral_fire", valid: true };
            } else {
                log("Cannot use transpose when missing both astral fire/umbral ice");
                return { valid: false };
            }
        }
        return { name: effect, valid: true };
    }
}

const addEffects = new AddEffects();