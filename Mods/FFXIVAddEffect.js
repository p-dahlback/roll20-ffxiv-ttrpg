// Build (version 1.0.0): Source/mods/../common/utilities.js


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

// Build (version 1.0.0): Source/mods/common/modutilities.js

function generateUUID() {
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
}

/*eslint-disable-next-line no-redeclare*/
function generateRowID() { generateUUID().replace(/_/g, "Z"); }

function unpackAttribute(character, name, defaultValue) {
    let attribute = findObjs({ type: "attribute", characterid: character.id, name: name });
    if (!attribute || attribute.length == 0) {
        return {
            fake: {
                name: name,
                characterid: character.id
            },
            get: (key) => {
                if (key === "name") {
                    return name;
                }
                if (key === "current") {
                    return defaultValue;
                }
                return "";
            }
        };
    }
    return attribute[0];
}

/*eslint-disable-next-line no-unused-vars*/
function setAttribute(attribute, key, value) {
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
}

// Build (version 1.0.0): Source/mods/../common/effects.js


class EffectData {
    constructor() {
        this.effects = {
            aetherial_focus: { matches: ["aetherial focus", "afocus"], type: "special", maskedType: "augment", specialType: "Aetherial Focus", statusType: "Enhancement", name: "Aetherial Focus", expiry: "end", duplicate: "block", description: "Begin encounters with X MP. This effect does not increase Max MP." },
            advantage: { matches: ["advantage"], type: "advantage", maskedType: "advantage", statusType: "Enhancement", name: "Advantage", expiry: "use", description: "Provides an advantage die that can be used once for any ability roll." },
            astral_fire: { type: "special", maskedType: "special", specialType: "Astral Fire", statusType: "Enhancement", name: "Astral Fire", expiry: "turn2", duplicate: "replace", description: "While under the effect of Astral Fire your fire-aspected abilities deal an additional 1d6 damage* and you do not recover MP at the end of the [Adventurer Step].\n\nAstral Fire is removed when you are granted Umbral Ice or, if the effect is not renewed, at the end of your next turn. \n\n*After attaining level 50, this damage increases to 2d6." },
            attribute: { matches: ["attribute", "attribute(x)"], type: "attribute(x)", maskedType: "attribute(x)", statusType: "Enhancement", name: "Attribute Up (X)", expiry: "turn", description: "Improves the given attribute by a set value." },
            barrier: { type: "special", maskedType: "special", specialType: "Barrier(X)", statusType: "Enhancement", name: "Barrier (X)", expiry: "ephemeral" },
            berserk: { type: "special", maskedType: "dps(x)", specialType: "Berserk", statusType: "Enhancement", name: "Berserk", expiry: "turn", duplicate: "block", description: "Your abilities deal an additional 2 damage until the end of this turn." },
            blind: { matches: ["blind"], type: "blind", maskedType: "blind", statusType: "Enfeeblement", name: "Blind", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot see and automatically fail any checks that rely entirely on vision. You incur a -2 penalty on all checks, and characters receive one advantage die when targeting you." },
            bound: { matches: ["bind", "bound"], type: "bound", maskedType: "bound", statusType: "Enfeeblement", name: "Bound", expiry: "encounter", curable: true, duplicate: "block", description: "When Bound, Small and Medium characters' Speed falls to 0, while larger characters' Speed is reduced by 2.\n\nCharacters receive one advantage die when targeting you." },
            brink: { matches: ["brink"], type: "brink", maskedType: "brink", statusType: "Enfeeblement", name: "Brink of Death", expiry: "rest", duplicate: "block", description: "You take a -5 penalty on all checks. If you are targeted by another effect that inflicts Weak, you are inflicted with Comatose instead.\n\nBrink of Death can only be removed by completing a rest or by effects that specifically remove it." },
            clear_enfeeblements: { type: "special", maskedType: "special", specialType: "Clear Enfeeblements", statusType: "Enhancement", name: "Clear Enfeeblements", expiry: "ephemeral" },
            consume: { type: "special", maskedType: "special", specialType: "Consume(X)", statusType: "Enhancement", name: "Consume (X)", expiry: "ephemeral" },
            comatose: { matches: ["comatose"], type: "comatose", maskedType: "comatose", statusType: "Enfeeblement", name: "Comatose", expiry: "rest", duplicate: "block", description: "A Comatose character is treated as if they were Knocked Out for gameplay purposes.\nComatose can only be removed by spending one full day in a location where appropriate medical treatment is available, as determined by the GM.\n\nA Comatose character has all enhancements and enfeeblements removed. They cannot be granted any enhancements or afflicted with further enfeeblements other than Death." },
            critical: { matches: ["critical", "critical(x)"], type: "critical(x)", maskedType: "critical(x)", statusType: "Enfeeblement", name: "Critical Up (X)", expiry: "use", description: "Reduces the roll needed to score a critical hit by the given value." },
            curecast_focus: { matches: ["curecast focus", "curecast", "ccast"], type: "special", maskedType: "augment", augmentType: "ability", ability: "cure", specialType: "Curecast Focus", statusType: "Enhancement", name: "Curecast Focus", expiry: "end", duplicate: "block", description: "Grants the Cure ability." },
            damage: { matches: ["damage"], type: "damage", maskedType: "damage", statusType: "Enhancement", name: "Damage Reroll", expiry: "use", description: "Allows the option to re-roll any one damage die. The value of the new roll cannot be further re-rolled and has to be used for the damage calculation." },
            defenders_boon: { matches: ["defender's boon", "defenders boon", "dboon"], type: "special", maskedType: "augment", specialType: "Defender's Boon", statusType: "Enhancement", name: "Defender's Boon", expiry: "end", duplicate: "block", description: "Increases Defense or Magic Defense by 1. This applies to the lower of the two attributes; if they have the same value, this augmentation has no effect." },
            deflecting_edge: { matches: ["deflecting edge", "deflecting", "edge", "dedge"], type: "special", maskedType: "augment", augmentType: "ability", ability: "parry", specialType: "Deflecting Edge", statusType: "Enhancement", name: "Deflecting Edge", expiry: "end", duplicate: "block", description: "Grants the Parry ability." },
            ddown: { matches: ["ddown", "ddown(x)", "damage down"], type: "ddown(x)", maskedType: "ddown(x)", statusType: "Enfeeblement", name: "Damage Down (X)", expiry: "turn", curable: true, description: "Reduces damage dealt by this character's abilities by the given value." },
            dot: { matches: ["dot", "dot(x)"], type: "dot(x)", maskedType: "dot(x)", statusType: "Enfeeblement", name: "DOT (X)", expiry: "phase", curable: true, description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
            dps: { matches: ["dps", "dps(x)"], type: "dps(x)", maskedType: "dps(x)", statusType: "Enhancement", name: "Damage Up (X)", expiry: "turn", duplicate: "allow", description: "Increments all damage dealt by the character's abilities by a given value." },
            elemental_veil: { matches: ["elemental veil", "elementail veil 1", "elemental veil i", "eveil", "eveil 1", "eveil i", "eveil1", "eveili"], type: "special", maskedType: "augment", specialType: "Elemental Veil", statusType: "Enhancement", name: "Elemental Veil", expiry: "end", duplicate: "block", description: "Reduces the damage taken from abilities of one type chosen from the following list by 1: fire-aspected, ice-aspected, wind-aspected, earth-aspected, lightning-aspected, water-aspected. Choose the type when purchasing this augmentation." },
            elemental_veil_ii: { matches: ["elemental veil ii", "elemental veil 2", "eveil 2", "eveil ii", "eveil2", "eveilii"], type: "special", maskedType: "augment", specialType: "Elemental Veil", statusType: "Enhancement", name: "Elemental Veil II", expiry: "end", duplicate: "block", description: "Reduces the damage taken from abilities of three type chosen from the following list by 1: fire-aspected, ice-aspected, wind-aspected, earth-aspected, lightning-aspected, water-aspected. Choose the type(s) when purchasing this augmentation." },
            enmity: { matches: ["enmity", "enmity(x)"], type: "enmity(x)", maskedType: "enmity(x)", statusType: "Enfeeblement", name: "Enmity (X)", expiry: "turn", duplicate: "replace", description: "For any ability this character makes that does not target the source of the Enmity effect, a penalty of the given value is applied to the ability roll." },
            flamecast_focus: { matches: ["flamecast focus", "flamecast", "fcast"], type: "special", maskedType: "augment", augmentType: "ability", ability: "fire", specialType: "Flamecast Focus", statusType: "Enhancement", name: "Flamecast Focus", expiry: "end", duplicate: "block", description: "Grants the Fire ability." },
            hawks_eye: { type: "special", maskedType: "Straight Shot Ready", specialType: "Hawk's Eye", statusType: "Enhancement", name: "Hawk's Eye", expiry: "use", duplicate: "block", description: "While under the effect of Hawk's Eye, you ignore the penalty incurred on ability checks made while Blinded." },
            heavy: { matches: ["heavy"], type: "heavy", maskedType: "heavy", statusType: "Enfeeblement", name: "Heavy", expiry: "turn", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to their Speed.\n\nAbility checks targeting you automatically result in direct hits." },
            icecast_focus: { matches: ["icecast focus", "icecast", "icast"], type: "special", maskedType: "augment", augmentType: "ability", ability: "ice", specialType: "Icecast Focus", statusType: "Enhancement", name: "Icecast Focus", expiry: "end", duplicate: "block", description: "Grants the Ice ability." },
            improved_padding: { matches: ["improved padding", "ipadding", "ipad"], type: "special", maskedType: "augment", specialType: "Improved Padding", statusType: "Enhancement", name: "Improved Padding", expiry: "end", duplicate: "block", description: "Grants a barrier of 1 HP at the start of the [Adventurer Step]." },
            knocked_out: { matches: ["knocked out", "ko", "knocked", "kout"], type: "special", maskedType: "special", specialType: "Knocked Out", name: "Knocked Out", statusType: "Enfeeblement", expiry: "rest", duplicate: "block", description: "A character that has been Knocked Out is unconscious and cannot perceive their surroundings. They cannot use abilities or perform other actions during their turn.\n\nThey are treated as both Prone and Stunned.\n\nThey cannot recover HP or MP.\n\nKnocked Out can only be removed by effects that specifically remove it.\n\nA character that has been knocked out has all enhancements and enfeeblements removed. They cannot be granted any enhancements or afflicted with further enfeeblements other than Comatose." },
            lightweight_refit: { type: "special", maskedType: "augment", specialType: "Lightweight Refit", statusType: "Enhancement", name: "Lightweight Refit", expiry: "end", duplicate: "block", description: "Increases Speed by 1 during this character's first turn of an encounter." },
            lucid_dreaming: { type: "special", maskedType: "special", specialType: "Lucid Dreaming", statusType: "Enhancement", name: "Lucid Dreaming", expiry: "step", duplicate: "replace", description: "Recover an additional 1 MP at the end of this round's [Adventurer Step)." },
            mages_ballad: { matches: ["mages ballad", "mage's ballad", "mballad"], type: "special", maskedType: "damage", specialType: "Mage's Ballad", statusType: "Enhancement", name: "Mage's Ballad", expiry: "use", duplicate: "block", description: "While under the effect of Mage's Ballad, you may reroll a single die when determining the amount of damage dealt by an ability." },
            magic_damper: { matches: ["magic damper", "damper", "mdamper"], type: "special", maskedType: "augment", augmentType: "ability", ability: "aetherwall", specialType: "Magic Damper", statusType: "Enhancement", name: "Magic Damper", expiry: "end", duplicate: "block", description: "Grants the Aetherwall ability." },
            major_arcana: { matches: ["major arcana", "marcana"], type: "special", maskedType: "damage", specialType: "Major Arcana", statusType: "Enhancement", name: "Major Arcana", expiry: "turn", duplicate: "replace", description: "While a character is under the effect of Major Arcana, they may reroll a single die of their choosing when determining the amount of damage dealt by an ability. Any die rerolled in this way cannot be rerolled again, and its result must be used.\n\nMajor Arcana is removed when its effect is resolved or at the end of the character's turn." },
            mana_conduit: { matches: ["mana conduit", "mconduit"], type: "special", maskedType: "augment", specialType: "Mana Conduit", statusType: "Enhancement", name: "Mana Conduit", expiry: "end", duplicate: "block", description: "This character may spend 5 MP immediately before making an ability check to increase its total by 1." },
            masterwork_ornamentation: { matches: ["masterwork ornamentation", "masterwork", "ornamentation", "ornament", "mwork"], type: "special", maskedType: "augment", specialType: "Masterwork Ornamentation", statusType: "Enhancement", name: "Masterwork Ornamentation", expiry: "end", duplicate: "block", description: "Grants one advantage die on checks involving speech. This effect cannot be used if the other character is hostile or is unable to see this character." },
            paralyzed: { matches: ["paralyzed", "paralysis"], type: "paralyzed", maskedType: "paralyzed", statusType: "Enfeeblement", name: "Paralyzed", expiry: "turn", curable: true, duplicate: "block", description: "If you use a Primary ability and roll a 5 or lower for its ability check, Paralysis interrupts the ability, negating it completely. Do not resolve any of its effects or spend any resources." },
            petrified: { matches: ["petrified", "petrify"], type: "petrified", maskedType: "petrified", statusType: "Enfeeblement", name: "Petrified", expiry: "turn2", curable: true, duplicate: "block", description: "You cannot act during your turn or use Instant abilities. You incur a -5 penalty on all checks.\n\nCharacters targeting you receive one advantage die on their ability check." },
            precision_opener: { matches: ["precision opener", "popener"], type: "special", maskedType: "augment", specialType: "Precision Opener", statusType: "Enhancement", name: "Precision Opener", expiry: "end", duplicate: "block", description: "Grants one advantage die on the first ability check this character makes during their first turn of an encounter." },
            prone: { matches: ["prone"], type: "prone", maskedType: "prone", statusType: "Enfeeblement", name: "Prone", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot take standard movement action on you turn unless you spend half your Speed (rounded up) to get back on your feet.\n\nProne characters incur a -2 penalty on all checks.\n\nCharacters targeting you receive one advantage die when making an ability check." },
            raging_strikes: { type: "special", maskedType: "dps(x)", specialType: "Raging Strikes", statusType: "Enhancement", name: "Raging Strikes", expiry: "turn", duplicate: "block", description: "Your primary abilities deal an additional 2 damage until the end of this turn." },
            rampart: { type: "special", maskedType: "defense(x)", specialType: "Rampart", statusType: "Enhancement", name: "Rampart", expiry: "start", duplicate: "block", description: "Reduces the damage you take from abilities by 2 until the start of your next turn." },
            ready: { matches: ["ready", "ready(x)"], type: "ready(x)", maskedType: "ready(x)", statusType: "Enhancement", name: "(X) Ready", expiry: "use", duplicate: "block", description: "You may use an ability that requires you to be under this enhancement. X Ready is removed after the ability is used." },
            regen: { matches: ["regen", "regen(x)", "revivify", "revivify(x)"], type: "regen(x)", maskedType: "regen(x)", statusType: "Enhancement", name: "Regen (X)", expiry: "phase", description: "Restores a given amount of HP at the end of the [Adventurer Step]." },
            reprisal: { matches: ["reprisal", "repr"], type: "special", maskedType: "ddown(x)", specialType: "Reprisal", statusType: "Enfeeblement", name: "Reprisal", expiry: "round", duplicate: "block", description: "Reduces the damage you deal with abilities by 2 until the end of this round." },
            restore: { type: "restore(x)", maskedType: "restore(x)", statusType: "Enhancement", name: "Restore uses of Y by (X)", expiry: "ephemeral" },
            roll: { matches: ["roll", "roll(x)"], type: "roll(x)", maskedType: "roll(x)", statusType: "Enhancement", name: "Increment Ability Roll (X)", expiry: "use", description: "Allows the option to increment the value of an ability roll for purposes of achieving a Direct Hit or a Critical." },
            silence: { matches: ["silence"], type: "silence", maskedType: "silence", statusType: "Enfeeblement", name: "Silence", expiry: "turn", curable: true, duplicate: "block", description: "You cannot use invoked abilities." },
            sleep: { matches: ["sleep"], type: "sleep", maskedType: "sleep", statusType: "Enfeeblement", name: "Sleep", expiry: "damage", curable: true, duplicate: "block", description: "You incur a -3 penalty on all checks. Sleep is removed when you take damage.\n\nCharacters may use a Primary action to wake a Sleeping character in an adjacent square." },
            slow: { matches: ["slow"], type: "slow", maskedType: "slow", statusType: "Enfeeblement", name: "Slow", expiry: "encounter", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to your Speed.\n\nYou incur a -2 penalty on all checks." },
            stun: { matches: ["stun"], type: "stun", maskedType: "stun", statusType: "Enfeeblement", name: "Stun", expiry: "turn", duplicate: "block", description: "You cannot act during your turn or use Instant abilities.\n\nAny and all markers for which a Stunned character is the creator are removed.\n\nYou incur a -5 penalty to all checks.\n\nCharacters targeting you receive one advantage die on ability checks.\n\nStun cannot be removed by effects that remove enfeeblements.\n\nA character that has been Stunned cannot be Stunned again in the same encounter." },
            surging_tempest: { type: "special", maskedType: "special", specialType: "Surging Tempest", statusType: "Enhancement", name: "Surging Tempest", expiry: "encounter", duplicate: "block", description: "While under the effect of Surging Tempest, treat any roll of 1 when determining damage as if it were a 2." },
            transcendent: { matches: ["transcendent"], type: "transcendent", maskedType: "transcendent", statusType: "Enhancement", name: "Transcendent", expiry: "turnstart", duplicate: "block", description: "You are immune to damage and enfeeblements inflicted by enemy abilities, traits and encounter mechanics. Transcendent is removed at the start of the character's turn or when the character uses an ability." },
            thrill_of_battle: { type: "special", maskedType: "special", specialType: "Thrill of Battle", statusType: "Enhancement", name: "Thrill of Battle", expiry: "ephemeral", duplicate: "allow" },
            thunderhead_ready: { type: "special", maskedType: "ready(x)", specialType: "Thunderhead Ready", statusType: "Enhancement", name: "Thunderhead Ready", expiry: "use", duplicate: "block", description: "Enables one use of a Lightning-aspected ability, such as Thunder or Thunder II." },
            unstunnable: { matches: ["unstunnable"], type: "unstunnable", maskedType: "unstunnable", statusType: "Enhancement", name: "Stun Immunity", expiry: "encounter", duplicate: "block", description: "You are immune to Stun effects for this encounter." },
            umbral_ice: { type: "special", maskedType: "special", specialType: "Umbral Ice", statusType: "Enhancement", name: "Umbral Ice", expiry: "turn2", duplicate: "replace", description: "While under the effect of Umbral Ice, your ice-aspected abilities restore 5 MP each time they deal damage.\n\nUmbral Ice is removed when you are granted Astral Fire or, if the effect is not renewed, at the end of your next turn." },
            warding_talisman: { matches: ["warding talisman", "talisman", "ward", "wtalisman", "protective ward", "pward"], type: "special", maskedType: "item", augmentType: "ability", ability: "protective_ward", specialType: "Warding Talisman", statusType: "Enhancement", name: "Warding Talisman", expiry: "permanent", duplicate: "allow", description: "When this item is obtained, the GM chooses a specific enemy or character classification. So long as the owner possesses this item, grants the Protective Ward ability. This ability can only be used once, after which the talisman loses its power and has no further effect." },
            weak: { matches: ["weak"], type: "weak", maskedType: "weak", name: "Weak", statusType: "Enfeeblement", expiry: "rest", duplicate: "block", description: "A Weakened character incurs a -2 penalty on all checks. If you are afflicted with Weakness from another effect, you are instead afflicted with Brink of Death.\n\nWeakness can only be removed by completing a rest or by effects that specifically remove it." }
        };

        this.matches = Object.values(this.effects);

        this.expiries = {
            encounterstart: "Start of an encounter",
            stepstart: "Start of the [Adventurer Step]",
            start: "Start of your next turn",
            turn: "End of your turn",
            turn2: "End of your next turn",
            step: "End of the [Adventurer Step]",
            round: "End of this round",
            phase: "End of phase",
            encounter: "End of encounter",
            rest: "After rest",
            end: "After adventure",
            permanent: "Permanent",
            use: "On use",
            damage: "On damage"
        };

        this.expiryTypes = Object.keys(this.expiries);

        this.abilities = {
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
    }

    icon(effect) {
        if (!effect || effect.type == "none") {
            return "";
        }

        if (effect.maskedType == "augment") {
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/augment.png`;
        }

        if (effect.type == "special" && effect.specialType) {
            let imageName = effect.specialType.toLowerCase().replaceAll("'", "").replaceAll(" ", "-");
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
        }

        let imageName = effect.type.replace("(x)", "-x");
        return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
    }
};

const effectData = new EffectData();

// Build: Source/mods/FFXIVAddEffect.js


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

    let logger = new Logger(scriptName, true);

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

    const resetAttribute = (character, attributeName, attributeValue) => {
        if (!["str", "dex", "vit", "int", "mnd", "defense", "magicdefense", "vigilance", "speed"].includes(attributeName.toLowerCase())) {
            logger.d(`Unsupported attribute for ${attributeName}`);
            return;
        }
        let attribute = unpackAttribute(character, attributeName, 0);
        let currentValue = attribute.get("current");
        if (currentValue === 0) {
            logger.d(`Couldn't find attribute ${attributeName} on character ${character.get("name")}`);
            return;
        }
        let valueChange = unpackNaN(attributeValue);
        if (valueChange === 0) {
            logger.d(`No value change in effect for attribute ${attributeName} on character ${character.get("name")}`);
            return;
        }
        logger.d(`Resetting attribute change to ${attributeName} by ${valueChange}`);
        setAttribute(attribute, "current", currentValue - valueChange);
    };

    const removeEffectsForFilter = (character, filter) => {
        let attributes = findObjs({ type: "attribute", characterid: character.id });
        let actionables = attributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let match = name.match(/^repeating_effects_([-\w]+)_([\w_]+)/);
                if (!match || match.length < 2) {
                    // It's not a repeating effect attribute, skip
                    return accumulator;
                }
                let id = match[1];
                let subname = match[2];
                if (accumulator.byId[id]) {
                    accumulator.byId[id][subname] = currentValue;
                } else {
                    accumulator.byId[id] = {};
                    accumulator.byId[id][subname] = currentValue;
                }
                if (filter(id, subname, currentValue)) {
                    accumulator.idsToDelete.push(id);
                }
                return accumulator;
            },
            { byId: {}, idsToDelete: [] }
        );
        for (let id of actionables.idsToDelete) {
            let actionable = actionables.byId[id];
            if (actionable["attribute"] && actionable["attributeValue"]) {
                resetAttribute(character, actionable["attribute"].get("current"), actionable["attributeValue"].get("current"));
            }
            for (let entry of Object.entries(actionables.byId[id])) {
                let attribute = entry[1];
                logger.d(`Removing attribute ${attribute.get("name")} for ${character.get("name")}.`);
                attribute.remove();
            }
        }
    };

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

    const performAdditionalEffectChanges = (id, effect, character) => {
        switch ((effect.specialType || effect.type).toLowerCase()) {
            case "astral fire": {
                // Clear MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off");
                setAttribute(mpRecoveryBlock, "current", "on");
                break;
            }
            case "attribute(x)": {
                let definition = effect.value.split(",");
                if (!definition) {
                    logger.d("No value given for attribute(x)");
                    return;
                }
                let attributeName = definition[0];
                if (!["str", "dex", "vit", "int", "mnd", "defense", "magicdefense", "vigilance", "speed"].includes(attributeName.toLowerCase())) {
                    logger.d(`Unsupported attribute for attribute(x): ${attributeName}, from value ${effect.value}`);
                    return;
                }
                let baseAttributeName;
                if (getAttrByName(character.id, `${attributeName}Block`) === "on") {
                    baseAttributeName = `${attributeName}Unblocked`;
                } else {
                    baseAttributeName = attributeName;
                }
                let attribute = unpackAttribute(character, baseAttributeName, 0);
                let attributeValue = attribute.get("current");
                if (attributeValue === 0) {
                    logger.d(`Couldn't find attribute ${baseAttributeName} on character ${character.get("name")}`);
                    return;
                }
                var value = 1;
                if (definition.length > 1) {
                    value = unpackNaN(definition[1], 1);
                }
                logger.d(`attribute(x) increments ${baseAttributeName} by ${value}`);
                setAttribute(attribute, "current", attributeValue + value);

                let originalAttribute = unpackAttribute(character, `${attributeName}Original`, "");
                if (isNaN(parseInt(originalAttribute.getr("current")))) {
                    setAttribute(originalAttribute, "current", attributeValue);
                }

                let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                setAttribute(attributeReference, "current", attributeName);

                let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                setAttribute(attributeValueReference, "current", value);
                break;
            }
            case "barrier": {
                let barrierPoints = unpackAttribute(character, "barrierPoints", 0);
                let currentPoints = unpackNaN(barrierPoints.get("current"));
                let value = unpackNaN(effect.value);

                setAttribute(barrierPoints, "current", Math.max(currentPoints, value));
                break;
            }
            case "bound": {
                let attributes = [];
                attributes.push(unpackAttribute(character, "speed", 0));
                if (unpackAttribute(character, "speedBlock", "off").get("current") === "on") {
                    attributes.push(unpackAttribute(character, "speedUnblocked", 0));
                }

                let diff;
                if (getAttrByName(character.id, "size") === "large") {
                    attributes.forEach(attribute => setAttribute(attribute, "current", unpackNaN(attribute.get("current")) - 2));
                    diff = 2;
                } else {
                    diff = unpackNaN(attributes[0].get("current"));
                    attributes.forEach(attribute => setAttribute(attribute, "current", 0));
                }

                let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                setAttribute(attributeReference, "current", "speed");
                let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                setAttribute(attributeValueReference, "current", -diff);
                break;
            }
            case "clear":
            case "clear enfeeblements":
            case "transcendent": {
                logger.d("Clearing all enfeeblements");
                removeEffectsForFilter(character, (attributeId, name, attribute) => {
                    return attributeId !== id && name === "statusType" && attribute.get("current").trim().toLowerCase() === "enfeeblement";
                });
                break;
            }
            case "comatose":
            case "knocked out": {
                // Trigger the rest action to clear out all prior effects
                logger.d(`Triggering character rest due to ${effect.specialType || effect.type}`);
                removeEffectsForFilter(character, (attributeId, name, attribute) => {
                    return attributeId !== id && name === "expiry" && !["end", "permanent"].includes(attribute.get("current"));
                });
                break;
            }
            case "defender's boon": {
                let effectValue = unpackNaN(effect.value, 1);
                let defense = unpackAttribute(character, "defense", 0);
                let magicDefense = unpackAttribute(character, "magicDefense", 0);

                let defenseValue = defense.get("current");
                let magicDefenseValue = magicDefense.get("current");
                if (defenseValue === 0 || magicDefenseValue === 0) {
                    logger.d("Character has no defense; unable to apply Defender's Boon");
                    return;
                } else if (defenseValue === magicDefenseValue) {
                    logger.d("No effect from Defender's Boon - same value");
                    return;
                } else if (defenseValue < magicDefenseValue) {
                    logger.d("Defender's Boon increments Defense by " + effectValue);
                    setAttribute(defense, "current", defenseValue + effectValue);

                    let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                    setAttribute(attributeReference, "current", "defense");

                    let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                    setAttribute(attributeValueReference, "current", effectValue);
                } else if (magicDefenseValue < defense) {
                    logger.d("Defender's Boon increments Magic Defense by " + effectValue);
                    setAttribute(magicDefense, "current", magicDefenseValue + effectValue);

                    let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                    setAttribute(attributeReference, "current", "magicDefense");

                    let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                    setAttribute(attributeValueReference, "current", effectValue);
                }
                break;
            }
            case "slow":
            case "heavy": {
                let speed = unpackAttribute(character, "speed", 0);
                let originalSpeed = unpackAttribute(character, "speedOriginal", 0);

                let originalSpeedValue = parseInt(originalSpeed.get("current"));
                let currentSpeedValue = parseInt(speed.get("current"));
                let speedValue = originalSpeedValue > 0 ? originalSpeedValue : currentSpeedValue;
                let newValue = Math.floor(speedValue / 2) + speedValue % 2;

                let speedBlock = unpackAttribute(character, "speedBlock", "off");
                if (speedBlock.get("current") === "on") {
                    logger.d(`Speed was already blocked when activating ${effect.type}`);
                } else {
                    setAttribute(speedBlock, "current", "on");

                    let speedUnblocked = unpackAttribute(character, "speedUnblocked", "");
                    setAttribute(speedUnblocked, "current", speed.get("current"));

                    setAttribute(originalSpeed, "current", speedValue);
                }

                let attributeReference = unpackAttribute(character, `repeating_effects_${id}_attribute`, "");
                setAttribute(attributeReference, "current", "speed");

                let attributeValueReference = unpackAttribute(character, `repeating_effects_${id}_attributeValue`, "");
                setAttribute(attributeValueReference, "current", newValue - speedValue);
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
                    statusType: effect.statusType,
                    specialType: effect.specialType,
                    source: effect.source,
                    description: effect.description,
                    name: effect.typeName,
                    value: effect.value,
                    expiry: effect.expiry,
                    editable: ["1", "on"].includes(effect.editable) ? "on" : "off",
                    curable: ["1", "on"].includes(effect.curable) ? "on" : "off",
                    origin: effect.origin,
                    effectsExpandItem: "on"
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
            performAdditionalEffectChanges(id, effect, character);
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
            statusType: "Enhancement",
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
                    if (effectData.expiryTypes.includes(expiry)) {
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
                    let match = effectData.matches.find(type => type.matches.includes(name.toLowerCase())) ?? { type: "special", specialType: name };
                    let specialType;
                    if (match.type == "special") {
                        specialType = match.specialType;
                        effect.maskedType = match.maskedType;
                        effect.typeName = match.specialType;
                        if (match.ability) {
                            effect.abilities = effectData.abilities[match.ability];
                        }
                    } else {
                        specialType = "";
                        effect.typeName = match.name;
                    }
                    effect.type = match.type;
                    effect.statusType = match.statusType;
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
        effect.icon = effectData.icon(effect);
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