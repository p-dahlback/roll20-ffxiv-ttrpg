/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported rest*/
const engine = {};
const performAbility = {}; const effectData = {}; const removeEffects = {};
/*build:end*/

const Rest = function() {
    this.attributeList = [
        "hitPoints_max",
        "magicPoints_max",
        "resourceValue_max", "resourceReset"
    ];
    this.phaseAttributeList = [
        "resourceValue_max", "resourceReset"
    ];

    this.rest = function() {
        engine.logd("Initiating rest");
        this.reset(this.attributeList, ["end", "permanent"], "rest");
    };

    this.phase = function() {
        engine.logd("Initiating phase reset");
        // Keep all effects except those that expire on phase change
        let expiries = Object.keys(effectData.expiries).filter(name => name !== "phase");
        this.reset(this.phaseAttributeList, expiries, "phase");
    };

    this.end = function() {
        engine.logd("Initiating end of adventure reset");
        this.reset(this.attributeList, ["permanent"], "end");
    };

    this.reset = function(attributes, exceptedEffectExpiries, resetType) {
        engine.getAttrsAndEffects(attributes, (values, effects) => {
            engine.logd("Removing effects");
            for (let effect of effects.effects) {
                if (exceptedEffectExpiries.includes(effect.expiry)) {
                    continue;
                }
                removeEffects.remove(effect);
            }
            this.resetAttributes(attributes, values, resetType);
        });

        performAbility.resetAllUses();
    };

    this.resetAttributes = function(attributes, values, resetType) {
        engine.logd("Resetting HP/MP");
        var newAttributes = {};
        for (let attribute of attributes) {
            if (!attribute.includes("_max")) {
                continue;
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
    };
};

const rest = new Rest();
this.export.Rest = Rest;
this.export.rest = rest;