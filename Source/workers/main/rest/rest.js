/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported rest*/
const performAbility = {}; const effectData = {}; const getEffects = {}; const removeEffects = {};
/*build:end*/

class Rest {
    constructor() {
        this.attributeList = [
            "hitPoints_max",
            "magicPoints_max",
            "resourceValue_max", "resourceReset"
        ];
        this.phaseAttributeList = [
            "resourceValue_max", "resourceReset"
        ];
    }

    rest() {
        log("Initiating rest");
        this.reset(this.attributeList, ["end", "permanent"], "rest");
    }

    phase() {
        log("Initiating phase reset");
        // Keep all effects except those that expire on phase change
        let expiries = Object.keys(effectData.expiries).filter(name => name !== "phase");
        this.reset(this.phaseAttributeList, expiries, "phase");
    }

    end() {
        log("Initiating end of adventure reset");
        this.reset(this.attributeList, ["permanent"], "end");
    }

    reset(attributes, exceptedEffectExpiries, resetType) {
        getEffects.attrs(attributes, (values, effects) => {
            log("Removing effects");
            for (let effect of effects.effects) {
                if (exceptedEffectExpiries.includes(effect.expiry)) {
                    continue;
                }
                removeEffects.remove(effect);
            }
            this.resetAttributes(attributes, values, resetType);
        });

        performAbility.resetAllUses();
    }

    resetAttributes(attributes, values, resetType) {
        log("Resetting HP/MP");
        var newAttributes = {};
        for (let attribute of attributes) {
            if (!attribute.includes("_max")) {
                continue
            }
            let baseAttribute = attribute.replace("_max", "");
            if (baseAttribute === "resourceValue") {
                // Some jobs start encounters/phases with full job resource
                if (resetType === "phase" && values.resourceReset !== "full") {
                    continue;
                }
                newAttributes.resourceValue = values.resourceReset === "full" ? values.resourceValue_max : 0;
            } else {
                log("Setting " + baseAttribute + " to " + attribute + ": " + values[attribute]);
                newAttributes[baseAttribute] = values[attribute];
            }
        }

        if (resetType !== "phase") {
            newAttributes.barrierPoints = 0;
            // No jobs start with full secondary reset
            newAttributes.resource2Value = 0;
        }

        setAttrs(newAttributes);
    }


    resetPhaseAttributes(values) {
        if (values.resourceReset != "full") {
            return;
        }
        log("Resetting job resource");
        setAttrs({
            resourceValue: values.resourceValue_max
        });
    }
}

const rest = new Rest();