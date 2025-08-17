/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectData = {}; const engine = {}; const effectUtilities = {}; const removeEffects = {}; const unpackNaN = {};
/*build:end*/

const EffectState = function(hitPoints, hitPoints_max, barrierPoints, dice, existingEffects) {
    this.hitPoints = hitPoints;
    this.hitPoints_max = hitPoints_max;
    this.barrierPoints = barrierPoints;
    this.dice = dice;
    this.existingEffects = existingEffects;

    this.existingEffectTypes = existingEffects.effects.map(effect => {
        return effect.adjustedName;
    });
};

const AddEffects = function(customEngine, customRemove) {
    this.customEngine = customEngine;
    this.customRemove = customRemove;

    this.engine = function() {
        return this.customEngine ?? engine;
    };

    this.removeEffects = function() {
        return this.customRemove ?? removeEffects;
    };

    this.addBySpecificationString = function(state, effects) {
        let builtEffects = effects.map(effect => this.effectFromSpecification(effect));
        return this.add(state, builtEffects);
    };
    
    this.add = function(state, effects) {
        var attributes = {};
        var summaries = [];

        this.engine().logd("Adding effects");
        for (let effect of effects) {
            if (!effect) {
                continue;
            }
            if (!this.matchesCondition(state, effect)) {
                this.engine().logi("Condition not fulfilled; skipping effect " + effect.adjustedName);
                continue;
            }

            let replacement = this.replacementEffect(state, effect);
            if (!replacement.valid) {
                this.logi("Discarding effect " + effect.adjustedName + ", invalid replacement");
                continue;
            }
            let adjustedEffect = replacement.effect;
            let data = adjustedEffect.data;
            if (!data) {
                this.engine().logi("Unhandled effect " + adjustedEffect);
                continue;
            }
            let duplicatesResult = this.resolveDuplicates(state, adjustedEffect);
            if (!duplicatesResult.result) {
                continue;
            }
            summaries = summaries.concat(duplicatesResult.summaries);

            var value = null;
            if (adjustedEffect.value) {
                value = adjustedEffect.value;
            } else if (effect.specification) {
                let match = effect.specification.match(/\(([-|\s\w]+)\)/);
                if (match && match.length >= 2) {
                    value = match[1];
                }
            }

            let initValues = {
                id: this.engine().generateId(),
                type: data.type,
                specialType: data.specialType,
                statusType: data.statusType,
                value: value,
                source: adjustedEffect.source ?? "Self",
                description: data.description,
                expiry: adjustedEffect.expiry ?? data.expiry,
                curable:  adjustedEffect.curable ?? (data.curable ? "on" : "off")
            };

            let specialEffectResult = this.resolveSpecialEffects(state, initValues.id, adjustedEffect, value);
            summaries = summaries.concat(specialEffectResult.summaries.filter(element => element));
            if (specialEffectResult.skip) {
                this.engine().logi("Skipping ephemeral effect " + adjustedEffect.adjustedName);
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
            attributes[`repeating_effects_${initValues.id}_icon`] = effectData.icon(data);
            attributes[`repeating_effects_${initValues.id}_statusType`] = initValues.statusType;
            attributes[`repeating_effects_${initValues.id}_expiry`] = initValues.expiry;
            attributes[`repeating_effects_${initValues.id}_source`] = initValues.source;
            attributes[`repeating_effects_${initValues.id}_description`] = initValues.description;
            attributes[`repeating_effects_${initValues.id}_curable`] = initValues.curable;
            attributes[`repeating_effects_${initValues.id}_editable`] = "off";
            attributes[`repeating_effects_${initValues.id}_origin`] = "automatic";
            attributes[`repeating_effects_${initValues.id}_effectsExpandItem`] = "on";
            attributes[`repeating_effects_${initValues.id}_name`] = effectData.hoverDescription(data.name, initValues.value, initValues.expiry, initValues.curable);

            if (duplicatesResult.summaries.length === 0) {
                summaries.push(`Activated ${data.name.replace("(X)", initValues.value)}`);
            }
        }
        if (Object.keys(attributes).length > 0) {
            this.engine().set(attributes);
        }
        return summaries.join(", ");
    };

    this.resolveAttributes = function(id, effectName, value) {
        this.engine().logd("Resolving attributes " + effectName);
        switch (effectName) {
            case "attribute": {
                this.engine().logd("Resolving attributes for attribute(x)");
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
                this.engine().get([`${attributeName}`, `${attributeName}Effective`, `${attributeName}Override`, `${attributeName}Unblocked`], values => {
                    var attributes = {};
                    let baseAttributeName;
                    let isBlocked = unpackNaN(values[`${attributeName}Override`], 0) > 0;
                    if (isBlocked) {
                        baseAttributeName = `${attributeName}Unblocked`;
                    } else {
                        baseAttributeName = `${attributeName}Effective`;
                    }

                    let currentValue = unpackNaN(values[`${baseAttributeName}`], 0);
                    let rawValue = unpackNaN(values[attributeName]);
                    let newValue = currentValue + attributeValue;
                    this.engine().logd(`${attributeName}: ${newValue}, unblocked: ${values[`${attributeName}Unblocked`]}`);
                    attributes[`repeating_effects_${id}_attribute`] = attributeName;
                    attributes[`repeating_effects_${id}_attributeValue`] = attributeValue;
                    
                    attributes[baseAttributeName] = newValue;
                    if (!isBlocked) {
                        let bottomValue = Math.min(rawValue, 0);
                        attributes[`${attributeName}Display`] = Math.max(newValue, bottomValue);
                    }
                    this.engine().logd(`Setting ${baseAttributeName} to ${newValue}`);
                    this.engine().set(attributes);
                });
                break;
            }
            case "bound": {
                this.engine().logd("Resolving attributes for bound");
                this.engine().get(["size", "speed", "speedEffective", "speedOverride", "speedUnblocked"], values => {
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
                    this.engine().logd(`speed: ${newValue}, unblocked: ${attributes.speedUnblocked}`);
                    let rawValue = unpackNaN(values.speed);
                    let bottomValue = Math.min(rawValue, 0);
                    attributes.speedEffective = newValue;
                    attributes.speedDisplay = Math.max(newValue, bottomValue);
                    attributes[`repeating_effects_${id}_attribute`] = "speed";
                    attributes[`repeating_effects_${id}_attributeValue`] = -diff;
                    this.engine().set(attributes);
                });
                break;
            }
            case "defenders_boon": {
                this.engine().logd("Resolving attributes for Defender's Boon");
                let attributeValue;
                if (value) {
                    attributeValue = unpackNaN(value.trim(), 1);
                } else {
                    attributeValue = 1;
                }
                this.engine().get(["defense", "magicDefense"], values => {
                    let defense = unpackNaN(values.defense, 0);
                    let magicDefense = unpackNaN(values.magicDefense, 0);
                    let attributeName;
                    let newValue;
                    let rawValue;
                    if (defense === magicDefense) {
                        // Do nothing
                        return;
                    } else if (defense < magicDefense) {
                        attributeName = "defense";
                        newValue = defense + attributeValue;
                        rawValue = defense;
                    } else if (magicDefense < defense) {
                        attributeName = "magicDefense";
                        newValue = magicDefense + attributeValue;
                        rawValue = magicDefense;
                    }

                    let bottomValue = Math.min(rawValue, 0);
                    var attributes = {};
                    attributes[`${attributeName}Effective`] = newValue;
                    attributes[`${attributeName}Display`] = Math.max(newValue, bottomValue);
                    attributes[`repeating_effects_${id}_attribute`] = attributeName;
                    attributes[`repeating_effects_${id}_attributeValue`] = attributeValue;
                    log(`Setting ${attributeName} to ${newValue}`);
                    this.engine().set(attributes);
                });
                break;
            }
            case "slow":
            case "heavy": {
                this.engine().logd(`Resolving attributes for ${effectName}`);
                this.engine().get(["speed", "speedEffective", "speedOverride", "speedOverrideSources", "speedUnblocked"], values => {
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
                        let bottomValue = Math.min(speed, 0);
                        attributes.speedEffective = effectiveValue;
                        attributes.speedDisplay = Math.max(effectiveValue, bottomValue);
                    }
                    attributes[`repeating_effects_${id}_attribute`] = "speed";
                    attributes[`repeating_effects_${id}_attributeValue`] = -diff;
                    this.engine().set(attributes);
                });
                break;
            }
        }
    };

    this.resolveAbilities = function(adjustedName, value = "") {
        let data = effectData.effects[adjustedName];
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
                let id = this.engine().generateId();
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
        this.engine().set(attributes);
    };

    this.resolveDuplicates = function(state, effect) {
        if (effect.data.duplicate === "block" && state.existingEffectTypes.includes(effect.adjustedName)) {
            this.engine().logd("Effect " + effect.name + " already exists, skipping");
            return { result: false, summaries: [] };
        }

        var summaries = [];
        if (effect.data.duplicate == "replace") {
            for (let replacable of state.existingEffects.effects) {
                if (replacable.type == effect.data.type && replacable.specialType == effect.data.specialType) {
                    summaries.push(`Reactivated ${effect.data.specialType ?? effect.data.type}`);
                    this.engine().remove(replacable);
                }
            }
        }
        return { result: true, summaries: summaries };
    };

    this.resolveSpecialEffects = function(state, id, effect, value) {
        var attributes = {};
        var summaries = [];
        let skip = effect.data.expiry === "ephemeral";

        this.resolveAbilities(effect.adjustedName);
        this.resolveAttributes(id, effect.adjustedName, value);

        switch (effect.adjustedName) {
            case "astral_fire":
                // Clear MP recovery
                attributes.mpRecoveryBlock = "on";

                // Remove Umbral Ice
                if (state.existingEffects.umbralIce) {
                    summaries.push("Removed Umbral Ice");
                    this.engine().remove(state.existingEffects.umbralIce);
                }
                summaries.push(this.addBySpecificationString(state, ["Thunderhead Ready"]));
                break;
            case "barrier":
                this.engine().set({
                    barrierPoints: Math.max(state.barrierPoints ?? 0, parseInt(value))
                });
                summaries.push(`Granted ${value} HP barrier`);
                break;
            case "clear_enfeeblements":
            case "transcendent": {
                this.engine().logd("Clearing all enfeeblements");
                for (let existingEffect of state.existingEffects.effects) {
                    if (existingEffect.statusType.trim().toLowerCase() === "enfeeblement") {
                        this.engine().logd(`Clearing ${existingEffect.data.name}`);
                        this.removeEffects().remove(existingEffect);
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
                this.engine().logd("Consuming item");
                summaries.push(`Consumed item ${item}`);
                let itemAttributes = ["title", "effect", "count"];
                this.engine().getSectionValues("items", itemAttributes, items => {
                    for (let existingItem of items) {
                        let title = existingItem.title.trim();
                        let itemDescription = existingItem.effect;
                        if (effectValue && !itemDescription.toLowerCase().includes(effectValue.toLowerCase())) {
                            continue;
                        }

                        if (item.toLowerCase() !== title.toLowerCase()) {
                            continue;
                        }

                        let count = parseInt(existingItem.count);
                        if (isNaN(count) || count <= 1) {
                            log("Removing item linked to ability");
                            this.engine().remove(item);
                        } else {
                            log("Removing one count of item linked to ability");
                            var newAttributes = {};
                            newAttributes[`repeating_items_${id}_count`] = count - 1;
                            this.engine().set(newAttributes);
                        }
                    }
                });

                // Remove effect
                let adjustedItemName = effectUtilities.searchableName(item);
                for (let existingEffect of state.existingEffects.effects) {
                    let adjustedSpecialType = effectUtilities.searchableName(existingEffect.specialType);
                    if (adjustedSpecialType !== adjustedItemName) {
                        continue;
                    }
                    this.removeEffects().remove(existingEffect);
                }
                break;
            }
            case "comatose":
            case "knocked_out": {
                // Clear all non-permanent/adventure-wide effects
                this.engine().logd(`Clearing all non-permanent/adventure-wide effects from ${effect.type}`);
                for (let existingEffect of state.existingEffects.effects) {
                    if (existingEffect.expiry !== "end" && existingEffect.expiry !== "permanent") {
                        log(`Removing ${existingEffect.data.name}`);
                        this.removeEffects().remove(existingEffect);
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
                    log("Cannot read value for effect " + effect.adjustedName);
                }

                summaries.push(`Restored ${increment} use(s) of ${abilityName}`);
                this.engine().logd("Restoring uses of " + abilityName);

                let abilityAttributes = ["title", "uses", "uses_max"];
                this.engine().getSectionValues(section, abilityAttributes, abilities => {
                    for (let ability of abilities) {
                        let title = ability.title;
                        if (title.toLowerCase() === normalizedName) {
                            let uses = ability.uses;
                            let max = ability.uses_max;
                            if (uses < max) {
                                this.engine().logd("Restored " + abilityName);
                                var attributes = {};
                                attributes[`repeating_${section}_${id}_uses`] = Math.min(uses + increment, max);
                                this.engine().set(attributes);
                            }
                            return;
                        }
                    }
                    this.engine().logi("Failed to find " + abilityName);
                });
                break;
            }
            case "thrill_of_battle": {
                // Heal by roll total and add a barrier for anything that exceeds max HP
                let result = parseInt(state.dice.damage.result);
                if (isNaN(result)) {
                    this.engine().logi("Invalid dice roll for Thrill of Battle: " + JSON.stringify(state.dice.damage));
                } else {
                    let difference = state.hitPoints_max - state.hitPoints;
                    var hitPointsToAdd = Math.min(result, difference);

                    if (hitPointsToAdd > 0) {
                        var barrierPoints = state.barrierPoints;
                        if (difference > 0) {
                            summaries.push(`Healed ${hitPointsToAdd} HP`);
                        }
                        if (result > difference) {
                            let remainder = result - difference;
                            barrierPoints = Math.max(barrierPoints, remainder);
                            summaries.push(`Added a ${remainder} HP barrier`);
                        }
                        this.engine().set({
                            hitPoints: hitPointsToAdd + state.hitPoints,
                            barrierPoints: barrierPoints
                        });
                    }
                }
                break;
            }
            case "umbral_ice":
                if (state.existingEffects.astralFire) {
                    summaries.push("Removed Astral Fire");
                    this.engine().remove(state.existingEffects.astralFire);

                    // Reset MP recovery
                    attributes.mpRecoveryBlock = "off";
                }
                summaries.push(this.addBySpecificationString(state, ["Thunderhead Ready"]));
                break;
            default:
                break;
        }

        return { attributes: attributes, summaries: summaries, skip: skip };
    };

    this.matchesCondition = function(state, effect) {
        if (!state.dice || !effect.specification) {
            return true;
        }

        let conditionMatch = effect.specification.match(/\[([-+><=\w]+)\]/);
        if (!conditionMatch || conditionMatch.length < 2) {
            return true;
        }

        let operator = conditionMatch[1].match(/[><=]+/)[0];
        let operands = conditionMatch[1].split(operator);
        var value;
        if (operands[0].toLowerCase() == "d") {
            value = state.dice.hit;
        } else {
            this.engine().logi("Unrecognized operand " + operands[0]);
            return false;
        }

        let compareTo = parseInt(operands[1]);
        if (isNaN(value) || isNaN(compareTo)) {
            this.engine().logi("Unrecognized operands " + conditionMatch[1]);
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
                this.engine().logi("Unrecognized operator " + operator);
                return false;
        }
    };

    this.replacementEffect = function(state, effect) {
        switch (effect.adjustedName) {
            case "lightweight_refit_proc": {
                let adjustedEffect = this.effectFromSpecification("attribute");
                adjustedEffect.value = "speed,1";
                adjustedEffect.source = effect.source;
                adjustedEffect.expiry = "turn";
                return { effect: adjustedEffect, valid: true };
            }
            case "transpose": {
                let adjustedEffect;
                if (state.existingEffects.astralFire) {
                    this.engine().logd("Replacing effect Transpose with Umbral Ice");
                    adjustedEffect = this.effectFromSpecification("umbral_ice");
                } else if (state.existingEffects.umbralIce) {
                    this.engine().logd("Replacing effect Transpose with Astral Fire");
                    adjustedEffect = this.effectFromSpecification("astral_fire");
                } else {
                    this.engine().logi("Cannot use transpose when missing both astral fire/umbral ice");
                    return { valid: false };
                }
                adjustedEffect.source = effect.source;
                return { effect: adjustedEffect, valid: true };
            }
        }
        return { effect: effect, valid: true };
    };

    this.effectFromSpecification = function(specification) {
        let adjustedName = effectUtilities.searchableName(specification);
        let data = effectData.effects[adjustedName];
        return {
            specification: specification,
            adjustedName: adjustedName,
            data: data
        };
    };
};

const addEffects = new AddEffects();

this.export.EffectState = EffectState;
this.export.AddEffects = AddEffects;
this.export.addEffects = addEffects;