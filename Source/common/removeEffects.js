/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectData = {}; const engine = {}; const effectUtilities = {}; const unpackNaN = {};
/*build:end*/

const RemoveEffects = function(customEngine) {
    this.customEngine = customEngine;

    this.engine = function() {
        return this.customEngine ?? engine;
    };

    this.remove = function(effect) {
        let adjustedName = effectUtilities.searchableName(effect.specialType || effect.type);
        if (effect.data.ability) {
            this.removeAbility(adjustedName, effect.value);
        }
        this.engine().remove(effect);
        this.resetSpecialEffects(adjustedName);
        this.resetAttributeChanges(adjustedName, effect.attribute, effect.attributeValue);
    };

    this.removeAll = function(names, skipId) {
        this.engine().getEffects(effects => {
            let matches = effects.effects.filter(effect => {
                if (effect.id == skipId) {
                    return false;
                }
                return names.includes(effect.type) || names.includes(effect.specialType.trim().toLowerCase());
            });
            for (let match of matches) {
                this.engine().logd(`Removing effect ${match.id} with the type ${match.specialType || match.type}`);
                this.remove(match);
            }
        });
    };

    this.consumeOnAbility = function(name, condition, effects) {
        var summaries = [];
        for (let effect of effects.effects) {
            let normalizedName = name.toLowerCase();
            let normalizedCondition = condition.toLowerCase();
            let specialType = (effect.specialType ?? "").toLowerCase();
            let maskedType = effect.data.maskedType.toLowerCase();
            let value = (effect.value ?? "").toLowerCase();
            let isReadyType = effect.type == "ready(x)";

            if (!isReadyType && !specialType.includes(" ready") && !maskedType.includes(" ready")) {
                continue;
            }

            if (
                specialType.includes(normalizedName) ||
                normalizedCondition.includes(specialType) ||
                (isReadyType && value == normalizedName) ||
                (isReadyType && normalizedCondition.includes(value))
            ) {
                this.engine().logd("Consuming effect " + JSON.stringify(effect));
                // Consume X Ready
                this.engine().remove(effect);

                let effectName = effect.specialType || effectData.effects[effect.type.replace("(x)", "")].name;
                summaries.push(`Consumed ${(effectName.replace("(X)", effect.value))}`);
            }
        }
        return summaries.join(", ");
    };

    this.resetSpecialEffects = function(name) {
        switch (name) {
            case "astral_fire":
                this.engine().logd("Astral Fire removed; resetting mp recovery");
                this.engine().set({
                    mpRecoveryBlock: "off"
                });
                break;
            case "comatose":
            case "knocked_out":
                this.engine().logd(`${effectData.effects[name].name}; resetting mp recovery`);
                this.engine().set({
                    mpRecoveryBlock: "off"
                });
                break;
            case "lucid_dreaming":
                this.engine().logd("Lucid Dreaming removed; resetting mp recovery");
                this.engine().set({
                    mpRecovery: 2
                });
                break;
            default:
                break;
        };
    };

    this.resetAttributeChanges = function(name, attribute, value, completion) {
        this.engine().logd("Resetting effect attributes for " + attribute);
        let attributeValue = parseInt(value);
        if (!attribute || isNaN(attributeValue)) {
            this.engine().logd("No effect attributes to reset");
            if (completion) {
                completion();
            }
            return;
        }
        this.engine().get([`${attribute}Effective`, `${attribute}Override`, `${attribute}OverrideSources`, `${attribute}Unblocked`], values => {
            let baseAttributeName;
            let currentValue;
            let newValue;
            var newAttributes = {};
            this.engine().logd(`${attribute}: ${values[`${attribute}Effective`]}, unblocked: ${values[`${attribute}Unblocked`]}`);
            if (name === "heavy" || name === "slow") {
                let overrideSources = Math.max(unpackNaN(values.speedOverrideSources, 1) - 1, 0);
                newAttributes.speedOverrideSources = overrideSources;
                if (overrideSources === 0) {
                    baseAttributeName = "speedEffective";
                    currentValue = values.speedEffective;
                    newAttributes.speedOverride = 0;
                    newAttributes.speedEffective = values.speedUnblocked;
                    newAttributes.speedDisplay = values.speedUnblocked;
                    this.engine().logd(`Unblocking speed, ${currentValue} -> ${values.speedUnblocked}`);
                }
            } else {
                let isBlocked = unpackNaN(values[`${attribute}Override`]) > 0;
                if (isBlocked) {
                    baseAttributeName = `${attribute}Unblocked`;
                    if (attributeValue < 0) {
                        let adjustedValue = unpackNaN(values[`${attribute}Effective`], 1000) - attributeValue;
                        let effectiveValue = Math.min(adjustedValue, values.speedOverride);
                        newAttributes[`${attribute}Effective`] = effectiveValue;
                        newAttributes[`${attribute}Display`] = Math.max(effectiveValue, 0);
                    }
                } else {
                    baseAttributeName = `${attribute}Effective`;
                }
                currentValue = unpackNaN(values[baseAttributeName], 0);
                newValue = currentValue - attributeValue;

                if (isNaN(currentValue)) {
                    this.engine().logi(`Unable to reset attribute ${baseAttributeName}, value is not a number: ${values[baseAttributeName]}`);
                    return;
                }
                newAttributes[baseAttributeName] = newValue;
                if (!isBlocked) {
                    newAttributes[`${attribute}Display`] = Math.max(newValue, 0);
                }
                this.engine().logd(`Resetting ${baseAttributeName}, ${currentValue} - ${attributeValue} = ${newValue}`);
            }
            this.engine().set(newAttributes);
            if (completion) {
                completion();
            }
        });
    };

    this.removeAbility = function(effect, value) {
        let data = effectData.effects[effect];
        if (!data || !data.ability) {
            return;
        }
        let abilityDefinition = effectData.abilities[data.ability];
        if (!abilityDefinition) {
            return;
        }

        this.engine().logd("Removing ability " + JSON.stringify(data));
        // Delete ability
        for (let section of Object.keys(abilityDefinition)) {
            let titles = abilityDefinition[section].map(ability => ability.title);
            let attributeNames = ["title", "type", "augment"];
            this.engine().getSectionValues(section, attributeNames, abilities => {
                for (let ability of abilities) {
                    let title = ability.title;
                    let type = ability.type;
                    let augment = ability.augment;

                    if (value && !type.includes(value)) {
                        continue;
                    }

                    if (augment === "1" && titles.includes(title)) {
                        this.engine().logd("Removed augment ability " + title);
                        this.engine().remove(ability);
                    }
                }
            });
        }
    };
};

const removeEffects = new RemoveEffects();
this.export.RemoveEffects = RemoveEffects;
this.export.removeEffects = removeEffects;