/*
    FFXIVAddEffect.js

    An API that enables adding FFXIV TTRPG effects to any given character from Macros.

*/
// eslint-disable-next-line no-unused-vars
const FFXIVAddEffect = (() => {

    const scriptName = "FFXIVAddEffect";
    const version = "0.1.0";

    var lastMessage = {
        content: "",
        who: "",
        time: 0
    };

    const types = [
        { matches: ["aetherial focus", "afocus"], type: "special", maskedType: "augment", specialType: "Aetherial Focus", name: "Aetherial Focus", description: "Begin encounters with X MP. This effect does not increase Max MP." },
        { matches: ["advantage"], type: "advantage", name: "Advantage", description: "Provides an advantage die that can be used once for any ability roll." },
        { matches: ["attribute", "attribute(x)"], type: "attribute(x)", name: "Attribute Up(X)", description: "Improves the given attribute by a set value." },
        { matches: ["blind"], type: "blind", name: "Blind" },
        { matches: ["bind", "bound"], type: "bound", name: "Bound" },
        { matches: ["brink"], type: "brink", name: "Brink of Death" },
        { matches: ["comatose"], type: "comatose", name: "Comatose" },
        { matches: ["critical", "critical(x)"], type: "critical(x)", name: "Critical Up(X)", description: "Reduces the roll needed to score a critical hit by the given value." },
        { matches: ["curecast focus", "curecast", "ccast"], type: "special", maskedType: "augment", specialType: "Curecast Focus", name: "Curecast Focus", ability: "cure", description: "Grants the Cure ability." },
        { matches: ["damage"], type: "damage", name: "Damage Reroll", description: "Allows the option to re-roll any one damage die. The value of the new roll cannot be further re-rolled and has to be used for the damage calculation." },
        { matches: ["defender's boon", "defenders boon", "dboon"], type: "special", maskedType: "augment", specialType: "Defender's Boon", name: "Defender's Boon", description: "Increases Defense or Magic Defense by 1. This applies to the lower of the two attributes; if they have the same value, this augmentation has no effect." },
        { matches: ["deflecting edge", "deflecting", "edge", "dedge"], type: "special", maskedType: "augment", specialType: "Deflecting Edge", name: "Deflecting Edge", ability: "parry", description: "Grants the Parry ability." },
        { matches: ["dot", "dot(x)"], type: "dot(x)", name: "DOT(X)", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        { matches: ["dps", "dps(x)"], type: "dps(x)", name: "DPS(X)", description: "Increments all damage dealt by the character's abilities by a given value." },
        { matches: ["elemental veil", "elementail veil 1", "elemental veil i", "eveil", "eveil 1", "eveil i", "eveil1", "eveili"], type: "special", maskedType: "augment", specialType: "Elemental Veil", name: "Elemental Veil", description: "Reduces the damage taken from abilities of one type chosen from the following list by 1: fire-aspected, ice-aspected, wind-aspected, earth-aspected, lightning-aspected, water-aspected. Choose the type when purchasing this augmentation." },
        { matches: ["elemental veil ii", "elemental veil 2", "eveil 2", "eveil ii", "eveil2", "eveilii"], type: "special", maskedType: "augment", specialType: "Elemental Veil", name: "Elemental Veil", description: "Reduces the damage taken from abilities of three type chosen from the following list by 1: fire-aspected, ice-aspected, wind-aspected, earth-aspected, lightning-aspected, water-aspected. Choose the type(s) when purchasing this augmentation." },
        { matches: ["enmity", "enmity(x)"], type: "enmity(x)", name: "Enmity(X)", description: "For any ability this character makes that does not target the source of the Enmity effect, a penalty of the given value is applied to the ability roll." },
        { matches: ["flamecast focus", "flamecast", "fcast"], type: "special", maskedType: "augment", specialType: "Flamecast Focus", name: "Flamecast Focus", ability: "fire", description: "Grants the Fire ability." },
        { matches: ["heavy"], type: "heavy", name: "Heavy" },
        { matches: ["icecast focus", "icecast", "icast"], type: "special", maskedType: "augment", specialType: "Icecast Focus", name: "Icecast Focus", ability: "ice", description: "Grants the Ice ability." },
        { matches: ["improved padding", "ipadding", "ipad"], type: "special", maskedType: "augment", specialType: "Improved Padding", name: "Improved Padding", description: "Grants a barrier of 1 HP at the start of the [Adventurer Step]." },
        { matches: ["mages ballad", "mage's ballad", "mballad"], type: "special", maskedType: "damage", specialType: "Mage's Ballad", name: "Mage's Ballad", description: "While under the effect of Mage's Ballad, you may reroll a single die when determining the amount of damage dealt by an ability." },
        { matches: ["magic damper", "damper", "mdamper"], type: "special", maskedType: "augment", specialType: "Magic Damper", name: "Magic Damper", ability: "aetherwall", description: "Grants the Aetherwall ability." },
        { matches: ["major arcana", "marcana"], type: "special", maskedType: "damage", specialType: "Major Arcana", name: "Major Arcana", description: "While a character is under the effect of Major Arcana, they may reroll a single die of their choosing when determining the amount of damage dealt by an ability. Any die rerolled in this way cannot be rerolled again, and its result must be used.\n\nMajor Arcana is removed when its effect is resolved or at the end of the character's turn." },
        { matches: ["mana conduit", "mconduit"], type: "special", maskedType: "augment", specialType: "Mana Conduit", name: "Mana Conduit", description: "This character may spend 5 MP immediately before making an ability check to increase its total by 1." },
        { matches: ["masterwork ornamentation", "masterwork", "ornamentation", "ornament", "mwork"], type: "special", maskedType: "augment", specialType: "Masterwork Ornamentation", name: "Masterwork Ornamentation", description: "Grants one advantage die on checks involving speech. This effect cannot be used if the other character is hostile or is unable to see this character." },
        { matches: ["paralyzed", "paralysis"], type: "paralyzed", name: "Paralyzed" },
        { matches: ["petrified", "petrify"], type: "petrified", name: "Petrified" },
        { matches: ["precision opener", "popener"], type: "special", maskedType: "augment", specialType: "Precision Opener", name: "Precision Opener", description: "Grants one advantage die on the first ability check this character makes during their first turn of an encounter." },
        { matches: ["prone"], type: "prone", name: "Prone" },
        { matches: ["ready"], type: "ready", name: "X Ready" },
        { matches: ["regen", "regen(x)", "revivify", "revivify(x)"], type: "regen(x)", name: "Regen(X)", description: "Restores a given amount of HP at the end of the [Adventurer Step]." },
        { matches: ["reprisal", "repr"], type: "special", maskedType: "ddown(x)", specialType: "Reprisal", name: "Reprisal", description: "Reduces the damage you deal with abilities by 2 until the end of this round." },
        { matches: ["roll", "roll(x)"], type: "roll(x)", name: "Roll Up(X)", description: "Allows the option to increment the value of an ability roll for purposes of achieving a Direct Hit or a Critical." },
        { matches: ["silence"], type: "silence", name: "Silence" },
        { matches: ["sleep"], type: "sleep", name: "Sleep" },
        { matches: ["stun"], type: "stun", name: "Stun" },
        { matches: ["transcendent"], type: "transcendent", name: "Transcendent" },
        { matches: ["unstunnable"], type: "unstunnable", name: "Unstunnable" },
        { matches: ["warding talisman", "talisman", "ward", "wtalisman", "protective ward", "pward"], type: "special", maskedType: "item", specialType: "Warding Talisman", name: "Warding Talisman", ability: "protective_ward", description: "When this item is obtained, the GM chooses a specific enemy or character classification. So long as the owner possesses this item, grants the Protective Ward ability. This ability can only be used once, after which the talisman loses its power and has no further effect." },
        { matches: ["weak"], type: "weak", name: "Weak" }
    ];

    const effectAbilities = {
        aetherwall: {
            instant: [
                { title: "Aetherwall", type: "Instant, Augment", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately after an ability check for an ability that targets you", baseEffect: "Increases your Magic Defense by 1 for the ability check that triggered Parry.", limitation: "Once per phase", hitType: "None", damageType: "Magic Defense", baseValue: "1", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/augment.png" }
            ]
        },
        cure: {
            secondary: [
                { title: "Cure", type: "Secondary, Magic, Invoked, Augment", cost: 2, resource: "MP", uses: 0, uses_max: 0, target: "Single", Range: "10 squares", baseEffect: "Restores 2 HP to the target.", hitType: "None", damageType: "Healing", baseValue: "2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/augment.png" }
            ]
        },
        fire: {
            primary: [
                { title: "Fire", type: "Primary, Magic, Fire-Aspected, Invoked, Augment", cost: 2, resource: "MP", uses: 0, uses_max: 0, target: "Single", Range: "10 squares", check: "INT + d20", cr: "Target's Magic Defense", baseEffect: "Deals 2 damage to the target.", directHit: "Deals an additional 1d6 damage.", hitType: "Hit", damageType: "Damage", baseValue: "2", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/augment.png" }
            ]
        },
        ice: {
            primary: [
                { title: "Ice", type: "Primary, Magic, Ice-Aspected, Invoked, Augment", cost: 2, resource: "MP", uses: 0, uses_max: 0, target: "Single", Range: "10 squares", check: "INT + d20", cr: "Target's Magic Defense", baseEffect: "Deals 2 damage to the target.", directHit: "Deals an additional 1d6 damage.", hitType: "Hit", damageType: "Damage", baseValue: "2", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/augment.png" }
            ]
        },
        parry: {
            instant: [
                { title: "Parry", type: "Instant, Augment", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately after an ability check for an ability that targets you", baseEffect: "Increases your Defense by 1 for the ability check that triggered Parry.", limitation: "Once per phase", hitType: "None", damageType: "Defense", baseValue: "1", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/augment.png" }
            ]
        },
        protective_ward: {
            instant: [
                { title: "Protective Ward", type: "Instant, Item, {value} ward", cost: 0, uses: 1, uses_max: 1, condition: "Protective Ward can be used in addition to another instant ability this turn", trigger: "When an ability used by the specific enemy or an enemy with the classification {value} scores a critical", baseEffect: "The ability that triggered Protective Ward scores a direct hit but not a critical.", limitation: "Once", hitType: "None", damageType: "Effect", effectSelf: "consume(Warding Talisman|{value})", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Items/warding_talisman.png" }
            ]
        }
    };

    const expiries = [
        "use",
        "damage",
        "start",
        "turn",
        "turn2",
        "phase",
        "encounter",
        "rest",
        "end",
        "permanent",
        "ephemeral"
    ];

    let logger = new class {

        constructor(debug) {
            this.debug = debug;
        }

        d(string) {
            if (this.debug) {
                log(`${scriptName}: ${string}`);
            }
        }

        i(string) {
            log(`${scriptName}: ${string}`);
        }
    }(true);

    const generateUUID = (() => {
        let a = 0;
        let b = [];
        return () => {
            let c = (new Date()).getTime() + 0;
            let f = 7;
            let e = new Array(8);
            let d = c === a;
            a = c;
            for (; 0 <= f; f--) {
                e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                c = Math.floor(c / 64);
            }
            c = e.join("");
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--) {
                    b[f] = 0;
                }
                b[f]++;
            } else {
                for (f = 0; 12 > f; f++) {
                    b[f] = Math.floor(64 * Math.random());
                }
            }
            for (f = 0; 12 > f; f++) {
                c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
            }
            return c;
        };
    })();

    const generateRowID = () => generateUUID().replace(/_/g, "Z");

    const getIconForEffect = (effect) => {
        if (effect.type == "none") {
            return "";
        }
        if (effect.maskedType == "augment") {
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/augment.png`;
        }
        if (effect.type == "special") {
            let imageName = effect.specialType.toLowerCase().replace("'", "").replace(" ", "-");
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
        }

        let imageName = effect.type.replace("(x)", "-x");
        return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
    };

    const getCharacters = (msg, target) => {
        if (target == "selected") {
            let tokens = msg.selected;
            if (!tokens) {
                return { result: [], error: "Select a token to apply an status effect." };
            }

            var characters = [];
            for (let token of tokens) {
                if (token._type != "graphic") {
                    continue;
                }
                let object = getObj("graphic", token._id);
                if (!object || !object.get("represents")) {
                    logger.d("No representation for token; skipping");
                    continue;
                }
                let character = getObj("character", object.get("represents"));
                characters.push(character);
                logger.d("Adding character " + JSON.stringify(character));
            }
            return { result: characters, error: null };
        } else if (target == "mine") {
            let characters = findObjs({ type: "character", controlledby: msg.playerid });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters controlled by player");
                return { result: [], error: "No available controlled characters to apply status effects to." };
            }
        } else {
            logger.d("Searching for character " + target);
            let characters = findObjs({ type: "character", name: target });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters named " + target);
                return { result: [], error: `No characters named ${target}` };
            }
        }
    };

    const unpackNaN = (value) => {
        let intValue = parseInt(value);
        if (isNaN(intValue)) {
            return 0;
        }
        return intValue;
    };

    const unpackAttribute = (character, name, defaultValue) => {
        let attribute = findObjs({ type: "attribute", characterid: character.id, name: name });
        if (!attribute || attribute.length == 0) {
            return {
                fake: {
                    name: name,
                    characterid: character.id
                },
                get: (key) => {
                    if (key == "name") {
                        return name;
                    }
                    if (key == "current") {
                        return defaultValue;
                    }
                    return "";
                }
            };
        }
        return attribute[0];
    };

    const setAttribute = (attribute, key, value) => {
        if (attribute.fake) {
            var settings = {
                name: attribute.fake.name,
                characterid: attribute.fake.characterid
            };
            settings[key] = value;
            createObj("attribute", settings);
        } else {
            attribute.set(key, value);
        }
    };

    /*
    const timer = (name) => {
        var start = new Date()
        return {
            stop: () => {
                var end = new Date()
                var time = end.getTime() - start.getTime()
                log(`Timer: ${name} finished in ${time}ms`)
            }
        }
    }
    */

    const getEffectsWithName = (name, character) => {
        let objects = findObjs({ type: "attribute", characterid: character.id, current: name });
        let effects = objects.reduce((accumulator, object) => {
            let objectName = object.get("name");
            let normalizedName = objectName.toLowerCase();
            if (!normalizedName.includes("repeating_effects") || !normalizedName.includes("type")) {
                return accumulator;
            }
            let id = objectName.replace("repeating_effects_", "").replace(/_\w*[Tt]{1}ype/, "");
            accumulator.push({
                id: id,
                characterid: character.id
            });
            return accumulator;
        }, []);
        return effects;
    };

    const performAdditionalEffectChanges = (effect, character) => {
        switch (effect.specialType.toLowerCase()) {
            case "astral fire": {
                // Clear MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off");
                setAttribute(mpRecoveryBlock, "current", "on");
                break;
            }
            case "barrier": {
                let barrierPoints = unpackAttribute(character, "barrierPoints", 0);
                let currentPoints = unpackNaN(barrierPoints.get("current"));
                let value = unpackNaN(effect.value);

                setAttribute(barrierPoints, "current", Math.max(currentPoints, value));
                break;
            }
            case "umbral ice": {
                // Reset MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off");
                setAttribute(mpRecoveryBlock, "current", "off");
                break;
            }
        }

        if (!effect.abilities) {
            return;
        }

        logger.d("Creating abilities for effect");
        for (let section of Object.entries(effect.abilities)) {
            let sectionName = section[0];
            for (let ability of section[1]) {
                logger.d("Creating ability " + ability.title);
                let id = generateRowID();
                for (let entry of Object.entries(ability)) {
                    var attributeValue = entry[1];
                    if (effect.value && attributeValue && isNaN(attributeValue)) {
                        attributeValue = attributeValue.replace("{value}", effect.value);
                    }
                    createObj("attribute", { characterid: character.id, name: `repeating_${sectionName}_${id}_${entry[0]}`, current: attributeValue });
                }
                createObj("attribute", { characterid: character.id, name: `repeating_${sectionName}_${id}_repeatingOverride`, current: "auto" });
                createObj("attribute", { characterid: character.id, name: `repeating_${sectionName}_${id}_augment`, current: "1" });
            }
        }
    };

    const addEffect = (effect) => {
        let summaryIntro = `${effect.typeName.replace("X", effect.value)} to `;
        var summaries = [];

        logger.d(`Adding effect ${effect.typeName} to ${effect.characters.length} character(s)`);
        for (let character of effect.characters) {
            let existingEffects = getEffectsWithName(effect.specialType ?? effect.type, character);
            if (effect.duplicate === "block") {
                if (existingEffects.some(element => element.characterid === character.id)) {
                    logger.d(`Skipping ${character.get("name")} due to duplicate effect`);
                    continue;
                }
            }

            var update = false;
            var id = "";
            if (effect.duplicate == "replace") {
                let duplicate = existingEffects.find(element => element.characterid == character.id);
                if (duplicate) {
                    // Overwrite the contents of the effect with the new specification
                    id = duplicate.id;
                    update = true;
                    logger.d(`Replacing existing effect`);
                } else {
                    id = generateRowID();
                }
            } else {
                id = generateRowID();
            }

            if (effect.expiry != "ephemeral") {
                let attributes = {
                    icon: effect.icon,
                    type: effect.type,
                    specialType: effect.specialType,
                    source: effect.source,
                    description: effect.description,
                    name: effect.typeName,
                    value: effect.value,
                    expiry: effect.expiry,
                    editable: ["1", "on"].includes(effect.editable) ? "on" : "off",
                    curable: ["1", "on"].includes(effect.curable) ? "on" : "off",
                    origin: effect.origin
                };
                for (let entry of Object.entries(attributes)) {
                    if (!entry[1]) {
                        continue;
                    }

                    if (update) {
                        let object = unpackAttribute(
                            character,
                            `repeating_effects_${id}_${entry[0]}`,
                            null
                        );
                        setAttribute(object, "current", entry[1]);
                    } else {
                        createObj("attribute", {
                            name: `repeating_effects_${id}_${entry[0]}`,
                            current: entry[1],
                            characterid: character.id
                        });
                    }
                }
            }
            summaries.push(character.get("name"));
            performAdditionalEffectChanges(effect, character);
        }
        let summary = summaryIntro + summaries.join(", ");
        return { who: effect.who, summary: summary };
    };

    const outputEvent = (type, event) => {
        switch (type) {
            case "add":
                sendChat(event.who, `Added effect: <b>${event.summary}</b>. <i>(FFXIVAddEffect)</i>`);
                break;

            case "error":
                sendChat("FFXIV Effects", `/w gm ${event}`);
                break;

            default:
                logger.i(`Unrecognized type: ${type}`);
                break;
        }
    };

    const help = () => {

        let helpContent = `<h4>${scriptName} !eos --help</h4>` +
            `<h5>Arguments</h5>` +
            `<li><code>--{name}</code> - Required: The name of the effect</li>` +
            `<li><code>--source {X}</code> - Required: The name of the effect's originator</li>` +
            `<hr />` +
            `<h5>Options</h5>` +
            `<ul>` +
            `<li><code>--help</code> - displays this message in chat.</li>` +
            `<li><code>--v {X}</code> - the value for the effect, useful for some effects like attribute(x), which expects a value to apply to an attribute. <b>Default:</b> no value.</li>` +
            `<li><code>--expire {X}</code> - when the effect should expire. <b>Default:</b><code>turn</code>. Valid values are:</li>` +
            `<ul>` +
            `<li><code>encounterstart</code> - Start of an encounter</li>` +
            `<li><code>stepstart</code> - Start of the [Adventurer Step]/[Enemy step], depending on the character's affiliation</li>` +
            `<li><code>start</code> - Start of the character's turn</li>` +
            `<li><code>turn</code> - End of the character's turn</li>` +
            `<li><code>turn2</code> - End of the character's next turn</li>` +
            `<li><code>step</code> - End of the [Adventurer Step]/[Enemy step], depending on the character's affiliation</li>` +
            `<li><code>round</code> - End of this round. Triggers after the end of the [Enemy Step]</li>` +
            `<li><code>phase</code> - End of phase</li>` +
            `<li><code>encounter</code> - End of encounter</li>` +
            `<li><code>rest</code> - After rest</li>` +
            `<li><code>end</code> - After adventure/module</li>` +
            `<li><code>permanent</code> - Never expires</li>` +
            `<li><code>use</code> - On use</li>` +
            `<li><code>damage</code> - When the character receives damage</li>` +
            `</ul>` +
            `<li><code>--edit {X}</code> - whether the effect should be manually editable in the character sheet. 1 or on to enable editing, 0 or off to disable. <b>Default:</b> enabled.</li>` +
            `<li><code>--curable {X}</code> - if the effect can be removed by abilities like Esuna, or certain items. 1 or on to enable, 0 or off to disable. <b>Default:</b> disabled.</li>` +
            `<li><code>--dupe {X}</code> - how duplicates of the effect should be handled. <b>Default:</b><code>allow</code>. Valid values are:</li>` +
            `<ul>` +
            `<li><code>allow</code> - any number of this effect can be added to the same character</li>` +
            `<li><code>block</code> - the same effect cannot be applied again, and will be discarded if an attempt is made</li>` +
            `<li><code>replace</code> - if the same effect is applied again, it will replace the previous instance</li>` +
            `</ul>` +
            `<li><code>--t {X}</code> - the target. Default: <code>selected</code>. Valid values are:</li>` +
            `<ul>` +
            `<li><code>selected</code> - the selected token(s)</li>` +
            `<li><code>mine</code> - the tokens controlled by the player who triggered this call</li>` +
            `<li>A character name</li>` +
            `</ul>` +
            `<li><code>--l {X}</code> - the level of the effect, for any cases where that may matter. <b>Default:</b> no value.</li>` +
            `</ul>`
            ;

        logger.d("Posting help text");
        try {
            sendChat(scriptName, helpContent);
        } catch (e) {
            logger.i(`ERROR: ${e}`);
        }
    };

    const handleInput = (msg) => {
        if ("api" !== msg.type) {
            return;
        }
        if (!msg.content.match(/^!ffe(\b\s|$)/)) {
            return;
        }

        let time = (new Date()).getTime();
        if (lastMessage.content === msg.content && lastMessage.who === msg.who && time - lastMessage.time < 200) {
            logger.d("Duplicate message, ignoring");
            return;
        }
        lastMessage.content = msg.content;
        lastMessage.who = msg.who;
        lastMessage.time = time;

        let who = (getObj("player", msg.playerid) || { get: () => "API" }).get("_displayname");
        let args = msg.content.split(/\s+--/);

        let effect = {
            id: "-1",
            type: "none",
            typeName: "",
            specialType: "",
            value: "",
            source: "",
            abilities: undefined,
            expiry: "turn",
            editable: "1",
            target: "selected",
            characters: [],
            player: msg.playerid,
            who: who,
            origin: "FFXIVAddEffect",
            level: null
        };

        logger.d("==============================================");
        logger.d("Parsing command " + msg.content);
        logger.d("==============================================");
        for (let a of args) {
            let parts = a.split(/\s+/);
            switch (parts[0].toLowerCase()) {
                case "!ffe":
                    // Do nothing for the API keyword
                    break;

                case "help":
                    help();
                    return;

                case "v":
                    effect.value = parts[1];
                    break;

                case "source":
                    effect.source = parts[1];
                    break;

                case "expire": {
                    let expiry = parts[1].toLowerCase();
                    if (expiries.includes(expiry)) {
                        effect.expiry = expiry;
                    } else {
                        logger.i("Unrecognized expiry type " + expiry);
                        return;
                    }
                    break;
                }

                case "edit":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effect.editable = parts[1];
                    } else {
                        logger.i("Unrecognized editable type " + parts[1]);
                        return;
                    }
                    break;

                case "curable":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effect.curable = parts[1];
                    } else {
                        logger.i("Unrecognized curable type " + parts[1]);
                        return;
                    }
                    break;

                case "dupe":
                    if (["block", "replace", "allow"].includes(parts[1])) {
                        effect.duplicate = parts[1];
                    } else {
                        logger.i("Unrecognized dupe type " + parts[1]);
                        return;
                    }
                    break;

                case "t": {
                    let target = parts.slice(1).join(" ");
                    effect.target = target;
                    break;
                }

                case "l": {
                    let parsedLevel = parseInt(parts[1]);
                    if (isNaN(parsedLevel)) {
                        logger.i("Invalid level value " + parts[1]);
                        return;
                    }
                    effect.level = parsedLevel;
                    break;
                }

                default: {
                    let name = parts.join(" ");
                    let match = types.find(type => type.matches.includes(name.toLowerCase())) ?? { type: "special", specialType: name };
                    let specialType;
                    if (match.type == "special") {
                        specialType = match.specialType;
                        effect.maskedType = match.maskedType;
                        effect.typeName = match.specialType;
                        if (match.ability) {
                            effect.abilities = effectAbilities[match.ability];
                        }
                    } else {
                        specialType = "";
                        effect.typeName = match.name;
                    }
                    effect.type = match.type;
                    effect.specialType = specialType;
                    effect.description = match.description;
                    break;
                }
            }
        }
        if (!effect.source) {
            logger.i("No source given");
            help();
            return;
        }
        if (effect.type == "none") {
            logger.i("Found no matching effect for " + msg.content);
            return;
        }
        effect.icon = getIconForEffect(effect);
        let targetResult = getCharacters(msg, effect.target);
        if (targetResult.error) {
            outputEvent("error", targetResult.error);
            return;
        }

        effect.characters = targetResult.result;
        let event = addEffect(effect);
        if (!playerIsGM(msg.playerid)) {
            outputEvent("add", event);
        }
    };

    const registerEventHandlers = () => {
        on("chat:message", handleInput);
    };

    on("ready", () => {
        state[scriptName] = {
            version: version
        };
        registerEventHandlers();
    });
})();