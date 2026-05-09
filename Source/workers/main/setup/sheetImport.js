/*build:remove*/
/*eslint no-unused-vars: "error"*/
/* exported sheetSetup */
const engine = {};
const sheetReset = {}; const sheetAttributes = {};
/*build:end*/

const SheetImport = function() {

    this.importSheet = function(text) {
        engine.logd("Importing full sheet");
        let sheet;
        try {
            sheet = JSON.parse(text);
        } catch {
            setAttrs({
                import: "Invalid format, cannot import"
            });
        }
        if (!sheet.base) {
            engine.logd("No detectable base attributes in import; aborting");
            return;
        }
        var attributes = {};
        sheetReset.clear(() => {
            engine.logd("Clear complete, initializing sheet");
            attributes = this.applyMiscAttributes(sheet, attributes);
            attributes = this.applyResources(sheet, attributes);
            attributes = this.applyMainAttributes(sheet, attributes);
            attributes = this.applyTraits(sheet, attributes, null);
            attributes = this.applyTitles(sheet, attributes);
            attributes = this.applyMinions(sheet, attributes);
            attributes = this.applyItems(sheet, attributes);
            attributes = this.applyAbilities(sheet, attributes, null);
            attributes.import = "";
            attributes.export = "";
            
            setAttrs(attributes);
        });
    };

    this.importJob = function(sheet) {
        engine.logd("Importing Job Sheet");
        sheetReset.clearAllAbilitiesAndEffects(() => {
            engine.logd("Clear complete; initializing sheet");
            var attributes = {
                job: sheet.base.job,
                jobIcon: sheet.base.jobIcon,
                level: sheet.base.level ?? 30,
                role: sheet.base.role
            };
            attributes.override = sheet.override ?? "auto";
            attributes.barrierPoints = 0;

            attributes = this.applyResources(sheet, attributes);
            attributes = this.applyMainAttributes(sheet, attributes);
            attributes = this.applyTraits(sheet, attributes, {
                icon: sheet.base.jobIcon,
                automatic: "1",
                editable: "off"
            });
            attributes = this.applyAbilities(sheet, attributes, {
                repeatingOverride: "auto"
            });
            setAttrs(attributes);
        });
    };

    this.applyMiscAttributes = function(sheet, attributes) {
        if (!sheet.base) {
            return attributes;
        }
        engine.logd("Preparing base attributes");
        // Set defaults if needed
        attributes.origin = "";
        attributes.bonds = "";
        attributes.selectedTitle = "";
        attributes.selectedTitleEffect = "";
        attributes.selectedMinion = "";
        attributes.selectedMinionEffect = "";
        attributes.mpRecovery = sheet.base.mpRecovery ?? 2;
        attributes.mpRecoveryBlock = sheet.base.mpRecoveryBlock ?? "off";

        for (let key of sheetAttributes.misc) {
            if (sheet.base[key] || sheet.base[key] === 0) {
                attributes[key] = sheet.base[key];
            }
        }
        return attributes;
    };

    this.applyResources = function(sheet, attributes) {
        if (!sheet.resources) {
            return attributes;
        }
        engine.logd("Preparing resource attributes");
        for (let key of sheetAttributes.resources) {
            if (sheet.resources[key] || sheet.resources[key] === 0) {
                attributes[key] = sheet.resources[key];
            }
        }
        return attributes;
    };

    this.applyMainAttributes = function(sheet, attributes) {
        if (!sheet.attributes) {
            return attributes;
        }
        engine.logd("Preparing main attributes");
        for (let key of sheetAttributes.main) {
            let value = sheet.attributes[key] ?? 0;
            attributes[key] = value;
            attributes[`${key}Effective`] = value;
            attributes[`${key}Display`] = value;
            attributes[`${key}Unblocked`] = value;
            attributes[`${key}Override`] = 0;
        }
        return attributes;
    };

    this.applyTraits = function(sheet, attributes, defaults) {
        if (!sheet.traits) {
            return attributes;
        }
        engine.logd("Preparing traits");
        for (let trait of sheet.traits) {
            let id = engine.generateId();
            for (let key of sheetAttributes.traits) {
                if (trait[key] || trait[key] === 0) {
                    attributes[`repeating_traits_${id}_${key}`] = trait[key];
                } else if (defaults && defaults[key]) {
                    attributes[`repeating_traits_${id}_${key}`] = defaults[key];
                }
            }
        }
        return attributes;
    };

    this.applyTitles = function(sheet, attributes) {
        if (!sheet.titles) {
            return attributes;
        }
        engine.logd("Preparing titles");
        for (let title of sheet.titles) {
            let id = engine.generateId();
            for (let key of sheetAttributes.titles) {
                if (title[key] || title[key] === 0) {
                    attributes[`repeating_titles_${id}_${key}`] = title[key];
                }
            }
        }
        return attributes;
    };

    this.applyMinions = function(sheet, attributes) {
        if (!sheet.minions) {
            return attributes;
        }
        engine.logd("Preparing minions");
        for (let minion of sheet.minions) {
            let id = engine.generateId();
            for (let key of sheetAttributes.minions) {
                if (minion[key] || minion[key] === 0) {
                    attributes[`repeating_minions_${id}_${key}`] = minion[key];
                }
            }
        }
        return attributes;
    };

    this.applyItems = function(sheet, attributes) {
        if (!sheet.items) {
            return attributes;
        }
        engine.logd("Preparing items");
        for (let item of sheet.items) {
            let id = engine.generateId();
            for (let key of sheetAttributes.items) {
                if (item[key] || item[key] === 0) {
                    attributes[`repeating_items_${id}_${key}`] = item[key];
                }
            }
        }
        return attributes;
    };

    this.applyAbilities = function(sheet, attributes, defaults) {
        if (!sheet.abilities) {
            return attributes;
        }
        engine.logd("Preparing abilities");
        for (let section of Object.entries(sheet.abilities)) {
            for (let index in section[1]) {
                let ability = section[1][index];
                if (ability.spacer) {
                    continue;
                }
                let sectionName;
                if (section[0] === "limit") {
                    sectionName = section[0];
                } else {
                    let column = (index % 3) + 1;
                    sectionName = `${section[0]}${column}`;
                }
                let id = engine.generateId();
                for (let key of sheetAttributes.abilities) {
                    if (ability[key] || ability[key] === 0) {
                        attributes[`repeating_${sectionName}_${id}_${key}`] = ability[key];
                    } else if (defaults && defaults[key]) {
                        attributes[`repeating_${sectionName}_${id}_${key}`] = defaults[key];
                    }
                }
            }
        }
        return attributes;
    };
};

const sheetImport = new SheetImport();
this.export.SheetImport = SheetImport;
this.export.sheetImport = sheetImport;