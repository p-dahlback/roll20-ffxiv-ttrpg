/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported statRoll*/
const engine = {}; const rollModifiers = {};
/*build:end*/

const StatRoll = function() {

    this.roll = function(stat, statName) {
        engine.getAttrsAndEffects([
            "d20"
        ], (values, effects) => {
            var roll = `${values.d20} + @{${stat}}`;
            roll = rollModifiers.addEffectsToHitRoll(effects, roll, "stat");

            engine.logd(`Rolling stat &{template:roll} {{title=${statName}}} {{roll=[[${roll}]]}}`);
            startRoll(`&{template:roll} {{title=${statName}}} {{roll=[[${roll}]]}}`, results => {
                const rollResult = results.results.roll.result;
                finishRoll(results.rollId, {
                    roll: Math.max(rollResult, 0)
                });
            });
        });
    };
};

const statRoll = new StatRoll();
this.export.StatRoll = StatRoll;
this.export.statRoll = statRoll;