/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*build:end*/

const SheetAttributes = function() {

    this.misc = [
        "character_name", "character_race", "origin", "bonds",
        
        "turnOrder", "turnOrderStyle", "fortune", "whisper", "whisperExemptAbilities",

        "job", "jobIcon", "role", "level", "sheet_type", "team", "size", "override", "advantage",
            
        "selectedTitle", "selectedTitleEffect", "selectedMinion", "selectedMinionEffect",

        "songHeaderExpandItem", "primaryHeaderExpandItem", "ninjutsuHeaderExpandItem", "secondaryHeaderExpandItem", "instantHeaderExpandItem", "techniqueHeaderExpandItem"
    ];

    this.resources = [
        "hitPoints", "hitPoints_max", "magicPoints", "magicPoints_max", "barrierPoints", "barrierPoints_max",

        "resource", "resourceValue", "resourceValue_max", 
        "resource2", "resource2Value", "resource2Value_max", 
        "resource3", "resource3Value", "resource3Value_max", 
        "range1", "range1_max", "range2", "range2_max", "range3", "range3_max",
        "resourceReset", "hasBestial", "hasNadi", "hasOpo", "hasSecondaries", "hasInstants", "hasTechniques", "hasLimitBreak"
    ];

    this.main = [
        "str", "dex", "vit", "int", "mnd", "defense", "magicDefense", "vigilance", "speed"
    ];

    this.traits = [
        "title", "effect", "icon", "automatic", "editable"
    ];

    this.titles = [
        "title", "effect", "repeatingExpandItem"
    ];

    this.minions = [
        "title", "effect", "repeatingExpandItem"
    ];

    this.items = [
        "title", "effect", "count", "repeatingExpandItem"
    ];

    this.abilities = [
        "uses", "uses_max", "cost", "resource",

        "icon", "title", "type", "condition", "trigger", "target", "range", "check", "cr", "repeatingExpandItem",
        "baseEffect", "directHit", "effectName", "limitation", "effect", 

        "stat", "hitType", "damageType", "hitDie", "baseValue", "dhValue", "restore", "effectSelf", "effectTarget", "combo",

        "repeatingOverride"
    ];
};

const sheetAttributes = new SheetAttributes();
this.export.SheetAttributes = SheetAttributes;
this.export.sheetAttributes = sheetAttributes;