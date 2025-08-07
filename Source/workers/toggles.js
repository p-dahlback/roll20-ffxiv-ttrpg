/*build:remove*/
/*build:import common/abilitySections.js*/
const togglesImports = {};
/*build:end*/

// Expand/collapse

const imports = togglesImports.export;
const itemSections = ["titles", "minions", "items"];

function toggleExpandedState(attributeName) {
    getAttrs([attributeName], values => {
        // Toggle
        const value = values[attributeName];
        var attributes = {};
        var newValue = "on";
        if (value == "on" || value == "1") {
            newValue = "off";
        } else if (value == "off" || value == "0") {
            newValue = "on";
        }
        attributes[attributeName] = newValue;
        setAttrs(attributes);
    });
}

function toggleExpandedStateInSection(eventInfo) {
    const sourceAttributes = eventInfo.sourceAttribute.split("_");
    const section = sourceAttributes[1];
    const rowId = sourceAttributes[2];
    toggleExpandedState(`repeating_${section}_${rowId}_${section}ExpandItem`);
}

function setCollapsedStateForSection(isExpanded, section) {
    getSectionIDs(`repeating_${section}`, ids => {
        var attributes = {};
        for (let id of ids) {
            attributes[`repeating_${section}_${id}_${section}ExpandItem`] = isExpanded ? "on" : "off";
        }
        if (Object.keys(attributes).length > 0) {
            setAttrs(attributes);
        }
    });
}

const toggleSections = ["traits", "effects"].concat(itemSections).concat(imports.abilitySections);
for (let section of toggleSections) {
    on(`clicked:repeating_${section}:info`, eventInfo => {
        toggleExpandedStateInSection(eventInfo);
    });
}

on("clicked:song_info clicked:primary_info clicked:ninjutsu_info clicked:secondary_info clicked:instant_info clicked:technique_info", eventInfo => {
    const actionComponents = eventInfo.htmlAttributes.name.split("_");
    const section = actionComponents[1];
    toggleExpandedState(`${section}HeaderExpandItem`);
});

on("clicked:expandAllEffects", () => {
    setCollapsedStateForSection(false, "effects");
});

on("clicked:collapseAllEffects", () => {
    setCollapsedStateForSection(true, "effects");
});

on("clicked:expandAllTraits", () => {
    setCollapsedStateForSection(false, "traits");
});

on("clicked:collapseAllTraits", () => {
    setCollapsedStateForSection(true, "traits");
});

on("clicked:expandAllItems", () => {
    for (let section of itemSections) {
        setCollapsedStateForSection(false, section);
    }
});

on("clicked:collapseAllItems", () => {
    for (let section of itemSections) {
        setCollapsedStateForSection(true, section);
    }
});

on("clicked:expandAllAbilities", () => {
    for (let section of imports.abilitySections) {
        setCollapsedStateForSection(false, section);
    }
    setAttrs({
        songHeaderExpandItem: "off",
        primaryHeaderExpandItem: "off",
        secondaryHeaderExpandItem: "off",
        instantHeaderExpandItem: "off",
        techniqueHeaderExpandItem: "off"
    });
});

on("clicked:collapseAllAbilities", () => {
    for (let section of imports.abilitySections) {
        setCollapsedStateForSection(true, section);
    }
    setAttrs({
        songHeaderExpandItem: "on",
        primaryHeaderExpandItem: "on",
        secondaryHeaderExpandItem: "on",
        instantHeaderExpandItem: "on",
        techniqueHeaderExpandItem: "on"
    });
});