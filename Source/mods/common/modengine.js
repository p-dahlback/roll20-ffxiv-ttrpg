/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectUtilities = {}; const unpackAttribute = {}; const setAttribute = {};
/*build:end*/

const generateUUID = (() => {
    let a = 0;
    let b = [];
    return () => {
        let c = (new Date()).getTime() + 0;
        let f = 7;
        let e = new Array(8);
        let d = c === a;
        a = c;
        for (; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        } else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++) {
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    };
})();

const ModEngine = function(logger, character) {
    this.name = "ModEngine";
    this.logger = logger;
    this.character = character;
    if (!this.character) {
        logger.i("Character must be specified for mods");
    }

    this.set = function(attributes) {
        for (let attribute of Object.entries(attributes)) {
            let name = attribute[0];
            let value = attribute[1];
            if (value === undefined || value === null) {
                this.logger.i("Undefined value encountered for " + name);
                continue;
            }

            if (name.endsWith("_max")) {
                let baseName = name.replace("_max", "");
                let actionableAttribute = unpackAttribute(this.character, baseName);
                setAttribute(actionableAttribute, "max", value);
            } else {
                let actionableAttribute = unpackAttribute(this.character, name);
                setAttribute(actionableAttribute, "current", value);
            }
            this.logger.d("Set " + name + " to " + value);
        }
    };

    this.get = function(attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        var attributesToFind = attributes.filter(attribute => !attribute.endsWith("_max"));
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let index = attributesToFind.indexOf(name);
                if (index > -1) {
                    attributesToFind.splice(index, 1);
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    accumulator[name] = value;
                    if (max) {
                        accumulator[`${name}_max`] = max;
                    }
                }
                return accumulator;
            },
            { }
        );
        for (let remainingAttribute of attributesToFind) {
            filteredAttributes[remainingAttribute] = undefined;
        }
        completion(filteredAttributes);
    };

    this.getAttrsAndEffects = function(attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let match = currentValue.get("name").match(/^repeating_effects_([-\w]+)_([\w_]+)$/);
                if (match) {
                    let id = match[1];
                    let effectAttributeName = match[2];
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    if (!accumulator.effects[id]) {
                        accumulator.effects[id] = {
                            id: id,
                            fullId: `repeating_effects_${id}`,
                            _vars: []
                        };
                    }
                    accumulator.effects[id][effectAttributeName] = value;
                    if (max) {
                        accumulator.effects[id][`${effectAttributeName}_max`] = max;
                    }
                    accumulator.effects[id]._vars.push(currentValue);
                } else if (attributes.includes(name)) {
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    accumulator.values[name] = value;
                    if (max) {
                        accumulator.values[`${name}_max`] = max;
                    }
                }
                return accumulator;
            },
            { effects: {}, values: {} }
        );
        let effects = Object.values(filteredAttributes.effects);
        completion(filteredAttributes.values, effectUtilities.classify(effects));
    };

    this.getSectionValues = function(section, attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let match = currentValue.get("name").match(new RegExp(`^repeating_${section}_([-\\w]+)_([\\w_]+)$/`));
                if (match) {
                    let id = match[1];
                    let attributeName = match[2];
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    if (!accumulator[id]) {
                        accumulator[id] = {
                            id: id,
                            fullId: `repeating_${section}_${id}`,
                            _vars: []
                        };
                    }
                    accumulator[id][attributeName] = value;
                    if (max) {
                        accumulator[id][`${attributeName}_max`] = max;
                    }
                    accumulator[id]._vars.push(currentValue);
                } else {
                    return accumulator;
                }
            },
            { }
        );
        let items = Object.values(filteredAttributes);
        completion(items);
    };

    this.remove = function(object) {
        if (object._vars) {
            for (let attribute of object._vars) {
                attribute.remove();
            }
        } else {
            this.logger.i("Attempted to remove an unremovable variable: " + JSON.stringify(object));
        }
    };

    this.generateId = function() { 
        return generateUUID().replace(/_/g, "Z"); 
    };

    this.logi = function(value) {
        this.logger.i(value);
    };

    this.logd = function(value) {
        this.logger.d(value);
    };
};

const engine = null;
this.export.ModEngine = ModEngine;
this.export.engine = engine;