
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
                let name;
                let engine;
                if (sheetType === "unique") {
                    this.logger.d(`Using character engine for ${sheetType} token`);
                    name = character.get("name");
                    engine = new ModEngine(this.logger, character);
                } else if (token) {
                    this.logger.d(`Using token engine for ${sheetType} token`);
                    name = token.get("name");
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
                        let targetDefinition = {
                            token: token,
                            character: character,
                            name: name,
                            sheetType: sheetType,
                            engine: engine
                        };
                        this.linkWithSourceEffectIfNeeded(targetDefinition, effect);
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

    this.linkWithSourceEffectIfNeeded = function(targetDefinition, effect) {
        if (!effect.source || effect.source === "Self") {
            return;
        }
        let engine = targetDefinition.engine;
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
        attributes[`${effect.fullId}_linkedName`] = sourceCharacter.get("name");
        let sourceData = this.sourceEffectData(sourceEffectId, sourceCharacter);
        if (sourceData) {
            attributes[`${effect.fullId}_linkedEffectName`] = sourceData.name;
        } else {
            attributes[`${effect.fullId}_linkedEffectName`] = effect.data.name;
        }
        attributes[`${effect.fullId}_name`] = effectData.hoverDescription(
            effect.data.name, 
            effect.value, 
            effect.expiry ?? effect.data.expiry, 
            effect.curable,
            sourceCharacter.get("name")
        );

        engine.set(attributes);

        this.linkSourceToTargetCharacter(targetDefinition, sourceCharacter, sourceEffectId, effect);
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

    this.linkSourceToTargetCharacter = function(targetDefinition, sourceCharacter, sourceEffectId, effect) {
        this.logger.d("Linking source character back to effect");
        let linkedId = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedId`);
        let linkedEffectId = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedEffectId`);
        let linkedName = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedName`);
        let linkedType = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedType`);
        let linkedEffectName = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_linkedEffectName`);

        let type = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_type`).get("current");
        let specialType = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_specialType`).get("current");
        let expiry = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_expiry`).get("current");
        let value = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_value`).get("current");
        let curable = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_curable`).get("current");
        let hoverName = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_name`);

        if (targetDefinition.sheetType === "unique") {
            setAttribute(linkedId, "current", targetDefinition.character.get("id"));
        } else {
            setAttribute(linkedId, "current", targetDefinition.token.get("id"));
        }
        setAttribute(linkedEffectId, "current", effect.id);
        setAttribute(linkedName, "current", targetDefinition.name);
        setAttribute(linkedType, "current", targetDefinition.sheetType);
        setAttribute(linkedEffectName, "current", effect.data.name);

        let adjustedName = effectUtilities.searchableName(specialType || type);
        let data = effectData.effects[adjustedName];
        if (data) {
            setAttribute(hoverName, "current", effectData.hoverDescription(data.name, value, expiry, curable, targetDefinition.name));
        }
    };
};

this.export.AddEffectResolver = AddEffectResolver;