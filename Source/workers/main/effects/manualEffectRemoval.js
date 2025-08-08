/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectUtilities = {}; const removeEffects = {}; const engine = {};
/*build:end*/

const ManualEffectRemoval = function() {
    this.resolve = function(eventInfo) {
        if (eventInfo.sourceType === "sheetworker") {
            return;
        }
        engine.logd("Removing repeating effect");
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];

        let type = eventInfo.removedInfo[`repeating_effects_${rowId}_type`];
        let specialType = eventInfo.removedInfo[`repeating_effects_${rowId}_specialType`];
        let value = eventInfo.removedInfo[`repeating_effects_${rowId}_value`];
        let affectedAttribute = eventInfo.removedInfo[`repeating_effects_${rowId}_attribute`];
        let affectedAttributeValue = parseInt(eventInfo.removedInfo[`repeating_effects_${rowId}_attributeValue`]);
        let adjustedName = effectUtilities.searchableName(specialType || type);
        if (!adjustedName) {
            return;
        }
        removeEffects.removeAbility(adjustedName, value);
        removeEffects.resetSpecialEffects(adjustedName);
        removeEffects.resetAttributeChanges(adjustedName, affectedAttribute, affectedAttributeValue);
    };
};

const manualEffectRemoval = new ManualEffectRemoval();
this.export.ManualEffectRemoval = ManualEffectRemoval;
this.export.manualEffectRemoval = manualEffectRemoval;