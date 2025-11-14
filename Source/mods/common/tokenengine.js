/*build:remove*/
/*eslint no-unused-vars: "error"*/
const ModEngine = {}; const EffectCache = {}; const effectUtilities = {};
/*build:end*/

const TokenEngine = function(logger, token, character, cache) {
    if (!token) {
        logger.i("Token must be specified for token engine");
    }

    this.name = "TokenEngine";
    this.logger = logger;
    this.token = token;
    this.modengine = new ModEngine(logger, character);
    let convertedCache;
    if (cache instanceof EffectCache) {
        convertedCache = cache;
    } else {
        convertedCache = new EffectCache(cache);
    }
    this.effectCache = convertedCache.get(token);

    this.set = function(attributes) {
        for (let attribute of Object.entries(attributes)) {
            let name = attribute[0];
            let value = attribute[1];
            if (value === undefined || value === null) {
                this.logger.i("Undefined value encountered for " + name);
                continue;
            }
            let mappedName = this.mapAttribute(name);
            if (mappedName) {
                this.token.set(mappedName, value);
                this.logger.d("Set " + mappedName + " to " + value);
                continue;
            }

            let match = name.match(/^repeating_effects_([-\w]+)_([\w_]+)$/);
            if (match) {
                let id = match[1];
                let effectProperty = match[2];
                this.effectCache.set(id, effectProperty, value);
                this.logger.d("Cache " + name + " to " + value);
            } else {
                this.logger.i("Attempting to set non-token value " + name);
            }
        }
    };

    this.get = function(attributes, completion) {
        let filteredAttributes = this.filterAttributes(attributes, false);
        let tokenAdjustmentBlock = values => {
            var adjustedValues = values;
            for (let tokenAttribute of filteredAttributes.tokenAttributes) {
                adjustedValues[tokenAttribute.nameInRequest] = this.token.get(tokenAttribute.nameInToken);
            }
            completion(adjustedValues);
        };
        if (filteredAttributes.characterAttributes.length > 0) {
            this.modengine.get(filteredAttributes.characterAttributes, tokenAdjustmentBlock);
        } else {
            tokenAdjustmentBlock({});
        }
    };

    this.getAttrsAndEffects = function(attributes, completion) {
        let filteredAttributes = this.filterAttributes(attributes, true);
        let effects = this.effectCache.getEffects();
        this.modengine.get(filteredAttributes.characterAttributes, (values) => {
            var adjustedValues = values;
            for (let tokenAttribute of filteredAttributes.tokenAttributes) {
                adjustedValues[tokenAttribute.nameInRequest] = this.token.get(tokenAttribute.nameInToken);
            }

            completion(adjustedValues, effectUtilities.classify(effects));
        });
    };

    this.getSectionValues = function(sections, attributes, completion) {
        this.modengine.getSectionValues(sections, attributes, completion);
    };

    this.mapAttribute = function(name) {
        switch (name) {
            case "hitPoints":
                return "bar1_value";
            case "hitPoints_max":
                return "bar1_max";
            case "barrierPoints":
                return "bar2_value";
            case "barrierPoints_max":
                return "bar2_max";
            case "magicPoints":
                return "bar3_value";
            case "magicPoints_max":
                return "bar3_max";
        }
        return null;
    };

    this.filterAttributes = function(attributes, skipEffects=false) {
        return attributes.reduce(
            (result, currentValue) => {
                let mappedName = this.mapAttribute(currentValue);
                if (mappedName) {
                    result.tokenAttributes.push({ nameInRequest: currentValue, nameInToken: mappedName });
                    return result;
                }

                this.logger.d("Property " + JSON.stringify(currentValue));
                let match = currentValue.match(/^repeating_effects_([-\w]+)_([\w_]+)$/);
                if (match) {
                    if (skipEffects) {
                        return result;
                    }
                    let id = match[1];
                    let name = match[2];
                    if (!result.effects[id]) {
                        result.effects[id] = {};
                    }
                    result.effects[id][name] = this.effectCache[id][name];
                    this.logger.d("Add effect to attributes: " + id + ", " + name);
                    return result;
                }

                result.characterAttributes.push(currentValue);
                return result;
            },
            { tokenAttributes: [], characterAttributes: [], effects: {} }
        );
    };

    this.remove = function(object) {
        this.effectCache.remove(object.id);
    };

    this.generateId = function() {
        return this.modengine.generateId();
    };

    this.logi = function(value) {
        this.logger.i(value);
    };

    this.logd = function(value) {
        this.logger.d(value);
    };
};

this.export.TokenEngine = TokenEngine;