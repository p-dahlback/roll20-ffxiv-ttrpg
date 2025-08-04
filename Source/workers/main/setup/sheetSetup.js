/*build:remove*/
/*eslint no-unused-vars: "error"*/
/* exported sheetSetup */
const abilitySections = [];
/*build:end*/

class SheetSetup {
    execute(sheet) {
        this.clearAllAbilitiesAndEffects(() => {
            log("Clear complete; initializing sheet");
            var attributes = {
                job: sheet.job,
                jobIcon: sheet.jobIcon,
                level: sheet.level ?? 30,
                role: sheet.role,
                sheet_type: "unique",
                team: "adventurer",
                size: "normal",
                override: "auto"
            };

            log("Preparing resources");
            for (let entry of Object.entries(sheet.resources)) {
                attributes[entry[0]] = entry[1];
            }

            log("Preparing base attributes");
            for (let entry of Object.entries(sheet.attributes)) {
                attributes[entry[0]] = entry[1];
                attributes[`${entry[0]}Effective`] = entry[1];
                attributes[`${entry[0]}Display`] = entry[1];
                attributes[`${entry[0]}Unblocked`] = entry[1];
                attributes[`${entry[0]}Override`] = 0;
            }
            attributes.mpRecovery = 2;
            attributes.mpRecoveryBlock = "off";

            log("Preparing traits");
            for (let trait of sheet.traits) {
                let id = generateRowID();
                for (let entry of Object.entries(trait)) {
                    attributes[`repeating_traits_${id}_${entry[0]}`] = entry[1];
                    attributes[`repeating_traits_${id}_icon`] = sheet.jobIcon;
                    attributes[`repeating_traits_${id}_automatic`] = "1";
                    attributes[`repeating_traits_${id}_editable`] = "off";
                }
            }

            log("Preparing abilities");
            for (let section of Object.entries(sheet.abilities)) {
                for (let ability of section[1]) {
                    let id = generateRowID();
                    for (let entry of Object.entries(ability)) {
                        attributes[`repeating_${section[0]}_${id}_${entry[0]}`] = entry[1];
                    }
                    attributes[`repeating_${section[0]}_${id}_repeatingOverride`] = "auto";
                }
            }
            setAttrs(attributes);
        });
    }

    clearAllAbilitiesAndEffects(completion) {
        log(`Clearing abilities and effects`);
        let sections = abilitySections.concat(["traits", "effects"]);
        const ThreadLessPromise = class {
            constructor(count, completion) {
                this.count = count;
                this.completions = 0;
                this.completion = completion;
            }

            complete() {
                this.completions += 1;
                log(`Completed cleanup ${this.completions}/${this.count}`);
                if (this.completions >= this.count) {
                    this.completion();
                }
            }
        };
        let promise = new ThreadLessPromise(sections.length, completion);

        for (let section of sections) {
            getSectionIDs(`repeating_${section}`, ids => {
                let attributes = ids.map(id => `repeating_${section}_${id}_automatic`);
                getAttrs(attributes, values => {
                    for (let id of ids) {
                        if (section == "traits") {
                            // Only remove auto-added traits
                            if (values[`repeating_${section}_${id}_automatic`] === "1") {
                                removeRepeatingRow(`repeating_${section}_${id}`);
                            }
                        } else {
                            removeRepeatingRow(`repeating_${section}_${id}`);
                        }
                    }
                    promise.complete();
                });
            });
        }
    }
};

const sheetSetup = new SheetSetup();