/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*build:end*/

const Logger = function(scriptName, debug) {

    this.scriptName = scriptName;
    this.debug = debug;

    this.d = (string) => {
        if (this.debug) {
            log(`${this.scriptName}: ${string}`);
        }
    };

    this.i = (string) => {
        log(`${this.scriptName}: ${string}`);
    };
};

const unpackNaN = function(value, defaultValue = 0) {
    let intValue = parseInt(value);
    if (isNaN(intValue)) {
        return defaultValue;
    }
    return intValue;
};

this.export.Logger = Logger;
this.export.unpackNaN = unpackNaN;