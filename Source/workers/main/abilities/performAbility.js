/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported performAbility, AbilityId*/
const engine = {};
const abilitySections = [];
const effectUtilities = {};
/*build:end*/

const AbilityId = function(section, rowId) {
    this.section = section;
    this.rowId = rowId;
};

const PerformAbility = function() {

    this.resolveResources = function(damageRoll, abilityId, values, effects) {
        engine.logd("Resolving resources");
        const abilityPath = abilityId ? `repeating_${abilityId.section}_${abilityId.rowId}` : "";
        const uses = abilityId ? values[`${abilityPath}_uses`] : 0;
        const usesMax = abilityId ? values[`${abilityPath}_uses_max`] : 0;

        var state = {
            isGeneric: values.sheet_type != "unique",
            hitPoints: values.hitPoints, hitPoints_max: values.hitPoints_max,
            magicPoints: values.magicPoints, magicPoints_max: values.magicPoints_max,
            resource: values.resource, resourceValue: values.resourceValue, resourceValue_max: values.resourceValue_max,
            resource2: values.resource2, resource2Value: values.resource2Value, resource2Value_max: values.resource2Value_max,
            resource3: values.resource3, resource3Value: values.resource3Value, resource3Value_max: values.resource3Value_max,
            range1: values.range1, range1_max: values.range1_max,
            range2: values.range2, range2_max: values.range2_max,
            range3: values.range3, range3_max: values.range3_max,
            uses: uses, usesMax: usesMax, abilityPath: abilityPath
        };
        state[`${abilityPath}_uses`] = uses;
        state[`${abilityPath}_uses_max`] = usesMax;

        // Spend cost
        let costResult = this.spendCostIfNeeded(damageRoll, state);
        if (!costResult.success) {
            engine.logd("Failed to spend cost");
            return costResult.summary;
        }
        state = costResult.state;

        // Spend uses
        let usesResult = this.spendUsesIfNeeded(damageRoll, state);
        if (!usesResult.success) {
            engine.logd("Failed to spend uses");
            return usesResult.summary;
        }
        state = usesResult.state;
        var summaries = [costResult.summary, usesResult.summary];

        // Special handling for Ninja's Mudra
        summaries.push(this.clearMudraIfNeeded(damageRoll, state));

        // Restore resources
        if (damageRoll.restoration) {
            let result = this.restoreByStringSpecification(damageRoll.restoration, state);
            state = result.state;
            summaries.push(result.summary);
        }

        // Perform Umbral Ice restoration if applicable
        if (effects.umbralIce && effectUtilities.isEffectOfType(damageRoll, "ice-aspect")) {
            let result = this.restore(5, "MP", state);
            state = result.state;
            summaries.push(`${result.summary} (Umbral Ice)`);
        }

        // Handle Summoner's auto-restore
        summaries.push(this.restoreViaCarbuncleIfNeeded(state, effects));
        return summaries.filter(element => element).join("\n");
    };

    //#region Cost
    this.spendCostIfNeeded = function(damageRoll, state) {
        if (!damageRoll.cost || damageRoll.cost <= 0) {
            return {
                success: true,
                state: state,
                summary: ""
            };
        }
        let specification = this.resourceSpecification(damageRoll.resource, state);
        if (!specification) {
            return {
                success: false,
                state: state,
                summary: `Couldn't parse resource ${damageRoll.resource}`
            };
        }
        engine.logd("Spending resources");
        let previousValue = state[specification.attributeName];
        let result = this.spendResource(damageRoll.cost, specification, state);
        var modifiedState = result.state;
        if (result.success) {
            modifiedState.didSpendAllMp = specification.resourceType === "MP" && damageRoll.cost == previousValue;
        }
        return {
            success: result.success,
            state: modifiedState,
            summary: result.summary
        };
    };
    //#endregion

    //#region Uses
    this.spendUsesIfNeeded = function(damageRoll, state) {
        let usesMax = state[`${state.abilityPath}_uses_max`];
        if (!state.abilityPath || !usesMax || usesMax <= 0) {
            return {
                success: true,
                state: state,
                summary: ""
            };
        }
        engine.logd("Spending uses");
        let specification = {
            resourceType: "uses",
            attributeName: `${state.abilityPath}_uses`,
            attributeNameMax: `${state.abilityPath}_uses_max`
        };
        let result = this.spendResource(1, specification, state);
        var modifiedState = result.state;

        if (!result.success && damageRoll.cost > 0) {
            // Refund the cost if necessary
            let restoreResult = this.restore(damageRoll.cost, damageRoll.resource, modifiedState);
            modifiedState = restoreResult.state;
        }      
        return {
            success: result.success,
            state: modifiedState,
            summary: result.summary
        };
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

    this.resetAllUses = function() {
        for (let section of abilitySections) {
            this.resetUses(section);
        }
    };
    //#endregion

    //#region Restoration
    this.restoreByStringSpecification = function(restoration, state) {
        if (!restoration) {
            return {
                state: state,
                summary: ""
            };
        }

        const restoreValues = restoration.split(",");
        let summaryPrefix = state.isGeneric ? "Restore" : "Restored";
        var summaries = [];
        var modifiedState = state;
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
            const value = parts[0];
            const resource = parts[1];
            let result = this.restore(value, resource, state);
            summaries.push(result.summary);
            modifiedState = result.state;
        }

        return {
            state: modifiedState,
            summary: `${summaryPrefix} ${summaries.join(", ")}`
        };
    };

    this.restore = function(value, resource, state) {
        let specification = this.resourceSpecification(resource, state);
        if (!specification) {
            engine.logi("Unrecognized restore type " + resource);
            return {
                success: false,
                state: state,
                summary: `Unable to restore; couldn't parse resource ${resource}`
            };
        }
        var modifiedState = state;

        engine.logi(`Restoring ${value} ${specification.attributeName}`);
        if (!state.isGeneric) {
            const max = state[specification.attributeNameMax];
            const sum = +value + +state[specification.attributeName];
            const newValue = Math.min(sum, max);
            var attributes = {};
            attributes[specification.attributeName] = newValue;
            modifiedState[specification.attributeName] = newValue;
            setAttrs(attributes);
            engine.logd(`Restored ${specification.attributeName} to ${newValue}`);
        }
        return {
            success: true,
            state: modifiedState,
            summary: `${value} ${specification.resourceType}`
        };
    };

    this.restoreViaCarbuncleIfNeeded = function(state, effects) {
        if (!effects.gemEffect) {
            return "";
        }
        if (!state.didSpendAllMp || state.magicPoints === state.magicPoints_max) {
            return "";
        }
        if (effects.gemEffect.adjustedName === "carbuncle" && effects.gemEffect.value === "1") {
            // Clear the effect for this turn
            var attrs = {};
            attrs[`${effects.gemEffect.fullId}_value`] = "0";
            setAttrs(attrs);

            let result = this.restore(1, "MP", state);
            if (result.success) {
                let prefix = state.isGeneric ? "Restore" : "Restored";
                return `${prefix} ${result.summary} (Carbuncle)`;
            } else {
                return result.summary;
            }
        }
        return "";
    };
    //#endregion

    //#region Helpers
    this.spendResource = function(cost, specification, state) {
        if (state.isGeneric) {
            return { 
                state: state, 
                success: true, 
                summary: `Spend ${cost} ${specification.resourceType}`
            };
        }
        if (!specification.resourceType) {
            return {
                state: state,
                success: false,
                summary: `Unable to expend ability cost - resource was not defined`
            };
        }
        if (cost <= 0) {
            return {
                state: state,
                success: false,
                summary: `Unable to expend ability cost - cost ${cost} needs to be greater than zero`
            };
        }

        let value = state[specification.attributeName];
        let value_max = state[specification.attributeNameMax];
        if (value >= 0 && value_max >= 0) {
            if (value < cost) {
                return {
                    state: state,
                    success: false,
                    summary: `${cost} ${specification.resourceType} - Insufficient (${value}/${value_max})`
                };
            } else {
                var modifiedState = state;
                const newValue = value - cost;
                var attributes = {};
                attributes[specification.attributeName] = newValue;
                modifiedState[specification.attributeName] = newValue;
                setAttrs(attributes);

                const resultString = `Spent ${cost} ${specification.resourceType} (${newValue}/${value_max})`;
                engine.logd(resultString);
                return {
                    state: modifiedState,
                    success: true,
                    summary: resultString
                };
            }
        } else {
            return {
                state: state,
                success: false,
                summary: `${cost} ${specification.resourceType} - Character has no ${specification.resourceType}!`
            };
        }
    };

    this.resourceSpecification = function(resourceType, state) {
        if (!resourceType) {
            return null;
        }

        const resourceNames = [state.resource, state.resource2, state.resource3].filter(name => name);
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
                let key = index === 0 ? "resourceValue" : `resource${index + 1}Value`;
                return {
                    resourceType: resourceNames[index],
                    attributeName: key,
                    attributeNameMax: `${key}_max`
                };
            }
        }
        engine.logi("Don't recognize resource " + resourceType);
        return null;
    };

    this.clearMudraIfNeeded = function(damageRoll, values) {
        if (values.resource.toLowerCase() !== "mudra") {
            return null;
        }
        if (parseInt(values.resourceValue) === 0) {
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
    //#endregion
};

const performAbility = new PerformAbility();
this.export.PerformAbility = PerformAbility;
this.export.AbilityId = AbilityId;
this.export.performAbility = performAbility;