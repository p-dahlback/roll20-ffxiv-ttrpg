
/*build:remove*/
/*eslint no-unused-vars: "error"*/
const unpackAttribute = {}; const setAttribute = {}; const ModEngine = {}; const TokenEngine = {};
const effectUtilities = {}; const effectData = {};
const RemoveEffects = {}; const AddEffects = {}; const EffectState = {};
/*build:end*/

const AddEffectResolver = function(logger) {
    this.logger = logger;

    this.add = (effects, characters, effectCache) => {
        var summaries = [];

        this.logger.d(`Adding ${effects.length} effects to ${characters.length} character(s)`);
        for (let object of characters) {
            for (let effect of effects) {
                let character = object.character;
                let token = object.token;
                let sheetType = unpackAttribute(character, "sheet_type").get("current");
                let engine;
                if (sheetType === "unique") {
                    this.logger.d(`Using character engine for ${sheetType} token`);
                    engine = new ModEngine(this.logger, character);
                } else if (token) {
                    this.logger.d(`Using token engine for ${sheetType} token`);
                    engine = new TokenEngine(this.logger, token, character, effectCache);
                } else {
                    this.logger.i(`Will not add effect; character ${character.get("name")} isn't unique. Generic characters only support adding to selected token.`);
                }

                let removalHandler = new RemoveEffects(engine);
                let addHandler = new AddEffects(engine, removalHandler);
                engine.getAttrsAndEffects(["hitPoints", "barrierPoints"], (values, effects) => {
                    let state = new EffectState(
                        values.hitPoints, 
                        values.hitPoints_max, 
                        values.barrierPoints, 
                        null, 
                        effects
                    );
                    let result = addHandler.add(state, [effect]);
                    if (result.addedIds && result.addedIds.length > 0) {
                        effect.id = result.addedIds[0];
                        effect.fullId = `repeating_effects_${effect.id}`;
                        this.linkWithSourceEffectIfNeeded(character, engine, sheetType, effect);
                        summaries.push(`${result.summary} on <b>${character.get("name")}</b>`);
                    } else {
                        engine.logi("Failed to add effect " + JSON.stringify(effect));
                    }
                });
            }
        }
        let summary = summaries.join("</li><li>");
        if (summary) {
            summary = `<ul><li>${summary}</li></ul>`;
        }
        return summary;
    };

    this.linkWithSourceEffectIfNeeded = function(character, engine, sheetType, effect) {
        if (!effect.source || effect.source === "Self") {
            return;
        }
        if (!effect.fullId) {
            engine.logi("Missing effect id!");
            return;
        }
        let filteredCharacters = findObjs({ _type: "character", name: effect.source });
        if (!filteredCharacters || filteredCharacters.length < 1) {
            return;
        }
        let sourceCharacter = filteredCharacters[0];
        if (!effect.match || effect.match == "false") {
            return;
        }
        this.logger.d("Linking effect to source character");
        let id = sourceCharacter.get("id");
        var attributes = {};
        attributes[`${effect.fullId}_linkedId`] = id;
        let sourceEffectId;
        if (effect.match == "true") {
            sourceEffectId = unpackAttribute(sourceCharacter, "addedEffectId", "").get("current");
        } else {
            sourceEffectId = effect.match;
        }
        if (!sourceEffectId) {
            engine.logi("Missing source effect id!");
            return;
        }
        attributes[`${effect.fullId}_linkedEffectId`] = sourceEffectId;
        attributes[`${effect.fullId}_linkedType`] = unpackAttribute(sourceCharacter, "sheet_type").get("current");
        let sourceData = this.sourceEffectData(sourceEffectId, sourceCharacter);
        if (sourceData) {
            attributes[`${effect.fullId}_linkedName`] = sourceData.name;
        } else {
            attributes[`${effect.fullId}_linkedName`] = effect.data.name;
        }

        engine.set(attributes);

        this.linkSourceToTargetCharacter(character, sourceCharacter, sourceEffectId, sheetType, effect);
    };

    this.sourceEffectData = function(sourceEffectId, sourceCharacter) {
        let type = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_type`).get("current");
        let specialType = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_specialType`).get("current");
        if (!type && !specialType) {
            return null;
        }
        let adjustedName = effectUtilities.searchableName(specialType || type);
        return effectData.effects[adjustedName];
    };

    this.linkSourceToTargetCharacter = function(character, sourceCharacter, sourceEffectId, sheetType, effect) {
        this.logger.d("Linking source character back to effect");
        let linkedId = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedId`);
        let linkedEffectId = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedEffectId`);
        let linkedType = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedType`);
        let linkedName = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedName`);

        setAttribute(linkedId, "current", character.get("id"));
        setAttribute(linkedEffectId, "current", effect.id);
        setAttribute(linkedType, "current", sheetType);
        setAttribute(linkedName, "current", effect.data.name);
    };
};

this.export.AddEffectResolver = AddEffectResolver;