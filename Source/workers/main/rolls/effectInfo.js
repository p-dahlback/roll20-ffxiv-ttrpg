/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported effectInfo*/
const effectData = {}; const effectUtilities = {};
/*build:end*/

const EffectInfo = function() {
    this.share = function(eventInfo) {
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];
        getAttrs([
            `repeating_effects_${rowId}_icon`,
            `repeating_effects_${rowId}_type`,
            `repeating_effects_${rowId}_specialType`,
            `repeating_effects_${rowId}_value`,
            `repeating_effects_${rowId}_expiry`,
            `repeating_effects_${rowId}_curable`,
            `repeating_effects_${rowId}_description`,
            `repeating_effects_${rowId}_source`
        ], values => {
            let icon = values[`repeating_effects_${rowId}_icon`];
            let type = values[`repeating_effects_${rowId}_type`];
            let specialType = values[`repeating_effects_${rowId}_specialType`];
            let value = values[`repeating_effects_${rowId}_value`];
            let curable = values[`repeating_effects_${rowId}_curable`];
            let expiry = values[`repeating_effects_${rowId}_expiry`];
            let description = values[`repeating_effects_${rowId}_description`];

            let adjustedName = effectUtilities.searchableName(specialType || type);
            let data = effectData.effects[adjustedName];

            var itemType = "Effect";
            let title;
            var descriptions = [];
            if (description) {
                descriptions.push(description);
            }
            if (data) {
                title = data.name;
                if (data.description && descriptions.length == 0) {
                    descriptions.push(data.description);
                }
                if (data.maskedType == "augment") {
                    itemType = "Augment";
                } else if (data.maskedType == "item") {
                    itemType = "Item Effect";
                }
            } else {
                title = specialType || type;
            }

            if (value) {
                descriptions.push(`Value: ${value}`);
            }
            descriptions.push(`Expires: ${effectData.expiries[expiry]}`);

            if (curable === "on") {
                descriptions.push("Can be cured.");
            }

            var iconDefinition = "";
            if (icon) {
                iconDefinition = `[icon](${icon})`;
            }
            let fullDescription = descriptions.join("\n\n");

            startRoll(`&{template:item} {{icon=${iconDefinition}}} {{title=${title}}} {{type=${itemType}}} {{effect=${fullDescription}}}`, results => {
                finishRoll(results.rollId);
            });
        });
    };
};

const effectInfo = new EffectInfo();
this.export.EffectInfo = EffectInfo;
this.export.effectInfo = effectInfo;