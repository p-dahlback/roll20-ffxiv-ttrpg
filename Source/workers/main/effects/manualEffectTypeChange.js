/*build:remove*/
/*eslint no-unused-vars: "error"*/
const engine = {};
const effectUtilities = {}; const removeEffects = {}; const addEffects = {}; const effectData = {};
/*build:end*/

const ManualEffectTypeChange = function() {
    this.resolve = function (eventInfo) {
        if (eventInfo.sourceType === "sheetworker") {
            return;
        }
        engine.logd(JSON.stringify(eventInfo));
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const rowId = sourceAttributes[2];

        let triggerName = eventInfo.triggerName.toLowerCase();
        let newValue = eventInfo.newValue.trim().toLowerCase();
        if (triggerName.includes("_specialtype") && newValue === "none") {
            // Reset
            var attributes = {};
            attributes[`repeating_effects_${rowId}_type`] = "";
            attributes[`repeating_effects_${rowId}_specialType`] = "";
            setAttrs(attributes);
            return;
        }

        if (triggerName.includes("_specialtype")) {
            this.resolveSpecialTypeChange(rowId, newValue);
        }

        let previousValue;
        if (eventInfo.previousValue) {
            previousValue = effectUtilities.searchableName(eventInfo.previousValue.trim());
        } else {
            previousValue = "";
        }
        getAttrs([
            `repeating_effects_${rowId}_type`,
            `repeating_effects_${rowId}_specialType`,
            `repeating_effects_${rowId}_value`,
            `repeating_effects_${rowId}_expiry`,
            `repeating_effects_${rowId}_description`,
            `repeating_effects_${rowId}_attribute`,
            `repeating_effects_${rowId}_attributeValue`
        ], values => {
            let type = values[`repeating_effects_${rowId}_type`];
            let specialType = values[`repeating_effects_${rowId}_specialType`];
            let adjustedName = effectUtilities.searchableName(specialType || type);
            this.resolveAttributes(rowId, adjustedName, previousValue, values);
            this.resolveEffects(rowId, adjustedName, previousValue);
        });
    };

    this.resolveEffects = function(rowId, name, previousName) {
        removeEffects.resetSpecialEffects(previousName);
        switch (name) {
            case "comatose":
            case "knocked_out":
                engine.getEffects(effects => {
                    log("Removing effects due to comatose/knocked out");
                    for (let effect of effects.effects) {
                        if (effect.type === "weak" || effect.type === "brink") {
                            continue;
                        }
                        if (effect.id === rowId || effect.expiry == "end" || effect.expiry == "permanent") {
                            continue;
                        }
                        removeEffects.remove(effect);
                    }
                    // Disable MP recovery for knocked out characters
                    setAttrs({
                        mpRecoveryBlock: "on"
                    });
                });
                break;
            case "transcendent": {
                engine.getEffects(effects => {
                    log("Clearing all enfeeblements");
                    for (let effect of effects.effects) {
                        if (effect.statusType.trim().toLowerCase() === "enfeeblement") {
                            log(`Clearing ${effect.data.name}`);
                            removeEffects.remove(effect);
                        }
                    }
                });
                break;
            }
        }
    };

    this.resolveSpecialTypeChange = function(rowId, newValue) {
        if (["astral fire", "umbral ice"].includes(newValue)) {
            log("Removing astral/umbral to ensure a single instance of " + newValue);
            // Remove Astral Fire and Umbral Ice excepting the current instance.
            // This ensures there's only one Astral Fire or Umbral Ice active at any point.
            removeEffects.removeAll(["astral fire", "umbral ice"], rowId);
            if (newValue === "umbral ice") {
                log("Resetting MP recovery in case of Astral Fire removal");
                setAttrs({
                    mpRecoveryBlock: "off"
                });
            } else {
                log("Disabling MP recovery due to Astral Fire");
                setAttrs({
                    mpRecoveryBlock: "on"
                });
            }
        } else if (["coeurl form", "opo-opo form", "raptor form"].includes(newValue)) {
            log("Removing Monk Forms to ensure a single form is active");
            // Remove all Monk Forms excepting the current instance.
            // This ensures there's only one Form active at any point.
            removeEffects.removeAll(["coeurl form", "opo-opo form", "raptor form"], rowId);
        } else if (["carbuncle", "ruby", "topaz", "emerald"].includes(newValue)) {
            log("Removing Gem effects to ensure a single gem is active");
            // Remove all Gem effects excepting the current instance.
            // This ensures there's only one Gem active at any point.
            removeEffects.removeAll(["carbuncle", "ruby", "topaz", "emerald"], rowId);
        } else {
            // Remove duplicates of special effects
            removeEffects.removeAll([newValue], rowId);

            switch (newValue) {
                case "lucid dreaming":
                    log("Incrementing MP recovery due to Lucid Dreaming");
                    setAttrs({
                        mpRecovery: 3
                    });
                    break;
            }
        }
    };

    this.resolveAttributes = function(rowId, name, oldName, values) {
        let value = values[`repeating_effects_${rowId}_value`];
        let data = effectData.effects[name];

        var attributes = {};
        if (data) {
            const iconUrl = effectData.icon(data);
            let expiry = data.expiry || values[`repeating_effects_${rowId}_expiry`];

            attributes[`repeating_effects_${rowId}_icon`] = iconUrl;
            attributes[`repeating_effects_${rowId}_name`] = effectData.hoverDescription(data.name, value, expiry, data.curable ? "on" : "off");
            attributes[`repeating_effects_${rowId}_statusType`] = data.statusType;
            attributes[`repeating_effects_${rowId}_description`] = data.description || values[`repeating_effects_${rowId}_description`];
            attributes[`repeating_effects_${rowId}_expiry`] = expiry;
            attributes[`repeating_effects_${rowId}_curable`] = data.curable ? "on" : "off";
        } else {
            attributes[`repeating_effects_${rowId}_icon`] = "";
        }

        addEffects.resolveAbilities(name, values[`repeating_effects_${rowId}_value`]);

        let attributeName = values[`repeating_effects_${rowId}_attribute`];
        let attributeValue = values[`repeating_effects_${rowId}_attributeValue`];
        if (attributeName) {
            attributes[`repeating_effects_${rowId}_attribute`] = "";
            attributes[`repeating_effects_${rowId}_attributeValue`] = "";
            removeEffects.resetAttributeChanges(oldName, attributeName, attributeValue, () => {
                addEffects.resolveAttributes(rowId, name, value);
            });
        } else {
            addEffects.resolveAttributes(rowId, name, value);
        }

        setAttrs(attributes);
    };
};

const manualEffectTypeChange = new ManualEffectTypeChange();
this.export.ManualEffectTypeChange = ManualEffectTypeChange;
this.export.manualEffectTypeChange = manualEffectTypeChange;