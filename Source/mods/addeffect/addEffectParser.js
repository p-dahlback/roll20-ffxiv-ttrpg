/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectData = {}; const effectUtilities = {};
/*build:end*/

const AddEffectParser = function(msg) {
    this.msg = msg;

    this.parseEffectSpecification = function(specificationText) {
        let specifications = specificationText.split(",");
        var effects = [];
        for (let specification of specifications) {
            let effect = {
                id: "-1",
                type: "none",
                statusType: "Enhancement",
                typeName: "",
                specialType: "",
                value: "",
                source: "Self",
                abilities: undefined,
                editable: "1",
                target: "selected",
                characters: [],
                player: this.msg.playerid,
                who: this.msg.who,
                origin: "FFXIVAddEffect"
            };
            let formatMatch = specification.match(/([-'_\s\w]+)(?:[([]([-|\s\w]+)[)\]])?/);
            if (!formatMatch) {
                return {
                    success: false,
                    effects: effects,
                    message: "Malformed effect specification " + specification
                };
            }
            let name = formatMatch[1];
            if (formatMatch.length > 2 && formatMatch[2]) {
                effect.value = formatMatch[2];
            }

            let data = effectData.matches.find(type => type.matches && type.matches.includes(name.toLowerCase()));
            if (!data) {
                return {
                    success: false,
                    effects: effects,
                    message: "Unknown effect" + name
                };
            }
            effect.data = data;

            if (data.specialType) {
                effect.specialType = data.specialType;
                effect.maskedType = data.maskedType;
                effect.typeName = data.specialType;
                if (data.ability) {
                    effect.abilities = effectData.abilities[data.ability];
                }
            } else {
                effect.typeName = data.name;
            }
            effect.adjustedName = effectUtilities.searchableName(data.specialType ?? data.type);
            effect.icon = effectData.icon(effect);
            effect.type = data.type;
            effect.statusType = data.statusType;
            effect.description = data.description;
            effects.push(effect);
        }
        return {
            success: true,
            effects: effects,
            message: null
        };
    };
};

this.export.AddEffectParser = AddEffectParser;