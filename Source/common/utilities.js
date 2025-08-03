/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported Logger, unpackNaN*/
/*build:end*/

class Logger {
    constructor(scriptName, debug) {
        this.scriptName = scriptName;
        this.debug = debug;
    }

    d(string) {
        if (this.debug) {
            log(`${this.scriptName}: ${string}`);
        }
    }

    i(string) {
        log(`${this.scriptName}: ${string}`);
    }
}(true);

function unpackNaN(value, defaultValue = 0) {
    let intValue = parseInt(value);
    if (isNaN(intValue)) {
        return defaultValue;
    }
    return intValue;
};