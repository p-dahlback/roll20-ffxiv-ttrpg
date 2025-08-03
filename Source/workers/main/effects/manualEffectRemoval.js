/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported manualEffectRemoval*/
const getEffects = {}; const removeEffects = {}; const effectData = {};
/*build:end*/

class ManualEffectRemoval {
    resolve(eventInfo) {

        log("Removing repeating effect");
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];

        let type = eventInfo.removedInfo[`repeating_effects_${rowId}_type`];
        let specialType = eventInfo.removedInfo[`repeating_effects_${rowId}_specialType`];
        let value = eventInfo.removedInfo[`repeating_effects_${rowId}_value`];
        let affectedAttribute = eventInfo.removedInfo[`repeating_effects_${rowId}_attribute`];
        let affectedAttributeValue = parseInt(eventInfo.removedInfo[`repeating_effects_${rowId}_attributeValue`]);
        let adjustedName = getEffects.searchableName(specialType || type);
        removeEffects.removeAbility(adjustedName, value);
        removeEffects.resetAttributeChanges(adjustedName, affectedAttribute, affectedAttributeValue);

        if (!specialType) {
            return;
        }
        switch (adjustedName) {
            case "astral_fire":
                log("Astral Fire removed; resetting mp recovery");
                setAttrs({
                    mpRecoveryBlock: "off"
                });
                break;
            case "comatose":
            case "knocked_out":
                log(`${effectData[adjustedName].name}; resetting mp recovery`);
                setAttrs({
                    mpRecoveryBlock: "off"
                });
                break;
            case "lightweight_refit__proc":
                log("Lightweight Refit removed; resetting speed");
                getAttrs(["speed"], values => {
                    let newValue = (values.speed ?? 0) - 1;
                    setAttrs({
                        speed: Math.max(newValue, 0)
                    });
                });
                break;
            case "lucid_dreaming":
                log("Lucid Dreaming removed; resetting mp recovery");
                setAttrs({
                    mpRecovery: 2
                });
                break;
            default:
                break;
        }
    }
}

const manualEffectRemoval = new ManualEffectRemoval();