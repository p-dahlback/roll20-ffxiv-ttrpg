/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported rollTemplates*/
/*build:end*/

const RollTemplates = function() {
    this.unpackValueWithTitle = function(title, value) {
        if (value) {
            return [title, value];
        }
        return ["", ""];
    };
};

const rollTemplates = new RollTemplates();
this.export.RollTemplates = RollTemplates;
this.export.rollTemplates = rollTemplates;