/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectUtilities = {}; const removeEffects = {}; const addEffects = {}; const effectData = {};
/*build:end*/

const ManualEffectValueChange = function() {
    this.resolve = function(eventInfo) {
        if (eventInfo.sourceType === "sheetworker") {
            return;
        }
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];

        let value = eventInfo.newValue.trim();


        getAttrs([
            `repeating_effects_${rowId}_type`,
            `repeating_effects_${rowId}_specialType`,
            `repeating_effects_${rowId}_attribute`,
            `repeating_effects_${rowId}_attributeValue`,
            `repeating_effects_${rowId}_curable`,
            `repeating_effects_${rowId}_expiry`
        ], values => {
            let type = values[`repeating_effects_${rowId}_type`];
            let specialType = values[`repeating_effects_${rowId}_specialType`];
            let attributeName = values[`repeating_effects_${rowId}_attribute`];
            let attributeValue = values[`repeating_effects_${rowId}_attributeValue`];
            let curable = values[`repeating_effects_${rowId}_curable`];
            let expiry = values[`repeating_effects_${rowId}_expiry`];
            let adjustedName = effectUtilities.searchableName(specialType || type);
            let data = effectData.effects[adjustedName];

            var attributes = {};
            attributes[`repeating_effects_${rowId}_name`] = effectData.hoverDescription(data.name, value, expiry, curable);
            setAttrs(attributes);

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
    };
};

const manualEffectValueChange = new ManualEffectValueChange();
this.export.ManualEffectValueChange = ManualEffectValueChange;
this.export.manualEffectValueChange = manualEffectValueChange;