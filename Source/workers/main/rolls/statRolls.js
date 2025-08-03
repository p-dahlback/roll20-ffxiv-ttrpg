/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported statRoll*/
const getEffects = {}; const rollModifiers = {};
/*build:end*/

class StatRoll {

    roll(stat, statName) {
        getEffects.attrs([
            "d20"
        ], (values, effects) => {
            var roll = `${values.d20} + @{${stat}}`;
            roll = rollModifiers.addEffectsToHitRoll(effects, roll, "stat");

            log(`Rolling stat &{template:roll} {{title=${statName}}} {{roll=[[${roll}]]}}`);
            startRoll(`&{template:roll} {{title=${statName}}} {{roll=[[${roll}]]}}`, results => {
                const rollResult = results.results.roll.result;
                finishRoll(results.rollId, {
                    roll: Math.max(rollResult, 0)
                });
            });
        });
    }
}

const statRoll = new StatRoll();