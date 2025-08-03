/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported manualEffectValueChange*/
const getEffects = {}; const removeEffects = {}; const addEffects = {};
/*build:end*/

class ManualEffectValueChange {
    resolve(eventInfo) {
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];

        let value = eventInfo.newValue.trim();

        getAttrs([
            `repeating_effects_${rowId}_type`,
            `repeating_effects_${rowId}_specialType`,
            `repeating_effects_${rowId}_attribute`,
            `repeating_effects_${rowId}_attributeValue`
        ], values => {
            let type = values[`repeating_effects_${rowId}_type`];
            let specialType = values[`repeating_effects_${rowId}_specialType`];
            let attributeName = values[`repeating_effects_${rowId}_attribute`];
            let attributeValue = values[`repeating_effects_${rowId}_attributeValue`];
            let adjustedName = getEffects.searchableName(specialType || type);
            if (adjustedName === "attribute" || adjustedName === "defenders_boon") {
                log(`New attribute values: ${attributeName}, ${attributeValue}`);
                if (attributeName || attributeValue) {
                    removeEffects.resetAttributeChanges(adjustedName, attributeName, attributeValue, () => {
                        addEffects.resolveAttributes(rowId, adjustedName, value);
                    });
                } else {
                    addEffects.resolveAttributes(rowId, adjustedName, value);
                }
            }
        });
    }
}

const manualEffectValueChange = new ManualEffectValueChange();