// Assign override state
on('change:override', () => {
    getAttrs(['override'], values => {
        log("Changed override to " + values.override);
        getSectionIDs('repeating_limit', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_limit_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
        getSectionIDs('repeating_song', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_song_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
        getSectionIDs('repeating_primary', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_primary_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
        getSectionIDs('repeating_ninjutsu', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_ninjutsu_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
        getSectionIDs('repeating_secondary', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_secondary_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
        getSectionIDs('repeating_instant', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_instant_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
        getSectionIDs('repeating_technique', ids => {
            const output = {};
            ids.forEach(id => output[`repeating_technique_${id}_repeatingOverride`] = values.override);
            setAttrs(output);
        });
    });
});