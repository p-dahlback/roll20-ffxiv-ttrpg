/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported rollTemplates*/
/*build:end*/

class RollTemplates {
    unpackValueWithTitle(title, value) {
        if (value) {
            return [title, value];
        }
        return ["", ""];
    }
}

const rollTemplates = new RollTemplates();