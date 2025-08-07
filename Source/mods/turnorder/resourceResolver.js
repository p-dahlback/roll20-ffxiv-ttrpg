/*build:remove*/
/*eslint no-unused-vars: "error"*/
const unpackAttribute = {}; const unpackNaN = {}; const setAttribute = {};
/*build:end*/

const ResourceResolver = function(logger) {
    this.logger = logger;

    this.recoverResource = function(character, resource) {
        let sheetType = unpackAttribute(character, "sheet_type").get("current");
        if (sheetType !== "unique") {
            return;
        }

        let resourceName = unpackAttribute(character, resource).get("current");
        if (!resourceName || resourceName.trim().toLowerCase() === "none") {
            return;
        }

        this.logger.d(`Recovering resource ${resourceName}`);
        let resourceObject = unpackAttribute(character, `${resourceName}Value`, 0);
        let recoveryValue = unpackAttribute(character, `${resource}Recovery`, 0).get("current");
        if (recoveryValue <= 0) {
            this.logger.d("No recovery");
            return;
        }
        let currentValue = resourceObject.get("current");
        let max = unpackNaN(resourceObject.get("max"));
        if (max <= 0) {
            this.logger.d("Max is zero; cancelling recovery");
            return;
        }

        let updatedValue = Math.min(currentValue + recoveryValue, max);

        resourceObject.set("current", updatedValue);

        let summary = `Recovered ${recoveryValue} ${resourceName} (${currentValue} -> ${updatedValue}/${max})`;
        this.logger.d(summary);
        return summary;
    };

    this.recoverMp = function(token, character) {
        let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off").get("current");
        if (mpRecoveryBlock == "on") {
            this.logger.d("MP recovery is blocked");
            return;
        }
        let mpRecoveryValue = unpackAttribute(character, "mpRecovery", 2).get("current");
        if (mpRecoveryValue <= 0) {
            this.logger.d("No recovery");
            return;
        }
        let currentMp = unpackNaN(token.get("bar3_value"));
        let maxMp = unpackNaN(token.get("bar3_max"));
        if (maxMp <= 0) {
            return this.recoverCharacterMp(character, mpRecoveryBlock);
        }
        return this.recoverTokenMp(token, currentMp, maxMp, mpRecoveryValue);
    };

    this.recoverTokenMp = function(token, currentMp, maxMp, mpRecoveryValue) {
        if (currentMp >= maxMp) {
            this.logger.d("MP is maxed out; cancelling recovery");
            return;
        }
        let updatedMp = Math.min(currentMp + mpRecoveryValue, maxMp);

        token.set("bar3_value", updatedMp);

        let summary = `Recovered ${mpRecoveryValue} MP (${currentMp} -> ${updatedMp}/${maxMp})`;
        this.logger.d(summary);
        return summary;
    };

    this.recoverCharacterMp = function(character, mpRecoveryValue) {
        let mpObject = unpackAttribute(character, "magicPoints", 0);
        let currentMp = mpObject.get("current");
        let maxMp = unpackNaN(mpObject.get("max"));
        if (maxMp <= 0) {
            this.logger.d("Max is zero; cancelling recovery");
            return;
        }
        if (currentMp >= maxMp) {
            this.logger.d("MP is maxed out; cancelling recovery");
            return;
        }
        let updatedMp = Math.min(currentMp + mpRecoveryValue, maxMp);

        setAttribute(mpObject, "current", updatedMp);

        let summary = `Recovered ${mpRecoveryValue} MP (${currentMp} -> ${updatedMp}/${maxMp})`;
        this.logger.d(summary);
        return summary;
    };
};

this.export.ResourceResolver = ResourceResolver;