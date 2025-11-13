/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported turnOrder*/
const engine = {};
/*build:end*/

const TurnOrder = function() {

    this.apply = function() {
        engine.get([
            "turnOrder", "whisper"
        ], (values) => {
            let rollTemplate = `${values.whisper}&{template:roll} {{title=Turn Order}} {{roll=[[${values.turnOrder} &{tracker}]]}}`;
            engine.logd(`Rolling turn order ${rollTemplate}`);
            startRoll(rollTemplate, results => {
                finishRoll(results.rollId);
            });
        });
    };

    this.roll = function() {
        engine.get([
            "turnOrder", "whisper"
        ], (values) => {
            let rollTemplate = `${values.whisper}&{template:roll} {{title=Turn Order}} {{roll=[[d20 + ${values.turnOrder} &{tracker}]]}}`;
            engine.logd(`Rolling turn order ${rollTemplate}`);
            startRoll(rollTemplate, results => {
                finishRoll(results.rollId);
            });
        });
    };
};

const turnOrder = new TurnOrder();
this.export.TurnOrder = TurnOrder;
this.export.turnOrder = turnOrder;