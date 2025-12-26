/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported hitModifiers*/
/*build:end*/

const HitModifiers = function() {

    this.applyEffectModifiers = function(effects, rollMacro, rollType) {
        var penalty = 0;
        var hasParalysis = false;
        var criticalUp = 0;
        var attributeUp = {};
        var blindPenalty = 0;
        var hasHawksEye = false;
        for (let effect of effects.effects) {
            var effectName = effect.type;
            if (effect.type == "special") {
                effectName = effect.specialType.trim().toLowerCase();
            }
            switch (effectName) {
                case "blind":
                    blindPenalty = 2;
                    break;
                case "brink":
                    penalty += 5;
                    break;
                case "critical(x)":
                    if (effect.value) {
                        criticalUp += parseInt(effect.value);
                    }
                    break;
                case "hawk's eye":
                    hasHawksEye = true;
                    break;
                case "paralyzed":
                    if (rollType == "primary") {
                        hasParalysis = true;
                    }
                    break;
                case "petrified":
                    penalty += 5;
                    break;
                case "prone":
                    penalty += 2;
                    break;
                case "reassemble":
                    criticalUp += 99;
                    break;
                case "sleep":
                    penalty += 3;
                    break;
                case "slow":
                    penalty += 2;
                    break;
                case "stun":
                    penalty += 5;
                    break;
                case "weak":
                    penalty += 2;
                    break;
            }
        }
        var updatedMacro = rollMacro;
        if (hasParalysis) {
            updatedMacro = updatedMacro.replace(/cs>?20/, "cs>20cf<5[chance of paralysis]");
        }
        if (criticalUp > 0) {
            updatedMacro = updatedMacro.replace(/cs>?20/, `cs>${20 - Math.min(criticalUp, 19)}`);
        }
        if (!hasHawksEye) {
            // Hawk's Eye nullifies penalty from Blind
            penalty += blindPenalty;
        }
        if (penalty > 0) {
            updatedMacro = `${updatedMacro} - ${penalty}[penalty]`;
        }
        const matches = [...updatedMacro.matchAll(/@\{([a-z]{3})\}/g)];
        for (let match of matches) {
            const attributeName = match[1];
            const attributeValue = attributeUp[attributeName];
            if (!attributeValue) {
                continue;
            }
            updatedMacro = updatedMacro.replace(
                match[0],
                `${match[0]}[${attributeName.toUpperCase()}] + ${attributeUp[attributeName]}[${attributeName.toUpperCase()} bonus]`
            );
        }
        return updatedMacro;
    };

    this.applyAdvantage = function(advantage, abilityType, dice, effects) {
        if (effects.abilityAdvantages) {
            advantage += effects.abilityAdvantages.length;
        }
        if (effects.monkForm && abilityType.includes("Physical")) {
            advantage += 1;
        }
        if (advantage === 0) {
            return dice;
        }
        if (!dice.includes("d")) {
            return dice;
        }

        const highOrLow = advantage > 0 ? "kh" : "kl";
        const multiplier = Math.abs(advantage) + 1;

        var searchString = dice;
        var newDice = "";
        var index;
        while ((index = searchString.indexOf("d")) >= 0) {
            let numberOfDice;
            if (index == 0) {
                numberOfDice = 1;
                searchString = `1${searchString}`;
                index = 1;
            } else {
                newDice += searchString.substring(0, index - 1);
                numberOfDice = searchString.substring(index - 1, index);
            }
            const numberOfDiceWithMultiplier = numberOfDice * multiplier;

            // Find end of roll
            let match = /[-+* /)]/.exec(searchString.substring(index));
            if (match) {
                const matchIndex = match.index + index;
                newDice += `${numberOfDiceWithMultiplier}${searchString.substring(index, matchIndex)}${highOrLow}${numberOfDice}`;
                searchString = searchString.substring(matchIndex);
            } else {
                newDice += `${numberOfDiceWithMultiplier}${searchString.substring(index).trim()}${highOrLow}${numberOfDice}`;
                searchString = "";
                break;
            }
        }
        newDice += searchString;
        return newDice;
    };
};

const hitModifiers = new HitModifiers();
this.export.HitModifiers = HitModifiers;
this.export.hitModifiers = hitModifiers;