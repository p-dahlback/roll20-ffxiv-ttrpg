/*build:remove */
const getEffects = {}; const manualEffectTypeChange = {}; const manualEffectValueChange = {}; const manualEffectRemoval = {};
const abilitySections = []; const statRoll = {}; const abilityRolls = {}; const abilityInfo = {}; const effectInfo = {};
const rest = []; const sheets = []; const sheetSetup = {};
/*build:end*/

// Automatic sheet assignment

on("change:job", () => {
    getAttrs(["level", "job"], values => {
        let job = values.job.toLowerCase();
        let level = values.level ?? 30;
        log(`Setting up ${job} sheet for level ${level}`);
        let levelSheets = sheets[`level${level}`];
        if (!levelSheets) {
            log(`No sheets found for level ${level}.`);
            return;
        }

        let sheet = levelSheets[job];
        if (!sheet) {
            log(`No sheet found for ${job} at level ${level}.`);
            return;
        }

        sheetSetup.execute(sheet);
    });
});

// MP Max
on("change:magicPoints", () => {
    getEffects.attrs(["magicPoints", "magicPoints_max"], (values, effects) => {
        var max = values.magicPoints_max;
        if (effects.mpMaxIncrease) {
            max += 1;
        }
        if (values.magicPoints <= max) {
            return;
        }
        log("Reset MP");
        setAttrs({
            magicPoints: values.magicPoints_max
        });
    });
});

// Stat rolls

on("clicked:rollStr", () => {
    statRoll.roll("strEffective", "Strength");
});

on("clicked:rollDex", () => {
    statRoll.roll("dexEffective", "Dexterity");
});

on("clicked:rollVit", () => {
    statRoll.roll("vitEffective", "Vitality");
});

on("clicked:rollInt", () => {
    statRoll.roll("intEffective", "Intelligence");
});

on("clicked:rollMnd", () => {
    statRoll.roll("mndEffective", "Mind");
});

// Ability rolls

for (let section of abilitySections) {
    on(`clicked:repeating_${section}:share`, eventInfo => {
        abilityInfo.share(eventInfo);
    });
    on(`clicked:repeating_${section}:trigger`, eventInfo => {
        abilityRolls.roll(eventInfo);
    });
    on(`clicked:repeating_${section}:rolldamage`, eventInfo => {
        abilityRolls.rollDamage(false, eventInfo);
    });
    on(`clicked:repeating_${section}:rolldamagewithbonus`, eventInfo => {
        abilityRolls.rollDamage(true, eventInfo);
    });
    for (let i = 0; i < 3; i++) {
        on(`clicked:repeating_${section}:runcombo${i + 1}`, eventInfo => {
            abilityRolls.activateCombo(eventInfo, i);
        });
    }
}

// Effects

on("clicked:repeating_effects:share", eventInfo => {
    effectInfo.share(eventInfo);
});

// Handle manual effect changes, since it could affect attributes and available abilities

on("change:repeating_effects:type change:repeating_effects:specialType", eventInfo => {
    manualEffectTypeChange.resolve(eventInfo);
});

on("change:repeating_effects:value", eventInfo => {
    manualEffectValueChange.resolve(eventInfo);
});

on("remove:repeating_effects", eventInfo => {
    manualEffectRemoval.resolve(eventInfo);
});

// Rest

on("clicked:rest", () => {
    rest.rest();
});

on("clicked:phase", () => {
    rest.phase();
});

on("clicked:end", () => {
    rest.end();
});
