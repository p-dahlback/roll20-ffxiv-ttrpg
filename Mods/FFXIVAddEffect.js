// Build (version 1.0.0), generated file FFXIVAddEffect

const FFXIVAddEffectImports = new (function() {
    this.export = {};

// Build (version 1.0.0): Source/mods/../common/utilities.js


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

// Build (version 1.0.0): Source/mods/../common/effects.js


const EffectData = function() {
    this.effects = {
        aetherial_focus: { matches: ["aetherial focus", "afocus"], type: "special", maskedType: "augment", specialType: "Aetherial Focus", statusType: "Enhancement", name: "Aetherial Focus", expiry: "end", duplicate: "block", description: "Begin encounters with X MP. This effect does not increase Max MP." },
        advantage: { matches: ["advantage"], type: "advantage", maskedType: "advantage", statusType: "Enhancement", name: "Advantage", expiry: "use", description: "Provides an advantage die that can be used once for any ability roll." },
        astral_fire: { matches: ["astral fire", "afire", "astralf"], type: "special", maskedType: "special", specialType: "Astral Fire", statusType: "Enhancement", name: "Astral Fire", expiry: "turn2", duplicate: "replace", description: "While under the effect of Astral Fire your fire-aspected abilities deal an additional 1d6 damage* and you do not recover MP at the end of the [Adventurer Step].\n\nAstral Fire is removed when you are granted Umbral Ice or, if the effect is not renewed, at the end of your next turn. \n\n*After attaining level 50, this damage increases to 2d6." },
        attribute: { matches: ["attribute", "attribute(x)"], type: "attribute(x)", maskedType: "attribute(x)", statusType: "Enhancement", name: "Attribute Up (X)", expiry: "turn", description: "Improves the given attribute by a set value." },
        barrier: { matches: ["barrier"], type: "special", maskedType: "special", specialType: "Barrier(X)", statusType: "Enhancement", name: "Barrier (X)", expiry: "ephemeral" },
        berserk: { matches: ["berserk"], type: "special", maskedType: "dps(x)", specialType: "Berserk", statusType: "Enhancement", name: "Berserk", expiry: "turn", duplicate: "block", description: "Your abilities deal an additional 2 damage until the end of this turn." },
        blind: { matches: ["blind"], type: "blind", maskedType: "blind", statusType: "Enfeeblement", name: "Blind", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot see and automatically fail any checks that rely entirely on vision. You incur a -2 penalty on all checks, and characters receive one advantage die when targeting you." },
        bound: { matches: ["bind", "bound"], type: "bound", maskedType: "bound", statusType: "Enfeeblement", name: "Bound", expiry: "encounter", curable: true, duplicate: "block", description: "When Bound, Small and Medium characters' Speed falls to 0, while larger characters' Speed is reduced by 2.\n\nCharacters receive one advantage die when targeting you." },
        brink: { matches: ["brink"], type: "brink", maskedType: "brink", statusType: "Enfeeblement", name: "Brink of Death", expiry: "rest", duplicate: "block", description: "You take a -5 penalty on all checks. If you are targeted by another effect that inflicts Weak, you are inflicted with Comatose instead.\n\nBrink of Death can only be removed by completing a rest or by effects that specifically remove it." },
        clear_enfeeblements: { matches: ["clear", "clear enfeeblements", "cleare"], type: "special", maskedType: "special", specialType: "Clear Enfeeblements", statusType: "Enhancement", name: "Clear Enfeeblements", expiry: "ephemeral" },
        consume: { matches: ["consume"], type: "special", maskedType: "special", specialType: "Consume(X)", statusType: "Enhancement", name: "Consume (X)", expiry: "ephemeral" },
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
        hawks_eye: { matches: ["hawk", "hawke", "hawkseye", "hawk eye", "hawk's eye", "heye"], type: "special", maskedType: "Straight Shot Ready", specialType: "Hawk's Eye", statusType: "Enhancement", name: "Hawk's Eye", expiry: "use", duplicate: "block", description: "While under the effect of Hawk's Eye, you ignore the penalty incurred on ability checks made while Blinded." },
        heavy: { matches: ["heavy"], type: "heavy", maskedType: "heavy", statusType: "Enfeeblement", name: "Heavy", expiry: "turn", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to their Speed.\n\nAbility checks targeting you automatically result in direct hits." },
        icecast_focus: { matches: ["icecast focus", "icecast", "icast"], type: "special", maskedType: "augment", augmentType: "ability", ability: "ice", specialType: "Icecast Focus", statusType: "Enhancement", name: "Icecast Focus", expiry: "end", duplicate: "block", description: "Grants the Ice ability." },
        improved_padding: { matches: ["improved padding", "ipadding", "ipad"], type: "special", maskedType: "augment", specialType: "Improved Padding", statusType: "Enhancement", name: "Improved Padding", expiry: "end", duplicate: "block", description: "Grants a barrier of 1 HP at the start of the [Adventurer Step]." },
        knocked_out: { matches: ["knocked out", "ko", "knocked", "kout"], type: "special", maskedType: "special", specialType: "Knocked Out", name: "Knocked Out", statusType: "Enfeeblement", expiry: "rest", duplicate: "block", description: "A character that has been Knocked Out is unconscious and cannot perceive their surroundings. They cannot use abilities or perform other actions during their turn.\n\nThey are treated as both Prone and Stunned.\n\nThey cannot recover HP or MP.\n\nKnocked Out can only be removed by effects that specifically remove it.\n\nA character that has been knocked out has all enhancements and enfeeblements removed. They cannot be granted any enhancements or afflicted with further enfeeblements other than Comatose." },
        lightweight_refit: { matches: ["lightweight refit", "lrefit", "refit"], type: "special", maskedType: "augment", specialType: "Lightweight Refit", statusType: "Enhancement", name: "Lightweight Refit", expiry: "end", duplicate: "block", description: "Increases Speed by 1 during this character's first turn of an encounter." },
        lucid_dreaming: { matches: ["lucid dreaming", "ldreaming", "lucid"], type: "special", maskedType: "special", specialType: "Lucid Dreaming", statusType: "Enhancement", name: "Lucid Dreaming", expiry: "step", duplicate: "replace", description: "Recover an additional 1 MP at the end of this round's [Adventurer Step)." },
        mages_ballad: { matches: ["mages ballad", "mage's ballad", "mballad"], type: "special", maskedType: "damage", specialType: "Mage's Ballad", statusType: "Enhancement", name: "Mage's Ballad", expiry: "use", duplicate: "block", description: "While under the effect of Mage's Ballad, you may reroll a single die when determining the amount of damage dealt by an ability." },
        magic_damper: { matches: ["magic damper", "damper", "mdamper"], type: "special", maskedType: "augment", augmentType: "ability", ability: "aetherwall", specialType: "Magic Damper", statusType: "Enhancement", name: "Magic Damper", expiry: "end", duplicate: "block", description: "Grants the Aetherwall ability." },
        major_arcana: { matches: ["major arcana", "marcana"], type: "special", maskedType: "damage", specialType: "Major Arcana", statusType: "Enhancement", name: "Major Arcana", expiry: "turn", duplicate: "replace", description: "While a character is under the effect of Major Arcana, they may reroll a single die of their choosing when determining the amount of damage dealt by an ability. Any die rerolled in this way cannot be rerolled again, and its result must be used.\n\nMajor Arcana is removed when its effect is resolved or at the end of the character's turn." },
        mana_conduit: { matches: ["mana conduit", "mconduit"], type: "special", maskedType: "augment", specialType: "Mana Conduit", statusType: "Enhancement", name: "Mana Conduit", expiry: "end", duplicate: "block", description: "This character may spend 5 MP immediately before making an ability check to increase its total by 1." },
        masterwork_ornamentation: { matches: ["masterwork ornamentation", "masterwork", "ornamentation", "ornament", "mwork"], type: "special", maskedType: "augment", specialType: "Masterwork Ornamentation", statusType: "Enhancement", name: "Masterwork Ornamentation", expiry: "end", duplicate: "block", description: "Grants one advantage die on checks involving speech. This effect cannot be used if the other character is hostile or is unable to see this character." },
        paralyzed: { matches: ["paralyzed", "paralysis"], type: "paralyzed", maskedType: "paralyzed", statusType: "Enfeeblement", name: "Paralyzed", expiry: "turn", curable: true, duplicate: "block", description: "If you use a Primary ability and roll a 5 or lower for its ability check, Paralysis interrupts the ability, negating it completely. Do not resolve any of its effects or spend any resources." },
        petrified: { matches: ["petrified", "petrify"], type: "petrified", maskedType: "petrified", statusType: "Enfeeblement", name: "Petrified", expiry: "turn2", curable: true, duplicate: "block", description: "You cannot act during your turn or use Instant abilities. You incur a -5 penalty on all checks.\n\nCharacters targeting you receive one advantage die on their ability check." },
        precision_opener: { matches: ["precision opener", "popener"], type: "special", maskedType: "augment", specialType: "Precision Opener", statusType: "Enhancement", name: "Precision Opener", expiry: "end", duplicate: "block", description: "Grants one advantage die on the first ability check this character makes during their first turn of an encounter." },
        prone: { matches: ["prone"], type: "prone", maskedType: "prone", statusType: "Enfeeblement", name: "Prone", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot take standard movement action on you turn unless you spend half your Speed (rounded up) to get back on your feet.\n\nProne characters incur a -2 penalty on all checks.\n\nCharacters targeting you receive one advantage die when making an ability check." },
        raging_strikes: { matches: ["raging strikes", "rstrikes"], type: "special", maskedType: "dps(x)", specialType: "Raging Strikes", statusType: "Enhancement", name: "Raging Strikes", expiry: "turn", duplicate: "block", description: "Your primary abilities deal an additional 2 damage until the end of this turn." },
        rampart: { matches: ["rampart"], type: "special", maskedType: "defense(x)", specialType: "Rampart", statusType: "Enhancement", name: "Rampart", expiry: "start", duplicate: "block", description: "Reduces the damage you take from abilities by 2 until the start of your next turn." },
        ready: { matches: ["ready", "ready(x)"], type: "ready(x)", maskedType: "ready(x)", statusType: "Enhancement", name: "(X) Ready", expiry: "use", duplicate: "block", description: "You may use an ability that requires you to be under this enhancement. X Ready is removed after the ability is used." },
        regen: { matches: ["regen", "regen(x)", "revivify", "revivify(x)"], type: "regen(x)", maskedType: "regen(x)", statusType: "Enhancement", name: "Regen (X)", expiry: "phase", description: "Restores a given amount of HP at the end of the [Adventurer Step]." },
        reprisal: { matches: ["reprisal", "repr"], type: "special", maskedType: "ddown(x)", specialType: "Reprisal", statusType: "Enfeeblement", name: "Reprisal", expiry: "round", duplicate: "block", description: "Reduces the damage you deal with abilities by 2 until the end of this round." },
        restore: { matches: ["restore", "restore(x)"], type: "restore(x)", maskedType: "restore(x)", statusType: "Enhancement", name: "Restore uses of Y by (X)", expiry: "ephemeral" },
        roll: { matches: ["roll", "roll(x)"], type: "roll(x)", maskedType: "roll(x)", statusType: "Enhancement", name: "Increment Ability Roll (X)", expiry: "use", description: "Allows the option to increment the value of an ability roll for purposes of achieving a Direct Hit or a Critical." },
        silence: { matches: ["silence"], type: "silence", maskedType: "silence", statusType: "Enfeeblement", name: "Silence", expiry: "turn", curable: true, duplicate: "block", description: "You cannot use invoked abilities." },
        sleep: { matches: ["sleep"], type: "sleep", maskedType: "sleep", statusType: "Enfeeblement", name: "Sleep", expiry: "damage", curable: true, duplicate: "block", description: "You incur a -3 penalty on all checks. Sleep is removed when you take damage.\n\nCharacters may use a Primary action to wake a Sleeping character in an adjacent square." },
        slow: { matches: ["slow"], type: "slow", maskedType: "slow", statusType: "Enfeeblement", name: "Slow", expiry: "encounter", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to your Speed.\n\nYou incur a -2 penalty on all checks." },
        stun: { matches: ["stun"], type: "stun", maskedType: "stun", statusType: "Enfeeblement", name: "Stun", expiry: "turn", duplicate: "block", description: "You cannot act during your turn or use Instant abilities.\n\nAny and all markers for which a Stunned character is the creator are removed.\n\nYou incur a -5 penalty to all checks.\n\nCharacters targeting you receive one advantage die on ability checks.\n\nStun cannot be removed by effects that remove enfeeblements.\n\nA character that has been Stunned cannot be Stunned again in the same encounter." },
        surging_tempest: { matches: ["surging tempest", "stempest"], type: "special", maskedType: "special", specialType: "Surging Tempest", statusType: "Enhancement", name: "Surging Tempest", expiry: "encounter", duplicate: "block", description: "While under the effect of Surging Tempest, treat any roll of 1 when determining damage as if it were a 2." },
        transcendent: { matches: ["transcendent"], type: "transcendent", maskedType: "transcendent", statusType: "Enhancement", name: "Transcendent", expiry: "turnstart", duplicate: "block", description: "You are immune to damage and enfeeblements inflicted by enemy abilities, traits and encounter mechanics. Transcendent is removed at the start of the character's turn or when the character uses an ability." },
        transpose: { matches: ["transpose"], type: "special", maskedType: "special", specialType: "Transpose", name: "Transpose", expiry: "ephemeral" },
        thrill_of_battle: { matches: ["thrill of battle", "thrill", "tbattle"], type: "special", maskedType: "special", specialType: "Thrill of Battle", statusType: "Enhancement", name: "Thrill of Battle", expiry: "ephemeral", duplicate: "allow" },
        thunderhead_ready: { matches: ["thunderhead", "tready", "thunderhead ready", "thunder"], type: "special", maskedType: "ready(x)", specialType: "Thunderhead Ready", statusType: "Enhancement", name: "Thunderhead Ready", expiry: "use", duplicate: "block", description: "Enables one use of a Lightning-aspected ability, such as Thunder or Thunder II." },
        unstunnable: { matches: ["unstunnable"], type: "unstunnable", maskedType: "unstunnable", statusType: "Enhancement", name: "Stun Immunity", expiry: "encounter", duplicate: "block", description: "You are immune to Stun effects for this encounter." },
        umbral_ice: { matches: ["umbral ice", "uice"], type: "special", maskedType: "special", specialType: "Umbral Ice", statusType: "Enhancement", name: "Umbral Ice", expiry: "turn2", duplicate: "replace", description: "While under the effect of Umbral Ice, your ice-aspected abilities restore 5 MP each time they deal damage.\n\nUmbral Ice is removed when you are granted Astral Fire or, if the effect is not renewed, at the end of your next turn." },
        warding_talisman: { matches: ["warding talisman", "talisman", "ward", "wtalisman", "protective ward", "pward"], type: "special", maskedType: "item", augmentType: "ability", ability: "protective_ward", specialType: "Warding Talisman", statusType: "Enhancement", name: "Warding Talisman", expiry: "permanent", duplicate: "allow", description: "When this item is obtained, the GM chooses a specific enemy or character classification. So long as the owner possesses this item, grants the Protective Ward ability. This ability can only be used once, after which the talisman loses its power and has no further effect." },
        weak: { matches: ["weak"], type: "weak", maskedType: "weak", name: "Weak", statusType: "Enfeeblement", expiry: "rest", duplicate: "block", description: "A Weakened character incurs a -2 penalty on all checks. If you are afflicted with Weakness from another effect, you are instead afflicted with Brink of Death.\n\nWeakness can only be removed by completing a rest or by effects that specifically remove it." }
    };

    this.matches = Object.values(this.effects);

    this.expiries = {
        encounterstart: "Start of an encounter",
        stepstart: "Start of the [Adventurer Step]",
        start: "Start of your turn",
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

    this.icon = function (effect) {
        if (!effect || effect.type == "none") {
            return "";
        }

        if (effect.maskedType == "augment") {
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/augment.png`;
        }

        if (effect.type === "special" && effect.specialType) {
            let imageName = effect.specialType.toLowerCase().replaceAll("'", "").replaceAll(" ", "-");
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
        }

        let imageName = effect.type.replace("(x)", "-x");
        return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`;
    };

    this.hoverDescription = function (name, value, expiry, curable) {
        var descriptions = [];
        if (value) {
            descriptions.push(`${name.replace("(X)", `(${value.toUpperCase()})`)}`);
        } else {
            descriptions.push(name);
        }
        descriptions.push(`expires ${this.expiries[expiry]}`);
        if (curable === "on") {
            descriptions.push("can be cured");
        }

        return descriptions.join(", ");
    };
};

const effectData = new EffectData();
this.export.EffectData = EffectData;
this.export.effectData = effectData;

// Build (version 1.0.0): Source/mods/../common/effectUtilities.js


const EffectUtilities = function() {
    
    this.searchableName = function(name) {
        if (!name) {
            return "";
        }
        return name
            .replaceAll(/(\([-|\s\w]+\))|(\[[-+><=\w]+\])|'/g, "")
            .replaceAll(" ", "_")
            .trim().toLowerCase();
    };
    
    this.classify = function(effects) {
        var result = {
            effects: [],
            criticalThreshold: 20
        };
        for (var effect of effects) {
            let adjustedName = this.searchableName(effect.specialType || effect.type);
            if (!adjustedName) {
                continue;
            }
            effect.adjustedName = adjustedName;
            effect.data = effectData.effects[adjustedName];
            result.effects.push(effect);

            switch (effect.data.maskedType || effect.type) {
                case "augment":
                    if (effect.specialType.trim().toLowerCase() == "aetherial focus") {
                        result.mpMaxIncrease = true;
                    }
                    break;
                case "critical(x)":
                    if (effect.value) {
                        result.criticalThreshold -= parseInt(effect.value);
                    }
                    break;
                case "damage":
                    if (result.damageRerolls) {
                        result.damageRerolls.push(effect.data.name);
                    } else {
                        result.damageRerolls = [effect.data.name];
                    }
                    break;
                case "ddown(x)":
                case "dps(x)":
                    if (result.dpsChanges) {
                        result.dpsChanges.push(effect);
                    } else {
                        result.dpsChanges = [effect];
                    }
                    log("dpsChanges: " + JSON.stringify(result.dpsChanges));
                    break;
                case "silence":
                    result.isSilenced = true;
                    break;
                case "stun":
                    result.isStunned = true;
                    break;
                default:
                    break;
            }
            if (effect.type == "special") {
                switch (effect.specialType.trim().toLowerCase()) {
                    case "astral fire":
                        result.astralFire = effect;
                        break;
                    case "hawk's eye":
                        result.hawksEye = effect;
                        break;
                    case "surging tempest":
                        result.surgingTempest = effect;
                        break;
                    case "umbral ice":
                        result.umbralIce= effect;
                        break;
                    default:
                        break;
                }
            }
        }
        return result;
    };
};

const effectUtilities = new EffectUtilities();
this.export.EffectUtilities = EffectUtilities;
this.export.effectUtilities = effectUtilities;

// Build (version 1.0.0): Source/mods/common/modengine.js


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

const ModEngine = function(logger, character) {
    this.name = "ModEngine";
    this.logger = logger;
    this.character = character;
    if (!this.character) {
        logger.i("Character must be specified for mods");
    }

    this.set = function(attributes) {
        for (let attribute of Object.entries(attributes)) {
            let name = attribute[0];
            let value = attribute[1];
            if (value === undefined || value === null) {
                this.logger.i("Undefined value encountered for " + name);
                continue;
            }

            if (name.endsWith("_max")) {
                let baseName = name.remove("_max");
                let actionableAttribute = unpackAttribute(this.character, baseName);
                setAttribute(actionableAttribute, "max", value);
            } else {
                let actionableAttribute = unpackAttribute(this.character, name);
                setAttribute(actionableAttribute, "current", value);
            }
            this.logger.d("Set " + name + " to " + value);
        }
    };

    this.get = function(attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        var attributesToFind = attributes.filter(attribute => !attribute.endsWith("_max"));
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let index = attributesToFind.indexOf(name);
                if (index > -1) {
                    attributesToFind.splice(index, 1);
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    accumulator[name] = value;
                    if (max) {
                        accumulator[`${name}_max`] = max;
                    }
                }
                return accumulator;
            },
            { }
        );
        for (let remainingAttribute of attributesToFind) {
            filteredAttributes[remainingAttribute] = undefined;
        }
        completion(filteredAttributes);
    };

    this.getAttrsAndEffects = function(attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let match = currentValue.get("name").match(/^repeating_effects_([-\w]+)_([\w_]+)$/);
                if (match) {
                    let id = match[1];
                    let effectAttributeName = match[2];
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    if (!accumulator.effects[id]) {
                        accumulator.effects[id] = {
                            id: id,
                            fullId: `repeating_effects_${id}`,
                            _vars: []
                        };
                    }
                    accumulator.effects[id][effectAttributeName] = value;
                    if (max) {
                        accumulator.effects[id][`${effectAttributeName}_max`] = max;
                    }
                    accumulator.effects[id]._vars.push(currentValue);
                } else if (attributes.includes(name)) {
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    accumulator.values[name] = value;
                    if (max) {
                        accumulator.values[`${name}_max`] = max;
                    }
                }
                return accumulator;
            },
            { effects: {}, values: {} }
        );
        let effects = Object.values(filteredAttributes.effects);
        completion(filteredAttributes.values, effectUtilities.classify(effects));
    };

    this.getSectionValues = function(section, attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let match = currentValue.get("name").match(new RegExp(`^repeating_${section}_([-\\w]+)_([\\w_]+)$/`));
                if (match) {
                    let id = match[1];
                    let attributeName = match[2];
                    let value = currentValue.get("current");
                    let max = currentValue.get("max");
                    if (!accumulator[id]) {
                        accumulator[id] = {
                            id: id,
                            fullId: `repeating_${section}_${id}`,
                            _vars: []
                        };
                    }
                    accumulator[id][attributeName] = value;
                    if (max) {
                        accumulator[id][`${attributeName}_max`] = max;
                    }
                    accumulator[id]._vars.push(currentValue);
                } else {
                    return accumulator;
                }
            },
            { }
        );
        let items = Object.values(filteredAttributes);
        completion(items);
    };

    this.remove = function(object) {
        if (object._vars) {
            for (let attribute of object._vars) {
                attribute.remove();
            }
        } else {
            this.logger.i("Attempted to remove an unremovable variable: " + JSON.stringify(object));
        }
    };

    this.generateId = function() { 
        return generateUUID().replace(/_/g, "Z"); 
    };

    this.logi = function(value) {
        this.logger.i(value);
    };

    this.logd = function(value) {
        this.logger.d(value);
    };
};

const engine = null;
this.export.ModEngine = ModEngine;
this.export.engine = engine;

// Build (version 1.0.0): Source/mods/common/modutilities.js


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

this.export.unpackAttribute = unpackAttribute;
this.export.setAttribute = setAttribute;

// Build (version 1.0.0): Source/mods/../common/addEffects.js


const EffectState = function(hitPoints, hitPoints_max, barrierPoints, dice, existingEffects) {
    this.hitPoints = hitPoints;
    this.hitPoints_max = hitPoints_max;
    this.barrierPoints = barrierPoints;
    this.dice = dice;
    this.existingEffects = existingEffects;

    this.existingEffectTypes = existingEffects.effects.map(effect => {
        return effect.adjustedName;
    });
};

const AddEffects = function(customEngine, customRemove) {
    this.customEngine = customEngine;
    this.customRemove = customRemove;

    this.engine = function() {
        return this.customEngine ?? engine;
    };

    this.removeEffects = function() {
        return this.customRemove ?? removeEffects;
    };

    this.addBySpecificationString = function(state, effects) {
        let builtEffects = effects.map(effect => this.effectFromSpecification(effect));
        return this.add(state, builtEffects);
    };
    
    this.add = function(state, effects) {
        var attributes = {};
        var summaries = [];

        this.engine().logd("Adding effects");
        for (let effect of effects) {
            if (!effect) {
                continue;
            }
            if (!this.matchesCondition(state, effect)) {
                this.engine().logi("Condition not fulfilled; skipping effect " + effect.adjustedName);
                continue;
            }

            let replacement = this.replacementEffect(state, effect);
            if (!replacement.valid) {
                this.logi("Discarding effect " + effect.adjustedName + ", invalid replacement");
                continue;
            }
            let adjustedEffect = replacement.effect;
            let data = adjustedEffect.data;
            if (!data) {
                this.engine().logi("Unhandled effect " + adjustedEffect);
                continue;
            }
            let duplicatesResult = this.resolveDuplicates(state, adjustedEffect);
            if (!duplicatesResult.result) {
                continue;
            }
            summaries = summaries.concat(duplicatesResult.summaries);

            var value = null;
            if (adjustedEffect.value) {
                value = adjustedEffect.value;
            } else if (effect.specification) {
                let match = effect.specification.match(/\(([-|\s\w]+)\)/);
                if (match && match.length >= 2) {
                    value = match[1];
                }
            }

            let initValues = {
                id: this.engine().generateId(),
                type: data.type,
                specialType: data.specialType,
                statusType: data.statusType,
                value: value,
                source: adjustedEffect.source ?? "Self",
                description: data.description,
                expiry: adjustedEffect.expiry ?? data.expiry,
                curable:  adjustedEffect.curable ?? (data.curable ? "on" : "off")
            };

            let specialEffectResult = this.resolveSpecialEffects(state, initValues.id, adjustedEffect, value);
            summaries = summaries.concat(specialEffectResult.summaries.filter(element => element));
            if (specialEffectResult.skip) {
                this.engine().logi("Skipping ephemeral effect " + adjustedEffect.adjustedName);
                continue;
            }

            attributes = specialEffectResult.attributes;
            attributes[`repeating_effects_${initValues.id}_type`] = initValues.type;
            if (initValues.specialType) {
                attributes[`repeating_effects_${initValues.id}_specialType`] = initValues.specialType;
            }
            if (initValues.value) {
                attributes[`repeating_effects_${initValues.id}_value`] = initValues.value;
            }
            attributes[`repeating_effects_${initValues.id}_icon`] = effectData.icon(data);
            attributes[`repeating_effects_${initValues.id}_statusType`] = initValues.statusType;
            attributes[`repeating_effects_${initValues.id}_expiry`] = initValues.expiry;
            attributes[`repeating_effects_${initValues.id}_source`] = initValues.source;
            attributes[`repeating_effects_${initValues.id}_description`] = initValues.description;
            attributes[`repeating_effects_${initValues.id}_curable`] = initValues.curable;
            attributes[`repeating_effects_${initValues.id}_editable`] = "off";
            attributes[`repeating_effects_${initValues.id}_origin`] = "automatic";
            attributes[`repeating_effects_${initValues.id}_effectsExpandItem`] = "on";
            attributes[`repeating_effects_${initValues.id}_name`] = effectData.hoverDescription(data.name, initValues.value, initValues.expiry, initValues.curable);

            if (duplicatesResult.summaries.length === 0) {
                summaries.push(`Activated ${data.name.replace("(X)", initValues.value)}`);
            }
        }
        if (Object.keys(attributes).length > 0) {
            this.engine().set(attributes);
        }
        return summaries.join(", ");
    };

    this.resolveAttributes = function(id, effectName, value) {
        this.engine().logd("Resolving attributes " + effectName);
        switch (effectName) {
            case "attribute": {
                this.engine().logd("Resolving attributes for attribute(x)");
                if (!value) {
                    // Unable to deal with this until value has been set
                    return;
                }
                let definition = value.split(",");
                if (!definition) {
                    log("Invalid value " + value);
                    return;
                }
                let attributeName = definition[0];
                let attributeValue;
                if (definition[1]) {
                    attributeValue = unpackNaN(definition[1].trim(), 1);
                } else {
                    attributeValue = 1;
                }
                this.engine().get([`${attributeName}`, `${attributeName}Effective`, `${attributeName}Override`, `${attributeName}Unblocked`], values => {
                    var attributes = {};
                    let baseAttributeName;
                    let isBlocked = unpackNaN(values[`${attributeName}Override`], 0) > 0;
                    if (isBlocked) {
                        baseAttributeName = `${attributeName}Unblocked`;
                    } else {
                        baseAttributeName = `${attributeName}Effective`;
                    }

                    let currentValue = unpackNaN(values[`${baseAttributeName}`], 0);
                    let rawValue = unpackNaN(values[attributeName]);
                    let newValue = currentValue + attributeValue;
                    this.engine().logd(`${attributeName}: ${newValue}, unblocked: ${values[`${attributeName}Unblocked`]}`);
                    attributes[`repeating_effects_${id}_attribute`] = attributeName;
                    attributes[`repeating_effects_${id}_attributeValue`] = attributeValue;
                    
                    attributes[baseAttributeName] = newValue;
                    if (!isBlocked) {
                        let bottomValue = Math.min(rawValue, 0);
                        attributes[`${attributeName}Display`] = Math.max(newValue, bottomValue);
                    }
                    this.engine().logd(`Setting ${baseAttributeName} to ${newValue}`);
                    this.engine().set(attributes);
                });
                break;
            }
            case "bound": {
                this.engine().logd("Resolving attributes for bound");
                this.engine().get(["size", "speed", "speedEffective", "speedOverride", "speedUnblocked"], values => {
                    let speed = unpackNaN(values.speedEffective, 0);
                    let unblocked = unpackNaN(values.speedUnblocked ?? values.speed, 0);
                    let newValue;
                    let diff;
                    if (values.size === "large") {
                        newValue = Math.max(speed - 2, 0);
                        unblocked = Math.max(unblocked - 2, 0);
                        diff = 2;
                    } else {
                        newValue = -99;
                        diff = speed - newValue;
                        unblocked -= diff;
                    }

                    var attributes = {};
                    if (unpackNaN(values.speedOverride, 0) > 0) {
                        attributes.speedUnblocked = unblocked;
                    }
                    this.engine().logd(`speed: ${newValue}, unblocked: ${attributes.speedUnblocked}`);
                    let rawValue = unpackNaN(values.speed);
                    let bottomValue = Math.min(rawValue, 0);
                    attributes.speedEffective = newValue;
                    attributes.speedDisplay = Math.max(newValue, bottomValue);
                    attributes[`repeating_effects_${id}_attribute`] = "speed";
                    attributes[`repeating_effects_${id}_attributeValue`] = -diff;
                    this.engine().set(attributes);
                });
                break;
            }
            case "defenders_boon": {
                this.engine().logd("Resolving attributes for Defender's Boon");
                let attributeValue;
                if (value) {
                    attributeValue = unpackNaN(value.trim(), 1);
                } else {
                    attributeValue = 1;
                }
                this.engine().get(["defense", "magicDefense"], values => {
                    let defense = unpackNaN(values.defense, 0);
                    let magicDefense = unpackNaN(values.magicDefense, 0);
                    let attributeName;
                    let newValue;
                    let rawValue;
                    if (defense === magicDefense) {
                        // Do nothing
                        return;
                    } else if (defense < magicDefense) {
                        attributeName = "defense";
                        newValue = defense + attributeValue;
                        rawValue = defense;
                    } else if (magicDefense < defense) {
                        attributeName = "magicDefense";
                        newValue = magicDefense + attributeValue;
                        rawValue = magicDefense;
                    }

                    let bottomValue = Math.min(rawValue, 0);
                    var attributes = {};
                    attributes[`${attributeName}Effective`] = newValue;
                    attributes[`${attributeName}Display`] = Math.max(newValue, bottomValue);
                    attributes[`repeating_effects_${id}_attribute`] = attributeName;
                    attributes[`repeating_effects_${id}_attributeValue`] = attributeValue;
                    log(`Setting ${attributeName} to ${newValue}`);
                    this.engine().set(attributes);
                });
                break;
            }
            case "slow":
            case "heavy": {
                this.engine().logd(`Resolving attributes for ${effectName}`);
                this.engine().get(["speed", "speedEffective", "speedOverride", "speedOverrideSources", "speedUnblocked"], values => {
                    let speed = unpackNaN(values.speed, 0);
                    let newValue = Math.floor(speed / 2) + speed % 2;
                    let diff = speed - newValue;
                    var attributes = {};
                    if (unpackNaN(values.speedOverride, 0) > 0) {
                        log(`Speed was already blocked when activating ${effectName}`);
                        attributes.speedOverrideSources = unpackNaN(values.speedOverrideSources, 1) + 1;
                    } else {
                        attributes.speedOverride = newValue;
                        attributes.speedOverrideSources = 1;
                        attributes.speedUnblocked = values.speedEffective;

                        log(`speed: ${newValue}, unblocked: ${attributes.speedUnblocked}`);
                        let effectiveValue = Math.min(newValue, values.speedEffective - diff);
                        let bottomValue = Math.min(speed, 0);
                        attributes.speedEffective = effectiveValue;
                        attributes.speedDisplay = Math.max(effectiveValue, bottomValue);
                    }
                    attributes[`repeating_effects_${id}_attribute`] = "speed";
                    attributes[`repeating_effects_${id}_attributeValue`] = -diff;
                    this.engine().set(attributes);
                });
                break;
            }
        }
    };

    this.resolveAbilities = function(adjustedName, value = "") {
        let data = effectData.effects[adjustedName];
        if (!data || !data.ability) {
            return;
        }

        let abilityDefinition = effectData.abilities[data.ability];
        if (!abilityDefinition) {
            return;
        }
        var attributes = {};
        for (let section of Object.entries(abilityDefinition)) {
            for (let ability of section[1]) {
                log("Generating effect ability " + ability.title);
                let id = this.engine().generateId();
                for (let entry of Object.entries(ability)) {
                    var attributeValue = entry[1];
                    if (value && attributeValue && isNaN(attributeValue)) {
                        attributeValue = attributeValue.replace("{value}", value);
                    }
                    attributes[`repeating_${section[0]}_${id}_${entry[0]}`] = attributeValue;
                }
                attributes[`repeating_${section[0]}_${id}_repeatingOverride`] = "auto";
                attributes[`repeating_${section[0]}_${id}_augment`] = "1";
            }
        }
        this.engine().set(attributes);
    };

    this.resolveDuplicates = function(state, effect) {
        if (effect.data.duplicate === "block" && state.existingEffectTypes.includes(effect.adjustedName)) {
            this.engine().logd("Effect " + effect.name + " already exists, skipping");
            return { result: false, summaries: [] };
        }

        var summaries = [];
        if (effect.data.duplicate == "replace") {
            for (let replacable of state.existingEffects.effects) {
                if (replacable.type == effect.data.type && replacable.specialType == effect.data.specialType) {
                    summaries.push(`Reactivated ${effect.data.specialType ?? effect.data.type}`);
                    this.engine().remove(replacable);
                }
            }
        }
        return { result: true, summaries: summaries };
    };

    this.resolveSpecialEffects = function(state, id, effect, value) {
        var attributes = {};
        var summaries = [];
        let skip = effect.data.expiry === "ephemeral";

        this.resolveAbilities(effect.adjustedName);
        this.resolveAttributes(id, effect.adjustedName, value);

        switch (effect.adjustedName) {
            case "astral_fire":
                // Clear MP recovery
                attributes.mpRecoveryBlock = "on";

                // Remove Umbral Ice
                if (state.existingEffects.umbralIce) {
                    summaries.push("Removed Umbral Ice");
                    this.engine().remove(state.existingEffects.umbralIce);
                }
                summaries.push(this.addBySpecificationString(state, ["Thunderhead Ready"]));
                break;
            case "barrier":
                this.engine().set({
                    barrierPoints: Math.max(state.barrierPoints ?? 0, parseInt(value))
                });
                summaries.push(`Granted ${value} HP barrier`);
                break;
            case "clear_enfeeblements":
            case "transcendent": {
                this.engine().logd("Clearing all enfeeblements");
                for (let existingEffect of state.existingEffects.effects) {
                    if (existingEffect.statusType.trim().toLowerCase() === "enfeeblement") {
                        this.engine().logd(`Clearing ${existingEffect.data.name}`);
                        this.removeEffects().remove(existingEffect);
                    }
                }
                break;
            }
            case "consume": {
                let specification = value.split("|");
                let item = specification[0].trim();
                var effectValue = "";
                if (specification.length > 1) {
                    effectValue = specification[1];
                }

                // Consume item
                this.engine().logd("Consuming item");
                summaries.push(`Consumed item ${item}`);
                let itemAttributes = ["title", "effect", "count"];
                this.engine().getSectionValues("items", itemAttributes, items => {
                    for (let existingItem of items) {
                        let title = existingItem.title.trim();
                        let itemDescription = existingItem.effect;
                        if (effectValue && !itemDescription.toLowerCase().includes(effectValue.toLowerCase())) {
                            continue;
                        }

                        if (item.toLowerCase() !== title.toLowerCase()) {
                            continue;
                        }

                        let count = parseInt(existingItem.count);
                        if (isNaN(count) || count <= 1) {
                            log("Removing item linked to ability");
                            this.engine().remove(item);
                        } else {
                            log("Removing one count of item linked to ability");
                            var newAttributes = {};
                            newAttributes[`repeating_items_${id}_count`] = count - 1;
                            this.engine().set(newAttributes);
                        }
                    }
                });

                // Remove effect
                let adjustedItemName = effectUtilities.searchableName(item);
                for (let existingEffect of state.existingEffects.effects) {
                    let adjustedSpecialType = effectUtilities.searchableName(existingEffect.specialType);
                    if (adjustedSpecialType !== adjustedItemName) {
                        continue;
                    }
                    this.removeEffects().remove(existingEffect);
                }
                break;
            }
            case "comatose":
            case "knocked_out": {
                // Clear all non-permanent/adventure-wide effects
                this.engine().logd(`Clearing all non-permanent/adventure-wide effects from ${effect.type}`);
                for (let existingEffect of state.existingEffects.effects) {
                    if (existingEffect.expiry !== "end" && existingEffect.expiry !== "permanent") {
                        log(`Removing ${existingEffect.data.name}`);
                        this.removeEffects().remove(existingEffect);
                    }
                }
                attributes.mpRecoveryBlock = "on";
                break;
            }
            case "lucid_dreaming":
                attributes.mpRecovery = 3;
                break;
            case "restore": {
                let components = value.split("-");
                let section = components[0].toLowerCase();
                let abilityName = components[1];
                let normalizedName = abilityName.toLowerCase();
                let increment = parseInt(components[2]);
                if (isNaN(increment)) {
                    log("Cannot read value for effect " + effect.adjustedName);
                }

                summaries.push(`Restored ${increment} use(s) of ${abilityName}`);
                this.engine().logd("Restoring uses of " + abilityName);

                let abilityAttributes = ["title", "uses", "uses_max"];
                this.engine().getSectionValues(section, abilityAttributes, abilities => {
                    for (let ability of abilities) {
                        let title = ability.title;
                        if (title.toLowerCase() === normalizedName) {
                            let uses = ability.uses;
                            let max = ability.uses_max;
                            if (uses < max) {
                                this.engine().logd("Restored " + abilityName);
                                var attributes = {};
                                attributes[`repeating_${section}_${id}_uses`] = Math.min(uses + increment, max);
                                this.engine().set(attributes);
                            }
                            return;
                        }
                    }
                    this.engine().logi("Failed to find " + abilityName);
                });
                break;
            }
            case "thrill_of_battle": {
                // Heal by roll total and add a barrier for anything that exceeds max HP
                let result = parseInt(state.dice.damage.result);
                if (isNaN(result)) {
                    this.engine().logi("Invalid dice roll for Thrill of Battle: " + JSON.stringify(state.dice.damage));
                } else {
                    let difference = state.hitPoints_max - state.hitPoints;
                    var hitPointsToAdd = Math.min(result, difference);

                    if (hitPointsToAdd > 0) {
                        var barrierPoints = state.barrierPoints;
                        if (difference > 0) {
                            summaries.push(`Healed ${hitPointsToAdd} HP`);
                        }
                        if (result > difference) {
                            let remainder = result - difference;
                            barrierPoints = Math.max(barrierPoints, remainder);
                            summaries.push(`Added a ${remainder} HP barrier`);
                        }
                        this.engine().set({
                            hitPoints: hitPointsToAdd + state.hitPoints,
                            barrierPoints: barrierPoints
                        });
                    }
                }
                break;
            }
            case "umbral_ice":
                if (state.existingEffects.astralFire) {
                    summaries.push("Removed Astral Fire");
                    this.engine().remove(state.existingEffects.astralFire);

                    // Reset MP recovery
                    attributes.mpRecoveryBlock = "off";
                }
                summaries.push(this.addBySpecificationString(state, ["Thunderhead Ready"]));
                break;
            default:
                break;
        }

        return { attributes: attributes, summaries: summaries, skip: skip };
    };

    this.matchesCondition = function(state, effect) {
        if (!state.dice || !effect.specification) {
            return true;
        }

        let conditionMatch = effect.specification.match(/\[([-+><=\w]+)\]/);
        if (!conditionMatch || conditionMatch.length < 2) {
            return true;
        }

        let operator = conditionMatch[1].match(/[><=]+/)[0];
        let operands = conditionMatch[1].split(operator);
        var value;
        if (operands[0].toLowerCase() == "d") {
            value = state.dice.hit;
        } else {
            this.engine().logi("Unrecognized operand " + operands[0]);
            return false;
        }

        let compareTo = parseInt(operands[1]);
        if (isNaN(value) || isNaN(compareTo)) {
            this.engine().logi("Unrecognized operands " + conditionMatch[1]);
            return false;
        }

        switch (operator) {
            case ">": return value > compareTo;
            case "<": return value < compareTo;
            case ">=": return value >= compareTo;
            case "<=": return value <= compareTo;
            case "=":
            case "==":
                return value == compareTo;
            default:
                this.engine().logi("Unrecognized operator " + operator);
                return false;
        }
    };

    this.replacementEffect = function(state, effect) {
        switch (effect.adjustedName) {
            case "lightweight_refit_proc": {
                let adjustedEffect = this.effectFromSpecification("attribute");
                adjustedEffect.value = "speed,1";
                adjustedEffect.source = effect.source;
                adjustedEffect.expiry = "turn";
                return { effect: adjustedEffect, valid: true };
            }
            case "transpose": {
                let adjustedEffect;
                if (state.existingEffects.astralFire) {
                    this.engine().logd("Replacing effect Transpose with Umbral Ice");
                    adjustedEffect = this.effectFromSpecification("umbral_ice");
                } else if (state.existingEffects.umbralIce) {
                    this.engine().logd("Replacing effect Transpose with Astral Fire");
                    adjustedEffect = this.effectFromSpecification("astral_fire");
                } else {
                    this.engine().logi("Cannot use transpose when missing both astral fire/umbral ice");
                    return { valid: false };
                }
                adjustedEffect.source = effect.source;
                return { effect: adjustedEffect, valid: true };
            }
        }
        return { effect: effect, valid: true };
    };

    this.effectFromSpecification = function(specification) {
        let adjustedName = effectUtilities.searchableName(specification);
        let data = effectData.effects[adjustedName];
        return {
            specification: specification,
            adjustedName: adjustedName,
            data: data
        };
    };
};

const addEffects = new AddEffects();

this.export.EffectState = EffectState;
this.export.AddEffects = AddEffects;
this.export.addEffects = addEffects;

// Build (version 1.0.0): Source/mods/../common/removeEffects.js


const RemoveEffects = function(customEngine) {
    this.customEngine = customEngine;

    this.engine = function() {
        return this.customEngine ?? engine;
    };

    this.remove = function(effect) {
        let adjustedName = effectUtilities.searchableName(effect.specialType || effect.type);
        if (effect.data.ability) {
            this.removeAbility(adjustedName, effect.value);
        }
        this.engine().remove(effect);
        this.resetSpecialEffects(adjustedName);
        this.resetAttributeChanges(adjustedName, effect.attribute, effect.attributeValue);
    };

    this.removeAll = function(names, skipId) {
        this.engine().getEffects(effects => {
            let matches = effects.effects.filter(effect => {
                if (effect.id == skipId) {
                    return false;
                }
                return names.includes(effect.type) || names.includes(effect.specialType.trim().toLowerCase());
            });
            for (let match of matches) {
                this.engine().logd(`Removing effect ${match.id} with the type ${match.specialType || match.type}`);
                this.remove(match);
            }
        });
    };

    this.consumeOnAbility = function(name, condition, effects) {
        var summaries = [];
        for (let effect of effects.effects) {
            let normalizedName = name.toLowerCase();
            let normalizedCondition = condition.toLowerCase();
            let specialType = (effect.specialType ?? "").toLowerCase();
            let maskedType = effect.data.maskedType.toLowerCase();
            let value = (effect.value ?? "").toLowerCase();
            let isReadyType = effect.type == "ready(x)";

            if (!isReadyType && !specialType.includes(" ready") && !maskedType.includes(" ready")) {
                continue;
            }

            if (
                specialType.includes(normalizedName) ||
                normalizedCondition.includes(specialType) ||
                (isReadyType && value == normalizedName) ||
                (isReadyType && normalizedCondition.includes(value))
            ) {
                this.engine().logd("Consuming effect " + JSON.stringify(effect));
                // Consume X Ready
                this.engine().remove(effect);

                let effectName = effect.specialType || effectData.effects[effect.type.replace("(x)", "")].name;
                summaries.push(`Consumed ${(effectName.replace("(X)", effect.value))}`);
            }
        }
        return summaries.join(", ");
    };

    this.resetSpecialEffects = function(name) {
        switch (name) {
            case "astral_fire":
                this.engine().logd("Astral Fire removed; resetting mp recovery");
                this.engine().set({
                    mpRecoveryBlock: "off"
                });
                break;
            case "comatose":
            case "knocked_out":
                this.engine().logd(`${effectData.effects[name].name}; resetting mp recovery`);
                this.engine().set({
                    mpRecoveryBlock: "off"
                });
                break;
            case "lucid_dreaming":
                this.engine().logd("Lucid Dreaming removed; resetting mp recovery");
                this.engine().set({
                    mpRecovery: 2
                });
                break;
            default:
                break;
        };
    };

    this.resetAttributeChanges = function(name, attribute, value, completion) {
        this.engine().logd("Resetting effect attributes for " + attribute);
        let attributeValue = parseInt(value);
        if (!attribute || isNaN(attributeValue)) {
            this.engine().logd("No effect attributes to reset");
            if (completion) {
                completion();
            }
            return;
        }
        this.engine().get([`${attribute}`, `${attribute}Effective`, `${attribute}Override`, `${attribute}OverrideSources`, `${attribute}Unblocked`], values => {
            let baseAttributeName;
            let currentValue;
            let newValue;
            var newAttributes = {};
            this.engine().logd(`${attribute}: ${values[`${attribute}Effective`]}, unblocked: ${values[`${attribute}Unblocked`]}`);
            if (name === "heavy" || name === "slow") {
                let overrideSources = Math.max(unpackNaN(values.speedOverrideSources, 1) - 1, 0);
                newAttributes.speedOverrideSources = overrideSources;
                if (overrideSources === 0) {
                    baseAttributeName = "speedEffective";
                    currentValue = values.speedEffective;
                    newAttributes.speedOverride = 0;
                    newAttributes.speedEffective = values.speedUnblocked;
                    newAttributes.speedDisplay = values.speedUnblocked;
                    this.engine().logd(`Unblocking speed, ${currentValue} -> ${values.speedUnblocked}`);
                }
            } else {
                let isBlocked = unpackNaN(values[`${attribute}Override`]) > 0;
                if (isBlocked) {
                    baseAttributeName = `${attribute}Unblocked`;
                    if (attributeValue < 0) {
                        let rawValue = unpackNaN(values[attribute]);
                        let bottomValue = Math.min(rawValue, 0);
                        let adjustedValue = unpackNaN(values[`${attribute}Effective`], 1000) - attributeValue;
                        let effectiveValue = Math.min(adjustedValue, values.speedOverride);
                        newAttributes[`${attribute}Effective`] = effectiveValue;
                        newAttributes[`${attribute}Display`] = Math.max(effectiveValue, bottomValue);
                    }
                } else {
                    baseAttributeName = `${attribute}Effective`;
                }
                currentValue = unpackNaN(values[baseAttributeName], 0);
                newValue = currentValue - attributeValue;

                if (isNaN(currentValue)) {
                    this.engine().logi(`Unable to reset attribute ${baseAttributeName}, value is not a number: ${values[baseAttributeName]}`);
                    return;
                }
                newAttributes[baseAttributeName] = newValue;
                if (!isBlocked) {
                    let rawValue = unpackNaN(values[attribute]);
                    let bottomValue = Math.min(rawValue, 0);
                    newAttributes[`${attribute}Display`] = Math.max(newValue, bottomValue);
                }
                this.engine().logd(`Resetting ${baseAttributeName}, ${currentValue} - ${attributeValue} = ${newValue}`);
            }
            this.engine().set(newAttributes);
            if (completion) {
                completion();
            }
        });
    };

    this.removeAbility = function(effect, value) {
        let data = effectData.effects[effect];
        if (!data || !data.ability) {
            return;
        }
        let abilityDefinition = effectData.abilities[data.ability];
        if (!abilityDefinition) {
            return;
        }

        this.engine().logd("Removing ability " + JSON.stringify(data));
        // Delete ability
        for (let section of Object.keys(abilityDefinition)) {
            let titles = abilityDefinition[section].map(ability => ability.title);
            let attributeNames = ["title", "type", "augment"];
            this.engine().getSectionValues(section, attributeNames, abilities => {
                for (let ability of abilities) {
                    let title = ability.title;
                    let type = ability.type;
                    let augment = ability.augment;

                    if (value && !type.includes(value)) {
                        continue;
                    }

                    if (augment === "1" && titles.includes(title)) {
                        this.engine().logd("Removed augment ability " + title);
                        this.engine().remove(ability);
                    }
                }
            });
        }
    };
};

const removeEffects = new RemoveEffects();
this.export.RemoveEffects = RemoveEffects;
this.export.removeEffects = removeEffects;


})();

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

    let imports = FFXIVAddEffectImports.export;
    let logger = new imports.Logger(scriptName, true);

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

    const addEffect = (effect, characters, completion) => {
        var summaries = [];

        logger.d(`Adding effect ${effect.typeName} to ${characters.length} character(s)`);
        for (let character of characters) {
            let sheetType = imports.unpackAttribute(character, "sheet_type").get("current");
            if (sheetType !== "unique") {
                logger.i(`Will not add effect; character ${character.get("name")} isn't unique`);
                continue;
            }

            let modEngine = new imports.ModEngine(logger, character);
            let removalHandler = new imports.RemoveEffects(modEngine);
            let addHandler = new imports.AddEffects(modEngine, removalHandler);
            modEngine.getAttrsAndEffects(["hitPoints", "barrierPoints"], (values, effects) => {
                let state = new imports.EffectState(
                    values.hitPoints, 
                    values.hitPoints_max, 
                    values.barrierPoints, 
                    null, 
                    effects
                );
                let summary = addHandler.add(state, [effect]);
                summaries.push(`${summary} on <b>${character.get("name")}</b>`);
            });
        }
        let summary = summaries.join("</li><li>");
        if (summary) {
            summary = `<ul><li>${summary}</li></ul>`;
        }
        completion ({ who: effect.who, summary: summary });
    };

    const outputEvent = (type, event, playerid) => {
        switch (type) {
            case "add": {
                if (!event.summary) {
                    break;
                }
                let prefix;
                if (playerIsGM(playerid)) {
                    prefix = "/w gm ";
                } else {
                    prefix = "";
                }
                sendChat(event.who, `${prefix}<h4>Effects:</h4>${event.summary}`);
                break;
            }

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
        } else if (lastMessage.content === msg.content && lastMessage.who === msg.who) {
            logger.d("Message receipt diff: " + (time - lastMessage.time));
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
            editable: "1",
            target: "selected",
            characters: [],
            player: msg.playerid,
            who: who,
            origin: "FFXIVAddEffect"
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
                    if (imports.effectData.expiryTypes.includes(expiry)) {
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
                        effect.curable = ["1", "on"].includes(parts[1]) ? "on" : "off";
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

                default: {
                    let name = parts.join(" ");
                    let match = imports.effectData.matches.find(type => type.matches && type.matches.includes(name.toLowerCase()));
                    if (!match) {
                        outputEvent("error", "Unknown effect " + name);
                        return;
                    }
                    effect.data = match;

                    let specialType;
                    if (match.type == "special") {
                        specialType = match.specialType;
                        effect.maskedType = match.maskedType;
                        effect.typeName = match.specialType;
                        if (match.ability) {
                            effect.abilities = imports.effectData.abilities[match.ability];
                        }
                    } else {
                        specialType = "";
                        effect.typeName = match.name;
                    }
                    effect.adjustedName = imports.effectUtilities.searchableName(match.specialType ?? match.type);
                    effect.icon = imports.effectData.icon(effect);
                    effect.type = match.type;
                    effect.statusType = match.statusType;
                    effect.specialType = specialType;
                    effect.description = match.description;
                    break;
                }
            }
        }
        if (!effect || !effect.type || effect.type == "none") {
            logger.i("Found no matching effect for " + msg.content);
            return;
        }
        if (!effect.source) {
            logger.i("No source given");
            help();
            return;
        }
        let targetResult = getCharacters(msg, effect.target);
        if (targetResult.error) {
            outputEvent("error", targetResult.error);
            return;
        }

        let characters = targetResult.result;
        addEffect(effect, characters, event => {{
            outputEvent("add", event, msg.playerid);
        }});
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