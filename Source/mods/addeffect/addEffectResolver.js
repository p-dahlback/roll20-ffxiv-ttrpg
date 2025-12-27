
/*build:remove*/
/*eslint no-unused-vars: "error"*/
const unpackAttribute = {}; const ModEngine = {}; const TokenEngine = {};
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
                    let summary = addHandler.add(state, [effect]);
                    this.linkWithSourceEffectIfNeeded(character, engine, sheetType, effect);
                    summaries.push(`${summary} on <b>${character.get("name")}</b>`);
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
        let sourceCharacter = findObjs({ _type: "character", name: effect.source });
        if (!sourceCharacter) {
            return;
        }
        if (!effect.match) {
            return;
        }
        this.logger.d("Linking effect to source character");
        let id = sourceCharacter.get("id");
        var attributes = {};
        attributes[`${effect.fullId}_sourceId`] = id;
        attributes[`${effect.fullId}_sourceEffectId`] = effect.match;
        engine.set(attributes);

        this.linkEffectToSourceCharacter(character, sourceCharacter, sheetType, effect);
    };

    this.linkEffectToSourceCharacter = function(character, sourceCharacter, sheetType, effect) {
        this.logger.d("Linking source character back to effect");
        let sourceEffectId = effect.match;
        let targetId = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_targetId`);
        let targetEffectId = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_targetEffectId`);
        let targetType = unpackAttribute(sourceCharacter, `repeating_effects_${sourceEffectId}_targetType`);

        targetId.set("current", character.get("id"));
        targetEffectId.set("current", effect.id);
        targetType.set("current", sheetType);
    };
};

this.export.AddEffectResolver = AddEffectResolver;