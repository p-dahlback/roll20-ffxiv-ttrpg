// Advantage management

function addAdvantage(change) {
    getAttrs(["advantage"], values => {
        const advantage = Math.min(Math.max(values.advantage + change, -3), 3);
        let numberOfAdvantageDice = Math.abs(advantage);
        let numberOfDice = 1 + numberOfAdvantageDice;
        let keepMarker;
        if (advantage == 0) {
            keepMarker = "";
        } else if (advantage > 0) {
            keepMarker = "kh1";
        } else {
            keepMarker = "kl1";
        }
        setAttrs({
            advantage: advantage,
            d20: numberOfDice + "d20" + keepMarker
        });
    });
}

on("clicked:increaseAdvantage", () => {
    addAdvantage(1);
});

on("clicked:decreaseAdvantage", () => {
    addAdvantage(-1);
});

on("clicked:clearAdvantage", () => {
    setAttrs({
        advantage: 0,
        d20: "1d20"
    });
});

// HP Max
on("change:hitPoints", () => {
    getAttrs(["hitPoints", "hitPoints_max"], values => {
        if (values.hitPoints > values.hitPoints_max) {
            setAttrs({
                hitPoints: values.hitPoints_max
            });
        }
    });
});

// Resource Max
on("change:resourceValue", () => {
    getAttrs(["resourceValue", "resourceValue_max"], values => {
        if (values.resourceValue > values.resourceValue_max) {
            log("Reset resource");
            setAttrs({
                resourceValue: values.resourceValue_max
            });
        }
    });
});

// Effective attributes
on("change:str change:dex change:vit change:int change:mnd change:defense change:magicDefense change:vigilance change:speed", (eventInfo) => {
    log("Attribute changed: " + JSON.stringify(eventInfo));
    let attribute = eventInfo.sourceAttribute;
    let previousValue = parseInt(eventInfo.previousValue);
    if (isNaN(previousValue)) {
        previousValue = 0;
    }
    let newValue = parseInt(eventInfo.newValue);
    if (isNaN(newValue)) {
        newValue = 0;
    }
    let diff = newValue - previousValue;
    getAttrs([`${attribute}Effective`], values => {
        let existingValue = parseInt(values[`${attribute}Effective`]);
        var newAttributes = {};
        if (isNaN(existingValue)) {
            newAttributes[`${attribute}Effective`] = newValue;
        } else {
            newAttributes[`${attribute}Effective`] = existingValue + diff;
        }
        setAttrs(newAttributes);
    });
});
