/*build:remove*/
/*eslint no-unused-vars: "error"*/
class AddEffects {}; class EffectState {}; const unpackNaN = {};
/*build:end*/

const EffectResolverState = function(hitPoints, hitPoints_max, barrierPoints, magicPoints, existingEffects, expiries) {
    this.hitPoints = hitPoints;
    this.hitPoints_max = hitPoints_max;
    this.barrierPoints = barrierPoints;
    this.magicPoints = magicPoints;
    this.existingEffects = existingEffects;
    this.expiries = expiries;

    this.effectState = function() {
        return new EffectState(
            this.hitPoints,
            this.hitPoints_max,
            this.barrierPoints,
            {},
            this.existingEffects
        );
    };
};

const EffectResolver = function(engine, removeEffects) {
    this.engine = engine;
    this.removeEffects = removeEffects;

    this.resolve = function(expiries, shouldUpdateExpiries, completion) {
        let attributes = ["hitPoints", "hitPoints_max", "barrierPoints", "magicPoints"];
        this.engine.getAttrsAndEffects(attributes, (values, effects) => {
            let state = new EffectResolverState(
                values.hitPoints,
                values.hitPoints_max,
                values.barrierPoints,
                values.magicPoints,
                effects,
                expiries
            );
            var summaries = [];
            for (let effect of effects.effects) {
                summaries.push(this.executeIfApplicable(state, effect));
                if (shouldUpdateExpiries) {
                    summaries.push(this.updateIfApplicable(effect));
                }
                summaries.push(this.removeIfApplicable(state, effect));
            }
            summaries = summaries.filter(summary => summary);
            completion(summaries.join(", "));
        });
    };

    this.executeIfApplicable = function(state, effect) {
        if (!this.isExecutable(effect, state.expiries)) {
            return "";
        }
        return this.executeEffect(state, effect);
    };
    
    this.removeIfApplicable = function(state, effect) {
        if (state.expiries.includes(effect.expiry)) {
            this.engine.logd("Slating effect for removal: " + effect.adjustedName);
            this.removeEffects.remove(effect);
            return `Expired <b>${effect.data.name}</b>`;
        }
        return "";
    };

    this.updateIfApplicable = function(effect) {
        if (effect.expiry !== "turn2") {
            return "";
        }
        var attributes = {};
        attributes[`${effect.fullId}_expiry`] = "turn";
        this.engine.set(attributes);
        return "";
    };
    
    this.executeEffect = function(state, effect) {
        switch (effect.adjustedName) {
            case "aetherial_focus": {
                this.engine.set({
                    magicPoints: Math.max(state.magicPoints_max + 1, 6)
                });
                return `Executed <b>Aetherial Focus</b>, giving 1 additional MP (6/5)`;
            }
            case "dot": {
                var damage = unpackNaN(effect.value);
                if (damage < 1) {
                    this.engine.logi("Unable to perform dot(x); no value given");
                    return [];
                }
                var barrierDefinition = "";
                let attributes = {};
                if (state.barrierPoints > 0) {
                    var newBarrierValue = state.barrierPoints - damage;
                    damage = -newBarrierValue;

                    newBarrierValue = Math.max(newBarrierValue, 0);
                    attributes.barrierPoints = newBarrierValue;
                    barrierDefinition = `${state.barrierValue} to ${newBarrierValue} Barrier`;
                }

                var hitPointDefinition = "";
                if (damage > 0) {
                    let newValue = Math.max(state.hitPoints - damage, 0);
                    attributes.hitPoints = newValue;
                    hitPointDefinition = `${state.hitPoints} to ${newValue}/${state.hitPoints_max} HP`;
                }
                this.engine.set(attributes);
                let changeSummary = [barrierDefinition, hitPointDefinition].filter(element => element).join(", ");
                return `Executed <b>DOT (${effect.value})</b> (${changeSummary})`;
            }
            case "improved_padding": {
                if (state.barrierPoints < 1) {
                    this.engine.set({
                        barrierPoints: 1,
                        barrierPoints_max: 1
                    });
                    return `Executed <b>Improved Padding</b> (1 Barrier)`;
                }
                return "";
            }
            case "lightweight_refit": {
                // Create effect to make the speed increase temporary
                let addEffects = new AddEffects(this.engine, this.removeEffects);
                let addState = state.effectState();
                addEffects.addBySpecificationString(addState, ["lightweight refit proc"]);

                return "Executed <b>Lightweight Refit</b>, +1 to speed until end of turn";
            }
            case "precision_opener": {
                // Create advantage die effect until end of turn
                let id = this.engine.generateId();
                let attributes = {};
                attributes[`repeating_effects_${id}_icon`] = "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/advantage.png";
                attributes[`repeating_effects_${id}_type`] = "advantage";
                attributes[`repeating_effects_${id}_expiry`] = "turn";
                attributes[`repeating_effects_${id}_editable`] = "off";
                this.engine.set(attributes);

                return "Executed <b>Precision Opener</b>, +1 advantage die on one ability roll (valid until end of turn)";
            }
            case "regen": {
                var healing = unpackNaN(state.value);
                if (healing < 1) {
                    this.engine.logi("Unable to perform regen(x); no value given");
                    return [];
                }
                let newValue = Math.min(state.hitPoints + healing, state.hitPoints_max);
                this.engine.set({
                    hitPoints: newValue
                });
                return `Executed <b>Regen (${state.value})</b> (${state.hitPoints} to ${newValue}/${state.hitPoints_max} HP)`;
            }
            default:
                return "";
        }
    };

    this.isExecutable = function(effect, expiries) {
        switch (effect.adjustedName) {
            case "aetherial_focus":
                return expiries.includes("encounterstart");
            case "dot":
                return expiries.includes("step");
            case "improved_padding":
                return expiries.includes("stepstart");
            case "lightweight_refit":
                return expiries.includes("encounterstart");
            case "precision_opener":
                return expiries.includes("encounterstart");
            case "regen":
                return expiries.includes("step");
            default:
                return false;
        }
    };
};

this.export.EffectResolverState = EffectResolverState;
this.export.EffectResolver = EffectResolver;