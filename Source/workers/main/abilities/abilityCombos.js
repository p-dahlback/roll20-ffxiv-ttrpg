/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported abilityCombos */
const engine = {};
/*build:end*/

const AbilityCombos = function() {

    this.resolveAvailableCombos = function(combo, abilityId, values) {
        engine.logd("Resolving available combos");
        if (!combo || !abilityId) {
            return "";
        }
        let specifications = this.parseCombo(combo);
        return this.buttonsForComboSpecifications(specifications, abilityId, values);
    };

    this.parseCombo = function(combo) {
        let choices = combo.split(",");
        return choices.map(choice => {
            let matches = choice.match(/^\s*([\w ':-]+)(?:\(([\w |()':-]*)\))?\s*$/);
            if (!matches || !matches[1]) {
                engine.logd("Unable to parse combo " + choice);
                return null;
            }
            return this.specificationForCombo(matches[1], matches[2]);
        }).filter(spec => spec);
    };

    this.specificationForCombo = function(name, parameters) {
        var specification = {
            name: name,
            selfEffects: "",
            targetEffects: "",
            isCustom: false
        };
        if (parameters) {
            engine.logd("Parsing combo parameters " + parameters);
            specification.isCustom = true;
            let parameterList = parameters.split("|");
            for (let parameter of parameterList) {
                let matches = parameter.match(/^([\w-]+):\s*([\w()-]+)\s*([\w-]+)?$/);
                let key = matches[1];
                let value = matches[2];
                let resource = matches[3];
                if (!key || !value) {
                    engine.logd("Unable to parse combo parameter " + parameter);
                    continue;
                }
                specification[key] = value;
                if (resource) {
                    specification[`${key}_resource`] = resource;
                }
            }
        }
        return specification;
    };

    this.buttonsForComboSpecifications = function(comboSpecifications, abilityId, values) {
        if (!abilityId) {
            return "";
        }
        var buttons = "";
        for (let index = 0; index < comboSpecifications.length; index++)  {
            let combo = comboSpecifications[index];
            if (combo.cost && combo.cost_resource) {
                let currentValue = parseInt(values[combo.cost_resource]);
                if (isNaN(currentValue)) {
                    engine.logd("Unrecognized resource " + combo.cost_resource);
                    continue;
                }
                let cost = parseInt(combo.cost);
                if (isNaN(cost)) {
                    engine.logd("Cannot parse combo cost " + combo.cost);
                    continue;
                }
                if (cost > currentValue) {
                    engine.logd(`Skipping ${combo.name}; cost too high (${cost} > ${currentValue})`);
                    continue;
                }
            }
            buttons += `[${combo.name}](~${values.character_name}|repeating_${abilityId.section}_${abilityId.rowId}_runcombo${index + 1})`;
        }
        return buttons;
    };
};

const abilityCombos = new AbilityCombos();
this.export.AbilityCombos = AbilityCombos;
this.export.abilityCombos = abilityCombos;