/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported abilityRolls*/
const engine = {};
const effectData = {}; const effectUtilities = {}; const addEffects = {}; const removeEffects = {}; const AbilityId = {};
const rollModifiers = {}; const rollTemplates = {}; const performAbility = {};
const EffectState = {};
/*build:end*/

const TargetEffects = function(source) {
    let match  = source.match(/^(?:([-'\s\w]+):)?((?:[-'\s\w()]+,)*)([-'\s\w()]+)$/);
    if (match && match.length > 1) {
        this.name = match[1];
    } else {
        this.name = null;
        this.effects = [];
        return;
    }

    this.effects = [];
    if (match.length > 2 && match[2]) {
        let commaSeparatedEffects = match[2].slice(0, -1);
        this.effects = this.effects.concat(commaSeparatedEffects.split(",").map(value => value.trim()));
    }
    if (match.length > 3 && match[3]) {
        this.effects = this.effects.concat(match[3].trim());
    }
};

const DamageRoll = function({
    title, type, damageType, baseRoll, directHitRoll="", hitRoll="", condition="", combos="", cost=0, resource="", 
    selfEffects="", targetEffects="", restoration="", useRollBonus=false, whisperPrefix=""
}) {

    this.title = title;
    this.type = type;
    this.damageType = damageType;
    this.baseRoll = baseRoll;
    this.directHitRoll = directHitRoll;
    this.hitRoll = hitRoll;
    this.condition = condition;
    this.combos = combos;
    this.comboTitle = combos ? "Combo" : "";
    this.cost = parseInt(cost);
    this.resource = resource;
    this.selfEffects = selfEffects;
    this.targetEffects = targetEffects;
    this.restoration =restoration;
    this.useRollBonus = useRollBonus;
    this.whisperPrefix = whisperPrefix;

    this.baseEffectTitle = function() {
        return this.baseRoll ? `${this.damageType}: ` : "";
    };

    this.baseEffectDice = function() {
        return this.baseRoll ? `[[${this.baseRoll}]]` : "";
    };
    
    this.directHitTitle = function() {
        return this.directHitRoll ? "Direct Hit: " : "";
    };

    this.directHitDice = function() {
        return this.directHitRoll ? `[[${this.directHitRoll}]]` : "";
    };

    this.totalTitle = function() {
        return this.baseRoll && this.directHitRoll ? `Full ${this.damageType}: ` : "";
    };
};

const damageAbilityAttributes = function(section, rowId) {
    return [
        `repeating_${section}_${rowId}_title`,
        `repeating_${section}_${rowId}_type`,
        `repeating_${section}_${rowId}_damageType`,
        `repeating_${section}_${rowId}_baseValue`,
        `repeating_${section}_${rowId}_dhValue`,
        `repeating_${section}_${rowId}_combo`,
        `repeating_${section}_${rowId}_currentRoll`,

        `repeating_${section}_${rowId}_cost`,
        `repeating_${section}_${rowId}_uses`,
        `repeating_${section}_${rowId}_uses_max`,
        `repeating_${section}_${rowId}_restore`,
        `repeating_${section}_${rowId}_resource`,

        `repeating_${section}_${rowId}_effectSelf`,
        `repeating_${section}_${rowId}_effectTarget`,
        `repeating_${section}_${rowId}_condition`
    ];
};
const damageCharacterAttributes = [
    "level", "barrierPoints",
    "hitPoints", "hitPoints_max",
    "magicPoints", "magicPoints_max",
    "resource", "resourceValue", "resourceValue_max",
    "resource2", "resource2Value", "resource2Value_max",
    "resource3", "resource3Value", "resource3Value_max",
    "range1", "range1_max", "range2", "range2_max", "range3", "range3_max",

    "speedEffective", "speedBlock", "speedUnblocked", "speedOriginal",

    "character_name", "sheet_type",

    "whisper", "whisperExemptAbilities"
];

const AbilityRolls = function() {

    // Roll ability
    this.roll = function(eventInfo) {
        engine.logd("Activate ability " + JSON.stringify(eventInfo));
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];

        engine.getAttrsAndEffects([
            `repeating_${section}_${rowId}_icon`,
            `repeating_${section}_${rowId}_title`,
            `repeating_${section}_${rowId}_type`,
            `repeating_${section}_${rowId}_cost`,
            `repeating_${section}_${rowId}_resource`,
            `repeating_${section}_${rowId}_condition`,
            `repeating_${section}_${rowId}_trigger`,
            `repeating_${section}_${rowId}_uses`,
            `repeating_${section}_${rowId}_uses_max`,

            `repeating_${section}_${rowId}_target`,
            `repeating_${section}_${rowId}_range`,

            `repeating_${section}_${rowId}_baseEffect`,
            `repeating_${section}_${rowId}_directHit`,

            `repeating_${section}_${rowId}_effectName`,
            `repeating_${section}_${rowId}_effect`,
            `repeating_${section}_${rowId}_effectSelf`,
            `repeating_${section}_${rowId}_effectTarget`,

            `repeating_${section}_${rowId}_stat`,
            `repeating_${section}_${rowId}_damageType`,
            `repeating_${section}_${rowId}_hitType`,
            `repeating_${section}_${rowId}_hitDie`,
            `repeating_${section}_${rowId}_baseValue`,
            `repeating_${section}_${rowId}_cr`,
            `repeating_${section}_${rowId}_restore`,
            `repeating_${section}_${rowId}_combo`,

            "strDisplay", "dexDisplay", "vitDisplay", "intDisplay", "mndDisplay",
            "magicPoints", "magicPoints_max", "resourceValue", "resourceValue_max",
            "advantage", "character_name",

            "whisper", "whisperExemptAbilities"
        ], (values, effects) => {
            // Perform roll
            const title = values[`repeating_${section}_${rowId}_title`];
            const icon = values[`repeating_${section}_${rowId}_icon`];
            const usesMax = values[`repeating_${section}_${rowId}_uses_max`];

            const cost = values[`repeating_${section}_${rowId}_cost`];

            const statType = values[`repeating_${section}_${rowId}_stat`].toLowerCase();
            const damageType = values[`repeating_${section}_${rowId}_damageType`];
            const hitType = values[`repeating_${section}_${rowId}_hitType`];
            const restoration = values[`repeating_${section}_${rowId}_restore`];
            const statValue = values[`${statType}Display`];
            const baseEffect = values[`repeating_${section}_${rowId}_baseEffect`];
            const baseValue = values[`repeating_${section}_${rowId}_baseValue`];
            const directHit = values[`repeating_${section}_${rowId}_directHit`];
            const effectName = values[`repeating_${section}_${rowId}_effectName`];
            const effect = values[`repeating_${section}_${rowId}_effect`];
            const effectSelf = values[`repeating_${section}_${rowId}_effectSelf`];
            const effectTarget = values[`repeating_${section}_${rowId}_effectTarget`];

            const combo = values[`repeating_${section}_${rowId}_combo`];
            const crString = this.stringWithTitle("CR:", values[`repeating_${section}_${rowId}_cr`]);
            const typeString = this.stringWithTitle("Type:", values[`repeating_${section}_${rowId}_type`]);
            const condition = rollTemplates.unpackValueWithTitle("Condition:", values[`repeating_${section}_${rowId}_condition`]);
            const triggerString = this.stringWithTitle("Trigger:", values[`repeating_${section}_${rowId}_trigger`]);

            var hitDie = values[`repeating_${section}_${rowId}_hitDie`];
            hitDie = rollModifiers.applyAdvantage(values.advantage, hitDie);

            var hitTitle = "";
            var hitDefinition = "";
            var button = "";

            if (effects.isStunned) {
                button = "Abilities cannot be used when stunned!";
            } else if (effects.isSilenced && typeString.toLowerCase().includes("invoked")) {
                button = "Invoked ability cannot be used when silenced!";
            } else if (hitDie || baseValue) {
                var bonusButton = "";
                if (hitType != "None" && hitDie) {
                    hitTitle = `${hitType}: `;
                    if (statValue > 0) {
                        hitDie = `${hitDie} + @{${statType}Display}`;
                    }
                    hitDie = rollModifiers.addEffectsToHitRoll(effects, hitDie, section);
                    hitDefinition = `[[${hitDie}]]`;

                    // Option to improve the hit roll
                    if (effects.effects.some((effect) => effect.type == "roll(x)")) {
                        bonusButton = ` [${damageType} + Roll Up(X)](~${values.character_name}|repeating_${section}_${rowId}_rolldamagewithbonus)`;
                    }
                }
                button = `[${damageType}](~${values.character_name}|repeating_${section}_${rowId}_rolldamage)${bonusButton}`;
            } else if (cost > 0 || usesMax > 0 || restoration || combo || effectSelf || effectTarget) {
                button = `[Effect](~${values.character_name}|repeating_${section}_${rowId}_rolldamage)`;
            }

            var directHitTitle = "";
            if (directHit) {
                directHitTitle = "Direct Hit:";
            }

            var attributes = {};
            attributes[`repeating_${section}_${rowId}_currentRoll`] = "";
            setAttrs(attributes);

            let whisper = values.whisper;
            if (values.whisper && values.whisperExemptAbilities === "on") {
                whisper = "";
            }
            let rollTemplate = `${whisper}&{template:hit} {{icon=[icon](${icon})}} {{name=${title}}} ` +
                `{{type=${typeString}}} {{conditionTitle=${condition[0]}}} {{condition=${condition[1]}}} {{trigger=${triggerString}}} ` +
                `{{hitTitle=${hitTitle}}} {{hit=${hitDefinition}}} {{cr=${crString}}} {{baseEffect=${baseEffect}}} ` +
                `{{directHitTitle=${directHitTitle}}} {{directHit=${directHit}}} {{effectTitle=${effectName}}} {{effect=${effect}}}` +
                `{{button=${button}}}`;
            engine.logd(rollTemplate);
            startRoll(rollTemplate, results => {
                var hitRoll = results.results.hit;
                if (!hitRoll) {
                    hitRoll = {
                        result: undefined,
                        dice: undefined,
                        expression: undefined
                    };
                }
                const hitValue = hitRoll.result;
                var computedValue = hitValue;
                if (hitRoll.dice) {
                    var die;
                    if (hitRoll.expression.includes("kl")) {
                        die = Math.min(...hitRoll.dice);
                    }
                    else {
                        die = Math.max(...hitRoll.dice);
                    }
                    attributes[`repeating_${section}_${rowId}_currentRoll`] = die;
                }
                if (hitValue && parseInt(computedValue) < 0) {
                    computedValue = 0;
                }

                setAttrs(attributes);

                finishRoll(results.rollId, {
                    hit: computedValue
                });
            });
        });
    };

    this.rollDamage = function(useRollBonus, eventInfo) {
        engine.logd("Roll damage " + JSON.stringify(eventInfo));
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];
        let attributes = damageAbilityAttributes(section, rowId).concat(damageCharacterAttributes);
        engine.getAttrsAndEffects(attributes, (values, effects) => {
            let damageRoll = new DamageRoll({
                title: values[`repeating_${section}_${rowId}_title`],
                type: values[`repeating_${section}_${rowId}_type`],
                damageType: values[`repeating_${section}_${rowId}_damageType`],
                baseRoll: values[`repeating_${section}_${rowId}_baseValue`],
                directHitRoll: values[`repeating_${section}_${rowId}_dhValue`],
                hitRoll: parseInt(values[`repeating_${section}_${rowId}_currentRoll`]),
                condition: values[`repeating_${section}_${rowId}_condition`],
                combos: values[`repeating_${section}_${rowId}_combo`],
                cost: values[`repeating_${section}_${rowId}_cost`],
                resource: values[`repeating_${section}_${rowId}_resource`],
                selfEffects: values[`repeating_${section}_${rowId}_effectSelf`],
                targetEffects: values[`repeating_${section}_${rowId}_effectTarget`],
                restoration: values[`repeating_${section}_${rowId}_restore`],
                useRollBonus: useRollBonus,
                whisperPrefix: values.whisperExemptAbilities === "on" ? "" : values.whisper
            });
            let abilityId = new AbilityId(section, rowId);
            this.performDamageRoll(damageRoll, abilityId, values, effects);
        });
    };

    this.performDamageRoll = function(damageRoll, abilityId=null, values, effects) {
        let modifiedRoll = rollModifiers.applyCriticalMultiplierIfNeeded(damageRoll, effects);
        let summariedRoll = rollModifiers.applyEffectModifiersToDamageRolls(modifiedRoll, values.level, effects);
        let modifierSummaries = summariedRoll.summaries;
        modifiedRoll = summariedRoll.damageRoll;

        const comboButtons = performAbility.resolveAvailableCombos(modifiedRoll.combos, abilityId, values);
        const comboTitle = comboButtons ? "Combo" : "";

        const resourceCost = performAbility.resolveResources(modifiedRoll, abilityId, values, effects);
        const hasDamage = modifiedRoll.baseRoll || modifiedRoll.directHitRoll;
        const hasEffects = modifiedRoll.selfEffects || modifiedRoll.targetEffects;
        if (!hasDamage && !hasEffects && !resourceCost && !comboButtons) {
            engine.logd("No reason to roll damage");
            return;
        }

        var targetEffectTitle = "";
        let targetEffectButton = "";
        if (modifiedRoll.targetEffects) {
            let calculatedEffects = new TargetEffects(modifiedRoll.targetEffects);
            targetEffectButton = this.buttonForTargetEffects(calculatedEffects, values.character_name);
            if (targetEffectButton) {
                targetEffectTitle = "Effect";
            }
        }

        // Roll damage
        let rollTemplate = `${modifiedRoll.whisperPrefix}&{template:damage} {{title=${modifiedRoll.title}}} ` + 
            `{{damageTitle=${modifiedRoll.baseEffectTitle()}}} {{damage=${modifiedRoll.baseEffectDice()}}} ` +
            `{{directHitTitle=${modifiedRoll.directHitTitle()}}} {{directHit=${modifiedRoll.directHitDice()}}} ` +
            `{{totalTitle=${modifiedRoll.totalTitle()}}} {{total=[[0]]}}` +
            `{{comboTitle=${comboTitle}}} {{button=${comboButtons}}} {{cost=${resourceCost}}} {{proc=[[0]]}} ` +
            `{{targetEffectTitle=${targetEffectTitle}}} {{targetEffects=${targetEffectButton}}}`;
        engine.logd(rollTemplate);
        startRoll(rollTemplate, results => {
            const damageRoll = results.results.damage ?? { result: 0, dice: [], expression: "" };
            const directHitRoll = results.results.directHit ?? { result: 0, dice: [], expression: "" };

            let computedResults = rollModifiers.applyEffectModifiersAfterDamageRolls(effects, modifiedRoll.damageType, [damageRoll, directHitRoll]);
            let consumedEffectSummary = removeEffects.consumeOnAbility(modifiedRoll.title, modifiedRoll.condition, effects);

            let state = new EffectState(
                values.hitPoints, 
                values.hitPoints_max, 
                values.barrierPoints, 
                {
                    hit: modifiedRoll.hitRoll,
                    damage: damageRoll,
                    directHit: directHitRoll
                }, 
                effects
            );
            let effectSummary = addEffects.addBySpecificationString(state, modifiedRoll.selfEffects.split(","));
            let fullSummary = modifierSummaries.concat([computedResults.summary, consumedEffectSummary, effectSummary]).filter(element => element).join(", ");

            if (abilityId) {
                var attributes = {};
                attributes[`repeating_${abilityId.section}_${abilityId.rowId}_currentCriticalMultiplier`] = 1;
                setAttrs(attributes);
            }

            finishRoll(
                results.rollId,
                {
                    proc: fullSummary,
                    damage: computedResults.rolls[0],
                    directHit: computedResults.rolls[1],
                    total: modifiedRoll.totalTitle() ? computedResults.total : ""
                }
            );
        });
    };

    this.activateCombo = function(eventInfo, index) {
        const sourceAttributes = eventInfo.sourceAttribute.split("_");
        const section = sourceAttributes[1];
        const rowId = sourceAttributes[2];
        engine.logd("Combo activated " + JSON.stringify(eventInfo));
        getAttrs([
            `repeating_${section}_${rowId}_combo`,
            `repeating_${section}_${rowId}_currentRoll`,

            "whisper", "whisperExemptAbilities"
        ], values => {
            const combo = values[`repeating_${section}_${rowId}_combo`];
            var chosenCombo = combo;
            if (combo.includes(",")) {
                const choices = combo.split(",");
                if (index < choices.length) {
                    chosenCombo = choices[index];
                } else {
                    engine.logi(`Combo index out of bonds: selected ${index}, not in ${combo}`);
                    return;
                }
            }
            let comboSpecifications = performAbility.parseCombo(chosenCombo);
            let comboSpecification = comboSpecifications ? comboSpecifications[0] : null;
            if (comboSpecification.roll || comboSpecification.cost) {
                // Custom combo, roll the specified damage and spend the given cost
                let damageRoll = new DamageRoll({
                    title: comboSpecification.name,
                    type: "Special",
                    damageType: "Damage",
                    baseRoll: comboSpecification.roll,
                    hitRoll: values[`repeating_${section}_${rowId}_currentRoll`],
                    cost: comboSpecification.cost,
                    resource: comboSpecification.cost_resource,
                    whisperPrefix: values.whisperExemptAbilities ? "" : values.whisper
                });
                engine.logd("Activating custom combo " + JSON.stringify(comboSpecification));
                engine.getAttrsAndEffects(damageCharacterAttributes, (values, effects) => {
                    this.performDamageRoll(damageRoll, null, values, effects);
                });
            } else {
                // Search abilities for the chosen combo
                let abilityName = comboSpecification.name.toLowerCase();
                let rawSection = section.replace(/[\d]+/, "");
                let sections = [1, 2, 3].map(index => `${rawSection}${index}`);
                engine.allSectionIDs(sections, sectionIds => {
                    const attributes = sectionIds.map((element) => `${element}_title`);
                    getAttrs(attributes, values => {
                        for (let i = 0; i < sectionIds.length; i++) {
                            const sectionId = sectionIds[i];
                            const attribute = attributes[i];
                            if (values[attribute].trim().toLowerCase() == abilityName) {
                                const triggerEvent = {
                                    sourceAttribute: `${sectionId}_runcomboFrom_${rowId}`
                                };
                                engine.logd("Activating " + abilityName);
                                this.roll(triggerEvent);
                                return;
                            }
                        }
                        engine.logd("Couldn't find ability with name " + abilityName);
                    });
                });
            }
        });
    };

    this.buttonForTargetEffects = function(effects, characterName) {
        if (effects.effects.length === 0) {
            return null;
        }
        var effectDefinitions = [];

        engine.logd("Preparing target effects: " + JSON.stringify(effects));
        let initialName = "";
        for (let effect of effects.effects) {
            let adjustedEffect = effectUtilities.searchableName(effect.trim());
            let data = effectData.effects[adjustedEffect];
            if (!data) {
                engine.logi("Unhandled effect " + adjustedEffect);
                continue;
            }

            var value = "";
            let match = effect.match(/\(([-|\s\w]+)\)/);
            if (match && match.length >= 2) {
                value = match[1];
            }

            if (!initialName) {
                initialName = data.name.replace("(X)", `(${value})`);
            }
            let valueDefinition = value ? `[${value}]` : "";
            let effectName = (data.specialType || data.type).replace(/\([Xx]{1}\)/, "");
            let effectDefinition = `${effectName}${valueDefinition}`;
            effectDefinitions.push(effectDefinition);
        }
        return `[${effects.name || initialName}](!ffe --${effectDefinitions.join(",")} --source ${characterName} --edit ${0})`;
    };

    this.stringWithTitle = function(title, value) {
        if (value) {
            return `${title} ${value}`;
        }
        return "";
    };
};

const abilityRolls = new AbilityRolls();
this.export.AbilityRolls = AbilityRolls;
this.export.DamageRoll = DamageRoll;
this.export.abilityRolls = abilityRolls;