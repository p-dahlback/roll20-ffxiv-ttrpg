/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported engine*/
class Logger {}
const effectUtilities = {}; const workerName = "";
/*build:end*/

const WorkerEngine = function(logger) {
    this.logger = logger;

    //#region Interface
    this.set = function(attributes) {
        setAttrs(attributes);
    };

    this.get = function(attributes, completion) {
        getAttrs(attributes, completion);
    };

    this.getAttrsAndEffects = function(bonusAttributes, completion) {
        getSectionIDs("repeating_effects", ids => {
            const attributes = ids.flatMap((element) => this.effectAttributes(element));
            getAttrs(attributes.concat(bonusAttributes), values => {
                var sortedValues = {};
                const effectKeys = Object.keys(values).filter((key) => key.includes("repeating_effects"));
                for (let attribute of effectKeys) {
                    let components = attribute.split("_");
                    let id = components[2];
                    let attributeName = components[3];
                    if (!sortedValues[id]) {
                        sortedValues[id] = {
                            id: id,
                            fullId: `repeating_effects_${id}`
                        };
                    }
                    sortedValues[id][attributeName] = values[attribute];
                }
                const valueObjects = Object.values(sortedValues);
                completion(values, effectUtilities.classify(valueObjects));
            });
        });
    };

    this.getEffects = function(completion) {
        this.getAttrsAndEffects([], (_, effects) => {
            completion(effects);
        });
    };

    this.getEffect = function(id, completion) {
        const attributes = this.effectAttributes(id);
        getAttrs(attributes, values => {
            var sortedValues = {};
            const effectKeys = Object.keys(values);
            for (let attribute of effectKeys) {
                let components = attribute.split("_");
                let id = components[2];
                let attributeName = components[3];
                if (!sortedValues[id]) {
                    sortedValues[id] = {
                        id: id,
                        fullId: `repeating_effects_${id}`
                    };
                }
                sortedValues[id][attributeName] = values[attribute];
            }
            let effect = sortedValues[id];
            if (!effect) {
                completion(null);
                return;
            }
            completion(effectUtilities.enrichEffect(effect));
        });
    };

    this.getSectionValues = function(sections, attributes, completion) {
        this.allSectionIDs(sections, sectionedIds => {
            let fullAttributes = sectionedIds.flatMap(sectionedId => {
                return attributes.map(attribute => `${sectionedId}_${attribute}`);
            });

            getAttrs(fullAttributes, values => {
                var items = [];
                for (let sectionedId of sectionedIds) {
                    let match = sectionedId.match(/^repeating_[-\w]+_([-\w]+)/);
                    if (!match || match.length < 2) {
                        this.logi("Missing id: " + sectionedId);
                        continue;
                    }
                    let id = match[1];
                    let item = {
                        id: id,
                        fullId: sectionedId
                    };
                    for (let attribute of attributes) {
                        item[attribute] = values[`${sectionedId}_${attribute}`];
                    }
                    items.push(item);
                }
                completion(items);
            });
        });
    };

    this.remove = function(object) {
        removeRepeatingRow(object.fullId);
    };

    this.removeEffectById = function(id) {
        removeRepeatingRow(`repeating_effects_${id}`);
    };

    this.generateId = function() {
        return generateRowID();
    };

    this.logi = function(value) {
        this.logger.i(value);
    };

    this.logd = function(value) {
        this.logger.d(value);
    };

    this.allSectionIDs = function(sections, completion) {
        let length = sections.length;
        let index = 0;
        var sectionsWithIds = [];

        let recursionBlock = function(ids) {
            let namedIds = ids.map(id => `repeating_${sections[index]}_${id}`);
            sectionsWithIds = sectionsWithIds.concat(namedIds);
            index = index + 1;

            if (index >= length) {
                completion(sectionsWithIds);
            } else {
                getSectionIDs(sections[index], recursionBlock);
            }
        };

        getSectionIDs(sections[0], recursionBlock);
    };
    //#endregion

    //#region Helpers
    this.effectAttributes = function(id) {
        return [
            `repeating_effects_${id}_type`,
            `repeating_effects_${id}_specialType`,
            `repeating_effects_${id}_statusType`,
            `repeating_effects_${id}_value`,
            `repeating_effects_${id}_expiry`,
            `repeating_effects_${id}_source`,
            `repeating_effects_${id}_curable`,
            `repeating_effects_${id}_description`,
            `repeating_effects_${id}_attribute`,
            `repeating_effects_${id}_attributeValue`,
            `repeating_effects_${id}_conditionalValue`,
            `repeating_effects_${id}_linkedId`,
            `repeating_effects_${id}_linkedType`,
            `repeating_effects_${id}_linkedEffectId`
        ];
    };
    ///#endregion
};

const engine = new WorkerEngine(new Logger(workerName, true));
this.export.WorkerEngine = WorkerEngine;
this.export.engine = engine;