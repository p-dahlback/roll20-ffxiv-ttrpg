/*build:remove*/
/*eslint no-unused-vars: "error"*/
const effectData = {};
/*build:end*/

const EffectUtilities = function() {
    
    this.searchableName = function(name) {
        if (!name) {
            return "";
        }
        return name
            .replaceAll(/(\([-|\s\w]+\))|(\[[-+><=\w]+\])|'/g, "")
            .replaceAll(/[ -]/g, "_")
            .trim().toLowerCase();
    };

    this.enrichEffect = function(effect) {
        let adjustedName = this.searchableName(effect.specialType || effect.type);
        if (adjustedName) {
            effect.adjustedName = adjustedName;
            effect.data = effectData.effects[adjustedName];
        }
        return effect;
    };

    this.isEffectOfType = function(effect, type) {
        let fullType = effect.type.toLowerCase();
        return fullType.includes(type.toLowerCase());
    };
    
    this.classify = function(effects) {
        var result = {
            effects: [],
            abilityAdvantages: [],
            damageRerolls: [],
            dpsChanges: [],
            expireOnHitRoll: [],
            expireOnPrimaryUse: [],
            expireOnSecondaryUse: [],
            notifyProcs: [],
            readyEffects: []
        };
        for (var effect of effects) {
            let adjustedName = this.searchableName(effect.specialType || effect.type);
            if (!adjustedName) {
                continue;
            }
            effect.adjustedName = adjustedName;
            effect.data = effectData.effects[adjustedName];
            result.effects.push(effect);

            switch (effect.data.maskedType || effect.type) {
                case "advantage":
                    result.abilityAdvantages.push(effect);
                    result.expireOnHitRoll.push(effect);
                    break;
                case "augment":
                    if (effect.specialType.trim().toLowerCase() == "aetherial focus") {
                        result.mpMaxIncrease = true;
                    }
                    break;
                case "brink":
                    result.isBrink = true;
                    break;
                case "critical(x)":
                    if (effect.value) {
                        result.criticalThreshold -= parseInt(effect.value);
                    }
                    break;
                case "ddown(x)":
                case "dps(x)":
                    result.dpsChanges.push(effect);
                    break;
                case "dreroll":
                    result.damageRerolls.push(effect.data.name);
                    break;
                case "gem":
                    result.gemEffect = effect;
                    break;
                case "ready(x)":
                    result.readyEffects.push(effect);
                    break;
                case "silence":
                    result.isSilenced = true;
                    break;
                case "stun":
                    result.isStunned = true;
                    break;
                case "weak":
                    result.isWeak = true;
                    break;
                default:
                    break;
            }
            if (effect.type == "special") {
                switch (effect.specialType.trim().toLowerCase()) {
                    case "astral fire":
                        result.astralFire = effect;
                        break;
                    case "coeurl form":
                    case "opo-opo form":
                    case "raptor form":
                        result.monkForm = effect;
                        break;
                    case "hawk's eye":
                        result.hawksEye = effect;
                        break;
                    case "hidden":
                        result.abilityAdvantages.push(effect);
                        result.expireOnPrimaryUse.push(effect);
                        result.expireOnSecondaryUse.push(effect);
                        break;
                    case "overheated":
                        result.notifyProcs.push("Overheated proc: Target the lowest CR");
                        break;
                    case "reassemble":
                        result.expireOnHitRoll.push(effect);
                        result.criticalThreshold = 0;
                        break;
                    case "surging tempest":
                        result.surgingTempest = effect;
                        break;
                    case "umbral ice":
                        result.umbralIce= effect;
                        break;
                    default:
                        break;
                }
            }
        }
        return result;
    };
};

const effectUtilities = new EffectUtilities();
this.export.EffectUtilities = EffectUtilities;
this.export.effectUtilities = effectUtilities;