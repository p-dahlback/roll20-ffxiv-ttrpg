/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported abilityInfo*/
const rollTemplates = {};
/*build:end*/

class AbilityInfo {
    // Share ability details to chat
    share(eventInfo) {
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];
        getAttrs([
            `repeating_${section}_${rowId}_icon`,
            `repeating_${section}_${rowId}_title`,
            `repeating_${section}_${rowId}_type`,
            `repeating_${section}_${rowId}_cost`,
            `repeating_${section}_${rowId}_resource`,
            `repeating_${section}_${rowId}_condition`,
            `repeating_${section}_${rowId}_trigger`,

            `repeating_${section}_${rowId}_target`,
            `repeating_${section}_${rowId}_range`,
            `repeating_${section}_${rowId}_check`,
            `repeating_${section}_${rowId}_cr`,

            `repeating_${section}_${rowId}_baseEffect`,
            `repeating_${section}_${rowId}_directHit`,
            `repeating_${section}_${rowId}_effectName`,
            `repeating_${section}_${rowId}_effect`,
            `repeating_${section}_${rowId}_limitation`
        ], values => {
            const icon = values[`repeating_${section}_${rowId}_icon`];
            const title = values[`repeating_${section}_${rowId}_title`];
            const type = rollTemplates.unpackValueWithTitle("Type:", values[`repeating_${section}_${rowId}_type`]);
            const condition = rollTemplates.unpackValueWithTitle("Condition:", values[`repeating_${section}_${rowId}_condition`]);
            const trigger = rollTemplates.unpackValueWithTitle("Trigger:", values[`repeating_${section}_${rowId}_trigger`]);
            const target = rollTemplates.unpackValueWithTitle("Target:", values[`repeating_${section}_${rowId}_target`]);
            const range = rollTemplates.unpackValueWithTitle("Range:", values[`repeating_${section}_${rowId}_range`]);
            const check = rollTemplates.unpackValueWithTitle("Check:", values[`repeating_${section}_${rowId}_check`]);
            const cr = rollTemplates.unpackValueWithTitle("CR:", values[`repeating_${section}_${rowId}_cr`]);
            const baseEffect = rollTemplates.unpackValueWithTitle("Base Effect:", values[`repeating_${section}_${rowId}_baseEffect`]);
            const directHit = rollTemplates.unpackValueWithTitle("Direct Hit:", values[`repeating_${section}_${rowId}_directHit`]);
            const effectName = values[`repeating_${section}_${rowId}_effectName`];
            const effect = values[`repeating_${section}_${rowId}_effect`];
            const limitation = rollTemplates.unpackValueWithTitle("Limitation:", values[`repeating_${section}_${rowId}_limitation`]);

            var cost = rollTemplates.unpackValueWithTitle("Cost:", values[`repeating_${section}_${rowId}_cost`]);
            var resourceType = values[`repeating_${section}_${rowId}_resource`];
            if (cost[1] <= 0) {
                cost = ["", ""];
                resourceType = "";
            }

            startRoll(`&{template:ability} {{icon=[icon](${icon})}} {{name=${title}}} {{costTitle=${cost[0]}}} {{cost=${cost[1]}}} {{resourceType=${resourceType}}}` +
                `{{typeTitle=${type[0]}}} {{type=${type[1]}}} {{conditionTitle=${condition[0]}}} {{condition=${condition[1]}}}` +
                `{{triggerTitle=${trigger[0]}}} {{trigger=${trigger[1]}}} {{targetTitle=${target[0]}}} {{target=${target[1]}}}` +
                `{{rangeTitle=${range[0]}}} {{range=${range[1]}}} {{checkTitle=${check[0]}}} {{check=${check[1]}}}` +
                `{{crTitle=${cr[0]}}} {{cr=${cr[1]}}} {{baseEffectTitle=${baseEffect[0]}}} {{baseEffect=${baseEffect[1]}}}` +
                `{{directHitTitle=${directHit[0]}}} {{directHit=${directHit[1]}}} {{effectTitle=${effectName}}} {{effect=${effect}}}` +
                `{{limitationTitle=${limitation[0]}}} {{limitation=${limitation[1]}}}`, results => {
                    finishRoll(results.rollId);
                });
        });
    }
}

const abilityInfo = new AbilityInfo();