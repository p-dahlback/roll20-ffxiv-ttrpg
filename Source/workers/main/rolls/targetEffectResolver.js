/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported abilityRolls*/
const engine = {};
const effectData = {}; const effectUtilities = {};
/*build:end*/

const TargetEffects = function(source) {
    let match  = source.match(/^(?:([-'\s\w]+):)?((?:[-'\s\w()]+,)*)([-'\s\w()]+)$/);
    if (match && match.length > 1) {
        this.name = match[1];
    } else {
        this.name = null;
        this.effects = [];
        return;
    }

    this.effects = [];
    if (match.length > 2 && match[2]) {
        let commaSeparatedEffects = match[2].slice(0, -1);
        this.effects = this.effects.concat(commaSeparatedEffects.split(",").map(value => value.trim()));
    }
    if (match.length > 3 && match[3]) {
        this.effects = this.effects.concat(match[3].trim());
    }
};

const TargetEffectResolver = function() {

    this.getButton = function(effects, characterName) {
        let targetEffects = new TargetEffects(effects);
        if (targetEffects.effects.length === 0) {
            return {
                button: "",
                hasLink: false,
                title: ""
            };
        }
        var effectDefinitions = [];

        engine.logd("Preparing target effects: " + JSON.stringify(targetEffects));
        let initialName = "";
        let hasLink = false;
        let linkDefinition = "";
        for (let effect of targetEffects.effects) {
            let adjustedEffect = effectUtilities.searchableName(effect.trim());
            let data = effectData.effects[adjustedEffect];
            if (!data) {
                engine.logi("Unhandled effect " + adjustedEffect);
                continue;
            }

            if (data.expiry === "sourceStart") {
                hasLink = true;
                linkDefinition = "--match true";
            }

            var value = "";
            let match = effect.match(/\(([-|\s\w]+)\)/);
            if (match && match.length >= 2) {
                value = match[1];
            }

            if (!initialName) {
                initialName = data.name.replace("(X)", `(${value})`);
            }
            let valueDefinition = value ? `[${value}]` : "";
            let effectName = (data.specialType || data.type).replace(/\([Xx]{1}\)/, "");
            let effectDefinition = `${effectName}${valueDefinition}`;
            effectDefinitions.push(effectDefinition);
        }
        return {
            button: `[${targetEffects.name || initialName}](!ffe --${effectDefinitions.join(",")} --source ${characterName} ${linkDefinition} --edit ${0})`,
            hasLink: hasLink,
            title: "Effect"
        };
    };
};

const targetEffectResolver = new TargetEffectResolver();
this.export.TargetEffectResolver = TargetEffectResolver;
this.export.targetEffectResolver = targetEffectResolver;