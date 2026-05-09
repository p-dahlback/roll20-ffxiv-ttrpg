/*build:remove*/
/*eslint no-unused-vars: "error"*/
/* exported sheetReset */
const engine = [];
const abilitySections = []; const ThreadLessPromise = {};
/*build:end*/

const SheetReset = function() {

    this.clear = function(completion) {
        engine.logd(`Clearing all list objects`);
        let sections = abilitySections.concat(["effects", "traits", "titles", "minions", "items"]);
        let promise = new ThreadLessPromise(sections.length, completion);
        for (let section of sections) {
            getSectionIDs(`repeating_${section}`, ids => {
                for (let id of ids) {
                    removeRepeatingRow(`repeating_${section}_${id}`);
                }
                promise.complete();
            });
        }
    };

    this.clearAllAbilitiesAndEffects = function(completion) {
        engine.logd(`Clearing abilities and effects`);
        let sections = abilitySections.concat(["traits", "effects"]);
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
    };
};

const sheetReset = new SheetReset();
this.export.SheetReset = SheetReset;
this.export.sheetReset = sheetReset;