/*build:remove*/
/*eslint no-unused-vars: "error"*/
/* exported sheetSetup */
const engine = {};
const abilitySections = []; const sheetAttributes = {}; const ThreadLessPromise = {};
/*build:end*/

const SheetExport = function() {

    this.execute = function() {
        let basicAttributes = sheetAttributes.misc.concat(sheetAttributes.resources, sheetAttributes.main);
        getAttrs(basicAttributes, values => {
            var target = {
                base: {},
                resources: {},
                attributes: {}
            };
            target = this.applyAttributes(values, target, "base", sheetAttributes.misc);
            target = this.applyAttributes(values, target, "resources", sheetAttributes.resources);
            target = this.applyAttributes(values, target, "attributes", sheetAttributes.main);

            let basicSections = [
                { name: "traits", keys: sheetAttributes.traits },
                { name: "titles", keys: sheetAttributes.titles },
                { name: "minions", keys: sheetAttributes.minions },
                { name: "items", keys: sheetAttributes.items }
            ];
            let abilities = abilitySections.map(section => { return { name: section, keys: sheetAttributes.abilities }; });
            let allSections = basicSections.concat(abilities);
            var repeatingTarget = {};

            let promise = new ThreadLessPromise(allSections.length, () => {
                for (let section of basicSections) {
                    engine.logd("Exporting " + section.name);
                    target[section.name] = repeatingTarget[section.name];
                }
                target = this.processAbilities(abilitySections, repeatingTarget, target);
                this.exportObject(target);
            });
            
            for (let section of allSections) {
                this.applyRepeating(section.name, section.keys, objects => {
                    repeatingTarget[section.name] = objects;
                    promise.complete();
                });
            }
        });
    };

    this.exportObject = function(object) {
        engine.logd("Export complete; output to textbox");

        let text = JSON.stringify(object);
        setAttrs({
            export: text
        });
    };

    this.processAbilities = function(abilitySections, container, target) {
        engine.logd("Final processing of abilities");
        let config = abilitySections.sort().reduce(
            (accumulator, section) => {
                let match = section.match(/([A-Za-z]+)([0-9]+)?/);
                if (!match[1]) {
                    return accumulator;
                } else if (!match[2]) {
                    accumulator[section] = { maxCount: container[section].length, items: [container[section]] };
                } else {
                    let pureName = match[1];
                    let number = parseInt(match[2]);
                    if (isNaN(number)) {
                        return accumulator;
                    }
                    // Make zero indexed
                    number = number - 1;
                    if (!accumulator[pureName]) {
                        accumulator[pureName] = { maxCount: 0, items: [[]] };
                    }
                    if (accumulator[pureName].length < number + 1) {
                        accumulator[pureName].items.push(container[section]);
                    } else {
                        accumulator[pureName].items[number] = container[section];
                    }
                    if (container[section].length > accumulator[pureName].maxCount) {
                        accumulator[pureName].maxCount = container[section].length;
                    }
                }
                return accumulator;
            },
            {}
        );
        target.abilities = {};
        for (let key of Object.keys(config)) {
            let maxCount = config[key].maxCount;
            let items = config[key].items;
            var abilities = [];

            engine.logd("Exporting " + key);
            for (let index = 0; index < maxCount; index++) {
                for (let section in items) {
                    if (index >= items[section].length) {
                        abilities.push({ spacer: true });
                    } else {
                        abilities.push(items[section][index]);
                    }
                }
            }
            target.abilities[key] = abilities;
        }
        return target;
    };

    this.applyAttributes = function(attributes, target, parentKey, attributeKeys) {
        engine.logd(`Exporting ${parentKey} attributes`);
        for (let key of attributeKeys) {
            if (attributes[key] || attributeKeys[key] === 0) {
                target[parentKey][key] = attributes[key];
            }
        }
        return target;
    };

    this.applyRepeating = function(sectionName, attributeKeys, completion) {
        engine.logd("Processing " + sectionName);
        getSectionIDs(`repeating_${sectionName}`, ids => {
            if (ids.length === 0) {
                completion([]);
            } else {
                let attributes = ids.reduce(
                    (accumulator, id) => {
                        let attributesForId = attributeKeys.map(key => { return `repeating_${sectionName}_${id}_${key}`; });
                        accumulator = accumulator.concat(attributesForId);
                        return accumulator;
                    },
                    []
                );
                getAttrs(attributes, values => {
                    var objects = [];
                    for (let id of ids) {
                        var target = {};
                        for (let key of attributeKeys) {
                            let value = values[`repeating_${sectionName}_${id}_${key}`];
                            if (value || value === 0) {
                                target[key] = value;
                            }
                        }
                        objects.push(target);
                    }
                    completion(objects);
                });
            }
        });
    };
};

const sheetExport = new SheetExport();
this.export.SheetExport = SheetExport;
this.export.sheetExport = sheetExport;