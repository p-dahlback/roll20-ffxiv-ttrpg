// Tabs
const buttonlist = ["character", "items", "abilities", "settings"];
buttonlist.forEach(button => {
    on(`clicked:${button}`, () => {
        setAttrs({
            sheetTab: button
        });
    });
});

// Initial setup
on("sheet:opened", () => {
    getAttrs([
        "d20",
        "advantage",
        "mpRecovery",
        "mpRecoveryBlock",
        "resourceRecovery",
        "resource2Recovery",
        "resource",
        "resource2"
    ], values => {
        setAttrs({
            d20: values.d20 ?? "1d20",
            advantage: values.advantage ?? 0,
            mpRecovery: values.mpRecovery ?? 2,
            mpRecoveryBlock: values.mpRecoveryBlock ?? "off",
            resourceRecovery: values.resourceRecovery ?? 0,
            resource2Recovery: values.resource2Recovery ?? 0,
            resource: values.resource ?? "",
            resource2: values.resource2 ?? "none"
        });
    });
});