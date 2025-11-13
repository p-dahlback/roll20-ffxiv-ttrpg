/*build:remove */
const mainImports = {};
/*build:end*/

// Automatic sheet assignment
const imports = mainImports.export;

on("change:job", () => {
    getAttrs(["level", "job"], values => {
        let job = values.job.toLowerCase();
        let sheet = imports.sheets[job];
        if (!sheet) {
            let level = values.level ?? 30;
            log(`Setting up ${job} sheet for level ${level}`);
            let levelSheets = imports.sheets[`level${level}`];
            if (!levelSheets) {
                log(`No sheets found for level ${level}.`);
                return;
            }

            sheet = levelSheets[job];
            if (!sheet) {
                log(`No sheet found for ${job} at level ${level}.`);
                return;
            }
        }
        imports.sheetSetup.execute(sheet);
    });
});

on("change:team", () => {
    getAttrs(["team"], values => {
        if (values.team === "enemy") {
            // By default enemies add themselves to turn order by random roll
            setAttrs({
                turnOrderStyle: "roll"
            });
        }
    });
});

// MP Max
on("change:magicPoints", () => {
    imports.engine.getAttrsAndEffects(["magicPoints", "magicPoints_max"], (values, effects) => {
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
    imports.statRoll.roll("strEffective", "Strength");
});

on("clicked:rollDex", () => {
    imports.statRoll.roll("dexEffective", "Dexterity");
});

on("clicked:rollVit", () => {
    imports.statRoll.roll("vitEffective", "Vitality");
});

on("clicked:rollInt", () => {
    imports.statRoll.roll("intEffective", "Intelligence");
});

on("clicked:rollMnd", () => {
    imports.statRoll.roll("mndEffective", "Mind");
});

on("clicked:applyTurnOrder", () => {
    imports.turnOrder.apply();
});

on("clicked:rollTurnOrder", () => {
    imports.turnOrder.roll();
});

// Ability rolls

for (let section of imports.abilitySections) {
    on(`clicked:repeating_${section}:share`, eventInfo => {
        imports.abilityInfo.share(eventInfo);
    });
    on(`clicked:repeating_${section}:trigger`, eventInfo => {
        imports.abilityRolls.roll(eventInfo);
    });
    on(`clicked:repeating_${section}:rolldamage`, eventInfo => {
        imports.abilityRolls.rollDamage(false, eventInfo);
    });
    on(`clicked:repeating_${section}:rolldamagewithbonus`, eventInfo => {
        imports.abilityRolls.rollDamage(true, eventInfo);
    });
    for (let i = 0; i < 3; i++) {
        on(`clicked:repeating_${section}:runcombo${i + 1}`, eventInfo => {
            imports.abilityRolls.activateCombo(eventInfo, i);
        });
    }
}

// Effects

on("clicked:repeating_effects:share", eventInfo => {
    imports.effectInfo.share(eventInfo);
});

// Handle manual effect changes, since it could affect attributes and available abilities

on("change:repeating_effects:type change:repeating_effects:specialType", eventInfo => {
    imports.manualEffectTypeChange.resolve(eventInfo);
});

on("change:repeating_effects:value", eventInfo => {
    imports.manualEffectValueChange.resolve(eventInfo);
});

on("change:repeating_effects:curable", eventInfo => {
    imports.manualEffectCurableChange.resolve(eventInfo);
});

on("remove:repeating_effects", eventInfo => {
    imports.manualEffectRemoval.resolve(eventInfo);
});

// Rest

on("clicked:rest", () => {
    imports.rest.rest();
});

on("clicked:phase", () => {
    imports.rest.phase();
});

on("clicked:end", () => {
    imports.rest.end();
});
