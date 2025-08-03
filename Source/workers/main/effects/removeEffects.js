/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported removeEffects*/
const effectData = {}; const getEffects = {};
/*build:end*/

class RemoveEffects {
    remove(effect) {
        let adjustedName = getEffects.searchableName(effect.specialType || effect.type);
        if (effect.data.ability) {
            this.removeAbility(adjustedName, effect.value);
        }
        removeRepeatingRow(effect.fullId);
        this.resetAttributeChanges(adjustedName, effect.attribute, effect.attributeValue);
    }

    removeAll(names, skipId) {
        getEffects(effects => {
            let matches = effects.effects.filter(effect => {
                if (effect.id == skipId) {
                    return false;
                }
                return names.includes(effect.type) || names.includes(effect.specialType.trim().toLowerCase());
            });
            for (let match of matches) {
                log(`Removing effect ${match.id} with the type ${match.specialType || match.type}`);
                removeRepeatingRow(match.fullId);
            }
        });
    }

    consumeOnAbility(name, condition, effects) {
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
                log("Consuming effect " + JSON.stringify(effect));
                // Consume X Ready
                removeRepeatingRow(effect.fullId);

                let effectName = effect.specialType || effectData[effect.type.replace("(x)", "")].name;
                summaries.push(`Consumed ${(effectName.replace("(X)", effect.value))}`);
            }
        }
        return summaries.join(", ");
    }

    resetAttributeChanges(name, attribute, value, completion) {
        log("Resetting effect attributes for " + attribute);
        let attributeValue = parseInt(value);
        if (!attribute || isNaN(attributeValue)) {
            log("No effect attributes to reset");
            if (completion) {
                completion();
            }
            return;
        }
        getAttrs([`${attribute}Effective`, `${attribute}Block`, `${attribute}Unblocked`], values => {
            let baseAttributeName;
            let currentValue;
            let newValue;
            var newAttributes = {};
            log(`${attribute}: ${values[`${attribute}Effective`]}, unblocked: ${values[`${attribute}Unblocked`]}`);
            if (name === "heavy" || name === "slow") {
                baseAttributeName = "speed";
                newAttributes.speedBlock = "off";
            }
            if (values[`${attribute}Block`] === "on") {
                baseAttributeName = `${attribute}Unblocked`;
                if (attributeValue < 0) {
                    newAttributes[`${attribute}Effective`] = parseInt(values[`${attribute}Effective`]) - attributeValue;
                }
            } else {
                baseAttributeName = `${attribute}Effective`;
            }
            currentValue = parseInt(values[baseAttributeName]);
            newValue = currentValue - attributeValue;

            if (isNaN(currentValue)) {
                log(`Unable to reset attribute ${baseAttributeName}, value is not a number: ${values[baseAttributeName]}`);
                return;
            }
            newAttributes[baseAttributeName] = newValue;
            log(`Resetting ${baseAttributeName}, ${currentValue} - ${attributeValue} = ${newValue}`);
            setAttrs(newAttributes);
            if (completion) {
                completion();
            }
        });
    }

    removeAbility(effect, value) {
        let data = effectData.effects[effect];
        if (!data || !data.ability) {
            return;
        }
        let abilityDefinition = effectData.abilities[data.ability];
        if (!abilityDefinition) {
            return;
        }

        log("Removing ability " + JSON.stringify(data));
        // Delete ability
        for (let section of Object.keys(abilityDefinition)) {
            let titles = abilityDefinition[section].map(ability => ability.title);
            getSectionIDs(`repeating_${section}`, ids => {
                let attributes = ids.flatMap(id => [`repeating_${section}_${id}_title`, `repeating_${section}_${id}_type`, `repeating_${section}_${id}_augment`]);
                getAttrs(attributes, values => {
                    for (let id of ids) {
                        let title = values[`repeating_${section}_${id}_title`];
                        let type = values[`repeating_${section}_${id}_type`];
                        let augment = values[`repeating_${section}_${id}_augment`];

                        if (value && !type.includes(value)) {
                            continue;
                        }

                        if (augment === "1" && titles.includes(title)) {
                            log("Removed augment ability " + title);
                            removeRepeatingRow(`repeating_${section}_${id}`);
                        }
                    }
                });
            });
        }
    }
}

const removeEffects = new RemoveEffects();