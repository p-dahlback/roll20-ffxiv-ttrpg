/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported performAbility, AbilityId*/
const engine = {};
const abilitySections = [];
/*build:end*/

const AbilityId = function(section, rowId) {
    this.section = section;
    this.rowId = rowId;
};

const PerformAbility = function() {

    this.resolveResources = function(damageRoll, abilityId, values, effects) {
        
        const uses = abilityId ? values[`repeating_${abilityId.section}_${abilityId.rowId}_uses`] : 0;
        const usesMax = abilityId ? values[`repeating_${abilityId.section}_${abilityId.rowId}_uses_max`] : 0;

        const isGeneric = values.sheet_type != "unique";

        var summaries = [];
        var resourceResult = false;
        if (damageRoll.cost > 0) {
            let specification = this.resourceSpecification(damageRoll.resource, values);
            if (specification) {
                engine.logd("Spending resources");
                let result = this.spend(
                    isGeneric,
                    damageRoll.cost,
                    specification.resourceType,
                    values[specification.attributeName],
                    values[specification.attributeNameMax],
                    specification.attributeName
                );
                resourceResult = result[0];
                summaries.push(result[1]);
            }
        }

        if (damageRoll.cost > 0 && !resourceResult) {
            return "";
        }

        // Special handling for Ninja's Mudra
        summaries.push(this.clearMudraIfNeeded(damageRoll, values));

        // Spend uses if there are any
        if (abilityId && usesMax > 0) {
            engine.logd("Spending uses");
            let result = this.spend(
                isGeneric,
                1,
                "uses",
                uses,
                usesMax,
                `repeating_${abilityId.section}_${abilityId.rowId}_uses`
            );
            if (result[1]) {
                summaries.push(result[1]);
            }
        }

        // Restore resources
        engine.logd("Checking to restore");
        if (damageRoll.restoration) {
            summaries.push(this.restore(isGeneric, damageRoll.restoration, values));
        } else {
            engine.logd("No restore");
        }
        // Perform Umbral Ice restoration if applicable
        let isIceType = damageRoll.type.toLowerCase().includes("ice-aspect");
        if (isIceType && effects.umbralIce) {
            summaries.push(`${this.restore(isGeneric, "5 mp", values)} (Umbral Ice)`);
        }
        return summaries.filter(element => element).join("\n");
    };

    this.resetAllUses = function() {
        for (let section of abilitySections) {
            this.resetUses(section);
        }
    };

    this.resourceSpecification = function(resourceType, values) {
        if (!resourceType) {
            return null;
        }

        const resourceNames = [values.resource, values.resource2, values.resource3].filter(name => name);
        const ranges = [
            { key: "range1", name: "Opo-opo's Fury" },
            { key: "range2", name: "Raptor's Fury" },
            { key: "range3", name: "Coeurl's Fury" }
        ];
        let resourceTypeLowerCase = resourceType.toLowerCase();
        if (resourceTypeLowerCase === "mp") {
            return {
                resourceType: "MP",
                attributeName: "magicPoints",
                attributeNameMax: "magicPoints_max"
            };
        } else if (resourceTypeLowerCase === "hp") {
            return {
                resourceType: "HP",
                attributeName: "hitPoints",
                attributeNameMax: "hitPoints_max"
            };
        } else if (resourceTypeLowerCase.startsWith("range")) {
            let index = ranges.findIndex(obj => obj.key === resourceTypeLowerCase);
            if (index !== -1) {
                return {
                    resourceType: ranges[index].name,
                    attributeName: ranges[index].key,
                    attributeNameMax: `${ranges[index].key}_max`
                };
            }
        } else {
            let index = resourceNames.findIndex(name => name.toLowerCase() === resourceTypeLowerCase);
            if (index !== -1) {
                let key = index === 0 ? "resourceValue" : `resource${index}`;
                return {
                    name: resourceNames[index],
                    attributeName: key,
                    attributeNameMax: `${key}_max`
                };
            }
        }
        engine.logi("Don't recognize resource " + resourceType);
        return null;
    };

    this.spend = function(isGeneric, cost, resourceType, value, value_max, attributeName) {
        if (isGeneric) {
            return [true, `Spend ${cost} ${resourceType}`];
        }

        if (cost > 0 && resourceType && value >= 0 && value_max >= 0) {
            if (value < cost) {
                return [false, `${cost} ${resourceType} - Insufficient (${value}/${value_max})`];
            } else {
                const newValue = value - cost;
                var attributes = {};
                attributes[attributeName] = newValue;
                setAttrs(attributes);
                const resultString = `Spent ${cost} ${resourceType} (${newValue}/${value_max})`;
                engine.logd(resultString);
                return [true, resultString];
            }
        } else {
            return [false, `${cost} ${resourceType} - Character has no ${resourceType}!`];
        }
    };

    this.restore = function(isGeneric, restoration, values) {
        const restoreValues = restoration.split(",");
        var attributes = [];
        var summary = isGeneric ? "Restore " : "Restored ";
        var didRestore = false;
        for (let i = 0; i < restoreValues.length; i++) {
            var parts = restoreValues[i].trim().split(" ");
            if (parts.length < 2) {
                engine.logi("Invalid restore declaration " + restoreValues[i]);
                continue;
            }
            if (parts.length > 2) {
                // Account for resources that have spaces in the name
                parts = [parts[0], parts.slice(1).join(" ")];
            }
            const typeForValue = parts[1];
            let specification = this.resourceSpecification(typeForValue, values);
            if (!specification) {
                engine.logi("Unrecognized restore type " + typeForValue);
                continue;
            }
            didRestore = true;
            engine.logi(`Restoring ${parts[0]} ${specification.attributeName}`);
            attributes.push({
                name: specification.attributeName,
                value: parts[0]
            });
            summary += `${parts[0]} ${specification.resourceType}, `;
        }

        if (!didRestore) {
            return "";
        }

        if (!isGeneric) {
            const attributeNames = attributes.flatMap((element) => [element.name, element.name + "_max"]);
            getAttrs(attributeNames, values => {
                var newValues = {};
                for (let attribute of attributes) {
                    const value = values[attribute.name];
                    const max = values[attribute.name + "_max"];
                    const sum = +value + +attribute.value;
                    const newValue = Math.min(sum, max);
                    newValues[attribute.name] = newValue;
                    engine.logd("Restored " + attribute.name + " to " + newValue);
                }
                setAttrs(newValues);
            });
        }

        return summary.substring(0, summary.length - 2);
    };

    this.resetUses = function(section) {
        engine.logd("Resetting uses for section " + section);
        getSectionIDs(`repeating_${section}`, ids => {
            let attributes = ids.flatMap(id => [`repeating_${section}_${id}_uses`, `repeating_${section}_${id}_uses_max`]);
            getAttrs(attributes, values => {
                var updatedAttributes = {};
                for (let id of ids) {
                    if (parseInt(values[`repeating_${section}_${id}_uses_max`]) > 0) {
                        updatedAttributes[`repeating_${section}_${id}_uses`] = values[`repeating_${section}_${id}_uses_max`];
                    }
                }
                setAttrs(updatedAttributes);
            });
        });
    };

    this.clearMudraIfNeeded = function(damageRoll, values) {
        if (values.resource.toLowerCase() !== "mudra") {
            return null;
        }
        let title = damageRoll.title;
        if (title === "Ritual Weave" || title === "Kassatsu" || title === "Ninjutsu") {
            return null;
        }

        engine.logd("Clearing Mudra");
        
        //  Reset Mudra resource when rolling unrelated abilities on Ninja
        setAttrs({
            resourceValue: 0
        });
        return "Cleared Mudra";
    };
};

const performAbility = new PerformAbility();
this.export.PerformAbility = PerformAbility;
this.export.AbilityId = AbilityId;
this.export.performAbility = performAbility;