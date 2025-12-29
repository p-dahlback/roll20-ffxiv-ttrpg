/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectUtilities = {}; const effectData = {};
/*build:end*/

const ManualEffectCurableChange = function() {
    this.resolve = function(eventInfo) {
        if (eventInfo.sourceType === "sheetworker") {
            return;
        }
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];

        let curable = eventInfo.newValue.trim();

        getAttrs([
            `repeating_effects_${rowId}_type`,
            `repeating_effects_${rowId}_specialType`,
            `repeating_effects_${rowId}_value`,
            `repeating_effects_${rowId}_expiry`,
            `repeating_effects_${rowId}_linkedName`
        ], values => {
            let type = values[`repeating_effects_${rowId}_type`];
            let specialType = values[`repeating_effects_${rowId}_specialType`];
            let value = values[`repeating_effects_${rowId}_value`];
            let expiry = values[`repeating_effects_${rowId}_expiry`];
            let linkedName = values[`repeating_effects_${rowId}_linkedName`];
            let adjustedName = effectUtilities.searchableName(specialType || type);
            let data = effectData.effects[adjustedName];

            var attributes = {};
            attributes[`repeating_effects_${rowId}_name`] = effectData.hoverDescription(data.name, value, expiry, curable, linkedName);
            setAttrs(attributes);
        });
    };
};

const manualEffectCurableChange = new ManualEffectCurableChange();
this.export.ManualEffectValueChange = ManualEffectCurableChange;
this.export.manualEffectCurableChange = manualEffectCurableChange;