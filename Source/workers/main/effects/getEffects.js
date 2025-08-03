/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported getEffects*/
const effectData = {};
/*build:end*/

class GetEffects {
    searchableName(name) {
        return name
            .replaceAll(/(\([-|\s\w]+\))|(\[[-+><=\w]+\])|'/g, "")
            .replaceAll(" ", "_")
            .trim().toLowerCase();
    }

    icon(effect) {
        if (!effect || effect.type == "none") {
            return "";
        }

        if (effect.maskedType == "augment") {
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/augment.png`;
        }

        if (effect.type == "special" && effect.specialType) {
            let imageName = effect.specialType.toLowerCase().replaceAll("'", "").replaceAll(" ", "-");
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
        }

        let imageName = effect.type.replace("(x)", "-x");
        return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
    }

    classify(effects) {
        var result = {
            effects: [],
            criticalThreshold: 20
        };
        for (var effect of effects) {
            let adjustedName = this.searchableName(effect.specialType || effect.type);
            effect.adjustedName = adjustedName;
            effect.data = effectData.effects[adjustedName];
            result.effects.push(effect);

            switch (effect.data.maskedType || effect.type) {
                case "augment":
                    if (effect.specialType.trim().toLowerCase() == "aetherial focus") {
                        result.mpMaxIncrease = true;
                    }
                    break;
                case "critical(x)":
                    if (effect.value) {
                        result.criticalThreshold -= parseInt(effect.value);
                    }
                    break;
                case "damage":
                    if (result.damageRerolls) {
                        result.damageRerolls.push(effect.data.name);
                    } else {
                        result.damageRerolls = [effect.data.name];
                    }
                    break;
                case "ddown(x)":
                case "dps(x)":
                    if (result.dpsChanges) {
                        result.dpsChanges.push(effect);
                    } else {
                        result.dpsChanges = [effect];
                    }
                    log("dpsChanges: " + JSON.stringify(result.dpsChanges));
                    break;
                case "silence":
                    result.isSilenced = true;
                    break;
                case "stun":
                    result.isStunned = true;
                    break;
                default:
                    break;
            }
            if (effect.type == "special") {
                switch (effect.specialType.trim().toLowerCase()) {
                    case "astral fire":
                        result.astralFireId = effect.fullId;
                        break;
                    case "hawk's eye":
                        result.hawksEyeId = effect.fullId;
                        break;
                    case "surging tempest":
                        result.surgingTempestId = effect.fullId;
                        break;
                    case "umbral ice":
                        result.umbralIceId = effect.fullId;
                        break;
                    default:
                        break;
                }
            }
        }
        return result;
    }

    attrs(bonusAttributes, completion) {
        getSectionIDs("repeating_effects", ids => {
            const attributes = ids.flatMap((element) => [
                `repeating_effects_${element}_type`,
                `repeating_effects_${element}_specialType`,
                `repeating_effects_${element}_statusType`,
                `repeating_effects_${element}_value`,
                `repeating_effects_${element}_expiry`,
                `repeating_effects_${element}_source`,
                `repeating_effects_${element}_curable`,
                `repeating_effects_${element}_description`,
                `repeating_effects_${element}_attribute`,
                `repeating_effects_${element}_attributeValue`
            ]);
            getAttrs(attributes.concat(bonusAttributes), values => {
                var sortedValues = {};
                const effectKeys = Object.keys(values).filter((key) => key.includes("repeating_effects"));
                for (let attribute of effectKeys) {
                    let components = attribute.split("_");
                    let id = components[2];
                    let attributeName = components[3];
                    if (!sortedValues[id]) {
                        sortedValues[id] = {
                            id: id,
                            fullId: `repeating_effects_${id}`
                        };
                    }
                    sortedValues[id][attributeName] = values[attribute];
                }
                const valueObjects = Object.values(sortedValues);
                completion(values, this.classify(valueObjects));
            });
        });
    }

    get(completion) {
        this.attrs([], (values, effects) => {
            completion(effects);
        });
    }
};

const getEffects = new GetEffects();