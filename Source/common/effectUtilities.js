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
            .replaceAll(" ", "_")
            .trim().toLowerCase();
    };
    
    this.classify = function(effects) {
        var result = {
            effects: [],
            criticalThreshold: 20
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
                case "augment":
                    if (effect.specialType.trim().toLowerCase() == "aetherial focus") {
                        result.mpMaxIncrease = true;
                    }
                    break;
                case "critical(x)":
                    if (effect.value) {
                        result.criticalThreshold -= parseInt(effect.value);
                    }
                    break;
                case "damage":
                    if (result.damageRerolls) {
                        result.damageRerolls.push(effect.data.name);
                    } else {
                        result.damageRerolls = [effect.data.name];
                    }
                    break;
                case "ddown(x)":
                case "dps(x)":
                    if (result.dpsChanges) {
                        result.dpsChanges.push(effect);
                    } else {
                        result.dpsChanges = [effect];
                    }
                    log("dpsChanges: " + JSON.stringify(result.dpsChanges));
                    break;
                case "silence":
                    result.isSilenced = true;
                    break;
                case "stun":
                    result.isStunned = true;
                    break;
                default:
                    break;
            }
            if (effect.type == "special") {
                switch (effect.specialType.trim().toLowerCase()) {
                    case "astral fire":
                        result.astralFire = effect;
                        break;
                    case "hawk's eye":
                        result.hawksEye = effect;
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