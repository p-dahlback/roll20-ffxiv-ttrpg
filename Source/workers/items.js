
// Items

function shareItemToChat(eventInfo) {
    const sourceAttributes = eventInfo.sourceAttribute.split("_");
    const section = sourceAttributes[1];
    const rowId = sourceAttributes[2];
    getAttrs([
        `repeating_${section}_${rowId}_title`,
        `repeating_${section}_${rowId}_effect`
    ], values => {
        const title = values[`repeating_${section}_${rowId}_title`];
        const effect = values[`repeating_${section}_${rowId}_effect`];

        var type;
        switch (section) {
            case "items":
                type = "Item";
                break;
            case "titles":
                type = "Title";
                break;
            case "minions":
                type = "Minion";
                break;
            case "traits":
                type = "Trait";
                break;
            default:
                log("Unrecognized item type " + section);
                return;
        }

        startRoll(`&{template:item} {{title=${title}}} {{type=${type}}} {{effect=${effect}}}`, results => {
            finishRoll(results.rollId);
        });
    });
}

// Remove items with zero content
on("change:repeating_items:count", eventInfo => {
    const sourceAttributes = eventInfo.sourceAttribute.split("_");
    const section = sourceAttributes[1];
    const rowId = sourceAttributes[2];

    let newValue = parseInt(eventInfo.newValue);
    if (isNaN(newValue)) {
        log("Cannot manage items with NaN count");
        return;
    }
    if (newValue <= 0) {
        log("Removing consumed item");
        removeRepeatingRow(`repeating_${section}_${rowId}`);
    }
});

on("clicked:repeating_titles:share clicked:repeating_minions:share clicked:repeating_items:share clicked:repeating_traits:share", eventInfo => {
    shareItemToChat(eventInfo);
});

on("clicked:repeating_titles:select", eventInfo => {
    const rowid = eventInfo.sourceAttribute.split("_")[2];
    getAttrs([
        `repeating_titles_${rowid}_title`, 
        `repeating_titles_${rowid}_effect`
    ], values => {
        // Assign selected title
        setAttrs({
            selectedTitleId: rowid,
            selectedTitle: values[`repeating_titles_${rowid}_title`],
            selectedTitleEffect: values[`repeating_titles_${rowid}_effect`]
        });
    });
});

// Minion selection
on("clicked:repeating_minions:select", eventInfo => {
    const rowid = eventInfo.sourceAttribute.split("_")[2];
    getAttrs([
        `repeating_minions_${rowid}_title`, 
        `repeating_minions_${rowid}_effect`
    ], values => {
        // Assign selected minion
        setAttrs({
            selectedMinionId: rowid,
            selectedMinion: values[`repeating_minions_${rowid}_title`],
            selectedMinionEffect: values[`repeating_minions_${rowid}_effect`]
        });
    });
});