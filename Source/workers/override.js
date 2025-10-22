/*build:remove*/
/*build:import common/abilitySections.js*/
const overrideImports = {};
/*build:end*/

const imports = overrideImports.export;

// Assign override state
on('change:override', () => {
    getAttrs(['override'], values => {
        log("Changed override to " + values.override);
        for (let section of imports.abilitySections) {
            getSectionIDs(`repeating_${section}`, ids => {
                const output = {};
                ids.forEach(id => output[`repeating_${section}_${id}_repeatingOverride`] = values.override);
                setAttrs(output);
            });
        }
    });
});