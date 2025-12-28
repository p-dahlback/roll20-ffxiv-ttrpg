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
        aero: { matches: ["aero"], type: "special", maskedType: "dot(x)", specialType: "Aero", statusType: "Enfeeblement", marker: "aero", name: "Aero", expiry: "phase", curable: true, duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        aethercharge: { matches: ["aethercharge", "acharge"], type: "special", specialType: "Aethercharge", name: "Aethercharge", statusType: "Enhancement", expiry: "turn", duplicate: "block", description: "While under the effect of Aethercharge, Ruin II, Ruin III and Outburst have additional effects."},
        aetherial_focus: { matches: ["afocus", "aetherial focus"], type: "special", maskedType: "augment", specialType: "Aetherial Focus", statusType: "Enhancement", name: "Aetherial Focus", expiry: "end", duplicate: "block", description: "Begin encounters with X MP. This effect does not increase Max MP." },
        addle: { matches: ["addle"], type: "special", maskedType: "ddown", statusType: "Enfeeblement", specialType: "Addle", marker: "addle", name: "Addle", expiry: "turn", description: "Reduces the damage dealt by your abilities." },
        advantage: { matches: ["adv", "advantage"], type: "advantage", maskedType: "advantage", statusType: "Enhancement", name: "Advantage", expiry: "use", description: "Provides an advantage die that can be used once for any ability roll." },
        astral_fire: { matches: ["afire", "astralf", "astral fire"], type: "special", specialType: "Astral Fire", statusType: "Enhancement", name: "Astral Fire", expiry: "turn2", duplicate: "replace", description: "While under the effect of Astral Fire your fire-aspected abilities deal an additional 1d6 damage* and you do not recover MP at the end of the [Adventurer Step].\n\nAstral Fire is removed when you are granted Umbral Ice or, if the effect is not renewed, at the end of your next turn. \n\n*After attaining level 50, this damage increases to 2d6." },
        attribute: { matches: ["attr", "attribute"], type: "attribute(x)", maskedType: "attribute(x)", statusType: "Enhancement", name: "Attribute Up (X)", expiry: "turn", description: "Improves the given attribute by a set value." },
        barrier: { matches: ["barrier"], type: "special", specialType: "Barrier(X)", statusType: "Enhancement", name: "Barrier (X)", expiry: "ephemeral" },
        berserk: { matches: ["berserk"], type: "special", maskedType: "dps(x)", specialType: "Berserk", statusType: "Enhancement", name: "Berserk", expiry: "turn", duplicate: "block", description: "Your abilities deal an additional 2 damage until the end of this turn." },
        bio_ii: { matches: ["bio", "bio ii", "bio2", "bio 2" ], type: "special", maskedType: "dot(x)", specialType: "Bio II", statusType: "Enfeeblement", marker: "bio", name: "Bio II", expiry: "phase", duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        blind: { matches: ["blind"], type: "blind", maskedType: "blind", statusType: "Enfeeblement", marker: "blind", name: "Blind", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot see and automatically fail any checks that rely entirely on vision. You incur a -2 penalty on all checks, and characters receive one advantage die when targeting you." },
        bloodbath: { matches: ["bloodbath"], type: "special", maskedType: "drain", specialType: "Bloodbath", statusType: "Enhancement", name: "Bloodbath", expiry: "turn", duplicate: "bigger", description: "You regain HP each time you deal damage this turn. When using abilities that affect multiple targets or deal multiple instances of damage, HP is recovered for each target damaged or each instance of damage dealt." },
        bound: { matches: ["bind", "bound"], type: "bound", maskedType: "bound", statusType: "Enfeeblement", marker: "bound", name: "Bound", expiry: "encounter", curable: true, duplicate: "block", description: "When Bound, Small and Medium characters' Speed falls to 0, while larger characters' Speed is reduced by 2.\n\nCharacters receive one advantage die when targeting you." },
        brink: { matches: ["brink", "brink of death"], type: "brink", maskedType: "brink", statusType: "Enfeeblement", marker: "brink", name: "Brink of Death", expiry: "rest", duplicate: "block", description: "You take a -5 penalty on all checks. If you are targeted by another effect that inflicts Weak, you are inflicted with Comatose instead.\n\nBrink of Death can only be removed by completing a rest or by effects that specifically remove it." },
        carbuncle: { matches: ["carbuncle"], type: "special", maskedType: "gem", specialType: "Carbuncle", statusType: "Enhancement", marker: "carbuncle", name: "Carbuncle", expiry: "refresh", duplicate: "block", description: "You recover 1 MP when your MP falls to 0. This effect can only be used once per turn." },
        chicken: { matches: ["chicken"], type: "chicken", statusType: "Enfeeblement", marker: "chicken", name: "Chicken", expiry: "turn", duplicate: "replace", description: "You are a chicken." },
        clear_enfeeblements: { matches: ["clear", "cleare", "clear enfeeblements"], type: "special", specialType: "Clear Enfeeblements", statusType: "Enhancement", name: "Clear Enfeeblements", expiry: "ephemeral" },
        coeurl_form: { matches: ["coeurl form", "coeurl", "cform", "monk3", "m3"], type: "special", maskedType: "ready(x)", specialType: "Coeurl Form", statusType: "Enhancement", name: "Coeurl Form", expiry: "turn2", duplicate: "replace", description: "Enables you to perform Snap Punch or Demolish." },
        consume: { matches: ["consume", "consume item"], type: "special", specialType: "Consume(X)", statusType: "Enhancement", name: "Consume (X)", expiry: "ephemeral" },
        comatose: { matches: ["coma", "comatose"], type: "comatose", maskedType: "comatose", statusType: "Enfeeblement", marker: "comatose", name: "Comatose", expiry: "rest", duplicate: "block", description: "A Comatose character is treated as if they were Knocked Out for gameplay purposes.\nComatose can only be removed by spending one full day in a location where appropriate medical treatment is available, as determined by the GM.\n\nA Comatose character has all enhancements and enfeeblements removed. They cannot be granted any enhancements or afflicted with further enfeeblements other than Death." },
        combust: { matches: ["combust"], type: "special", maskedType: "dot(x)", specialType: "Combust", statusType: "Enfeeblement", marker: "combust", name: "Combust", expiry: "phase", curable: true, duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        critical: { matches: ["crit", "critical", "critical up"], type: "critical(x)", maskedType: "critical(x)", statusType: "Enfeeblement", name: "Critical Up (X)", expiry: "use", description: "Reduces the roll needed to score a critical hit by the given value." },
        curecast_focus: { matches: ["ccast", "curecast", "curecast focus"], type: "special", maskedType: "augment", augmentType: "ability", ability: "cure", specialType: "Curecast Focus", statusType: "Enhancement", name: "Curecast Focus", expiry: "end", duplicate: "block", description: "Grants the Cure ability." },
        damage: { matches: ["damage"], type: "special", specialType: "Damage", statusType: "Enfeeblement", name: "Damage", expiry: "ephemeral" },
        ddown: { matches: ["ddown", "damage down"], type: "ddown(x)", maskedType: "ddown(x)", statusType: "Enfeeblement", name: "Damage Down (X)", expiry: "turn", curable: true, description: "Reduces damage dealt by this character's abilities by the given value." },
        dreroll: { matches: ["dreroll", "damage reroll"], type: "dreroll", maskedType: "dreroll", statusType: "Enhancement", name: "Damage Reroll", expiry: "use", description: "Allows the option to re-roll any one damage die. The value of the new roll cannot be further re-rolled and has to be used for the damage calculation." },
        dps: { matches: ["dps", "dup", "damage up"], type: "dps(x)", maskedType: "dps(x)", statusType: "Enhancement", name: "Damage Up (X)", expiry: "turn", duplicate: "allow", description: "Increments all damage dealt by the character's abilities by a given value." },
        darkside: { matches: ["dside", "darkside"], type: "special", specialType: "Darkside", statusType: "Enhancement", name: "Darkside", expiry: "turn2", duplicate: "replace", description: "While under the effect of Darkside, you may spend 2 MP when you score a direct hit on an enemy with a single-target ability to treat any roll of 1. 2, or 3 as if it were a 0 and any roll of 4, 5, or 6 as if it were a 10 when determining damage. Darkside is removed at the end of your next turn it the effect is not renewed." },
        defenders_boon: { matches: ["dboon", "defender's boon", "defenders boon"], type: "special", maskedType: "augment", specialType: "Defender's Boon", statusType: "Enhancement", name: "Defender's Boon", expiry: "end", duplicate: "block", description: "Increases Defense or Magic Defense by 1. This applies to the lower of the two attributes; if they have the same value, this augmentation has no effect." },
        deflecting_edge: { matches: ["edge", "dedge", "deflecting", "deflecting edge"], type: "special", maskedType: "augment", augmentType: "ability", ability: "parry", specialType: "Deflecting Edge", statusType: "Enhancement", name: "Deflecting Edge", expiry: "end", duplicate: "block", description: "Grants the Parry ability." },
        dot: { matches: ["dot"], type: "dot(x)", maskedType: "dot(x)", statusType: "Enfeeblement", marker: "dot", name: "DOT (X)", expiry: "phase", curable: true, duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        elemental_veil: { matches: ["eveil", "eveil1", "eveili", "eveil 1", "eveil i", "elemental veil", "elementail veil 1", "elemental veil i"], type: "special", maskedType: "augment", specialType: "Elemental Veil", statusType: "Enhancement", name: "Elemental Veil", expiry: "end", duplicate: "block", description: "Reduces the damage taken from abilities of one type chosen from the following list by 1: fire-aspected, ice-aspected, wind-aspected, earth-aspected, lightning-aspected, water-aspected. Choose the type when purchasing this augmentation." },
        elemental_veil_ii: { matches: ["eveil2", "eveilii", "eveil 2", "eveil ii", "elemental veil 2", "elemental veil ii"], type: "special", maskedType: "augment", specialType: "Elemental Veil", statusType: "Enhancement", name: "Elemental Veil II", expiry: "end", duplicate: "block", description: "Reduces the damage taken from abilities of three type chosen from the following list by 1: fire-aspected, ice-aspected, wind-aspected, earth-aspected, lightning-aspected, water-aspected. Choose the type(s) when purchasing this augmentation." },
        emerald: { matches: ["emerald", "em"], type: "special", maskedType: "gem", specialType: "Emerald", name: "Emerald", marker: "emerald", statusType: "Enhancement", expiry: "sourceStart", duplicate: "replace",description: "Your gem abilities become wind-aspected and may target two additional characters within 10 squares of you. Your speed increases by 1." },
        enmity: { matches: ["enmity"], type: "enmity(x)", maskedType: "enmity(x)", statusType: "Enfeeblement", marker: "enmity", name: "Enmity (X)", expiry: "turn", duplicate: "replace", description: "For any ability this character makes that does not target the source of the Enmity effect, a penalty of the given value is applied to the ability roll." },
        feint: { matches: ["feint"], type: "special", maskedType: "ddown", statusType: "Enfeeblement", specialType: "Feint", marker: "feint", name: "Feint", expiry: "turn", description: "Reduces the damage dealt by your abilities." },
        fight_or_flight: { matches: ["fflight", "fight or flight"], type: "special", maskedType: "advantage", specialType: "Fight or Flight", statusType: "Enhancement", name: "Fight or Flight", expiry: "turn", duplicate: "block", description: "Grants one advantage die on your next ability check this turn." },
        flamecast_focus: { matches: ["fcast", "flamecast", "flamecast focus"], type: "special", maskedType: "augment", augmentType: "ability", ability: "fire", specialType: "Flamecast Focus", statusType: "Enhancement", name: "Flamecast Focus", expiry: "end", duplicate: "block", description: "Grants the Fire ability." },
        hawks_eye: { matches: ["hawk", "hawke", "heye", "hawkeye", "hawk's eye", "hawks eye"], type: "special", maskedType: "Straight Shot Ready", specialType: "Hawk's Eye", statusType: "Enhancement", name: "Hawk's Eye", expiry: "use", duplicate: "block", description: "While under the effect of Hawk's Eye, you ignore the penalty incurred on ability checks made while Blinded." },
        heal: { matches: ["heal"], type: "special", specialType: "Heal(X)", statusType: "Enhancement", name: "Heal (X)", expiry: "ephemeral" },
        heavy: { matches: ["heavy"], type: "heavy", maskedType: "heavy", statusType: "Enfeeblement", marker: "heavy", name: "Heavy", expiry: "turn", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to their Speed.\n\nAbility checks targeting you automatically result in direct hits." },
        hidden: { matches: ["hidden", "hide"], type: "special", specialType: "Hidden", statusType: "Enhancement", name: "Hidden", expiry: "damage", duplicate: "block", description: "Receive one advantage die on your ability checks. Hidden is removed when you take or deal damage or perform a primary or secondary action." },
        icecast_focus: { matches: ["icast", "icecast", "icecast focus"], type: "special", maskedType: "augment", augmentType: "ability", ability: "ice", specialType: "Icecast Focus", statusType: "Enhancement", name: "Icecast Focus", expiry: "end", duplicate: "block", description: "Grants the Ice ability." },
        improved_padding: { matches: ["ipad", "ipadding", "improved padding"], type: "special", maskedType: "augment", specialType: "Improved Padding", statusType: "Enhancement", name: "Improved Padding", expiry: "end", duplicate: "block", description: "Grants a barrier of 1 HP at the start of the [Adventurer Step]." },
        knocked_out: { matches: ["ko", "kout", "knocked", "knocked out"], type: "knocked_out", maskedType: "knocked_out", name: "Knocked Out", statusType: "Enfeeblement", marker: "ko", expiry: "rest", duplicate: "block", description: "A character that has been Knocked Out is unconscious and cannot perceive their surroundings. They cannot use abilities or perform other actions during their turn.\n\nThey are treated as both Prone and Stunned.\n\nThey cannot recover HP or MP.\n\nKnocked Out can only be removed by effects that specifically remove it.\n\nA character that has been knocked out has all enhancements and enfeeblements removed. They cannot be granted any enhancements or afflicted with further enfeeblements other than Comatose." },
        lance_charge: { matches: ["lance charge", "lcharge"], type: "special", maskedType: "dps(x)", specialType: "Lance Charge", name: "Lance Charge", statusType: "Enhancement", expiry: "turn", duplicate: "bigger", description: "Your abilities deal extra damage until the end of this turn." },
        life_surge: { matches: ["life surge", "lsurge"], type: "special", maskedType: "drain(x)", specialType: "Life Surge", name: "Life Surge", statusType: "Enhancement", expiry: "turn", duplicate: "bigger", description: "You regain HP each time you deal damage this turn. When using abilities that affect multiple targets or deal multiple instances of damage, HP is recovered for each target damaged or each instance of damage dealt.\n\nYou also receive one advantage die on your next ability check this turn." },
        lightweight_refit: { matches: ["refit", "lrefit", "lightweight refit"], type: "special", maskedType: "augment", specialType: "Lightweight Refit", statusType: "Enhancement", name: "Lightweight Refit", expiry: "end", duplicate: "block", description: "Increases Speed by 1 during this character's first turn of an encounter." },
        lucid_dreaming: { matches: ["lucid", "ldreaming", "lucid dreaming"], type: "special", specialType: "Lucid Dreaming", statusType: "Enhancement", name: "Lucid Dreaming", expiry: "step", duplicate: "replace", description: "Recover an additional 1 MP at the end of this round's [Adventurer Step)." },
        mages_ballad: { matches: ["mballad", "mage's ballad", "mages ballad", "mballad"], type: "special", maskedType: "dreroll", specialType: "Mage's Ballad", statusType: "Enhancement", name: "Mage's Ballad", expiry: "use", duplicate: "block", description: "While under the effect of Mage's Ballad, you may reroll a single die when determining the amount of damage dealt by an ability." },
        magic_damper: { matches: ["damper", "mdamper", "magic damper"], type: "special", maskedType: "augment", augmentType: "ability", ability: "aetherwall", specialType: "Magic Damper", statusType: "Enhancement", name: "Magic Damper", expiry: "end", duplicate: "block", description: "Grants the Aetherwall ability." },
        major_arcana: { matches: ["marcana", "major arcana"], type: "special", maskedType: "dreroll", specialType: "Major Arcana", statusType: "Enhancement", name: "Major Arcana", expiry: "turn", duplicate: "replace", description: "While a character is under the effect of Major Arcana, they may reroll a single die of their choosing when determining the amount of damage dealt by an ability. Any die rerolled in this way cannot be rerolled again, and its result must be used.\n\nMajor Arcana is removed when its effect is resolved or at the end of the character's turn." },
        mana_conduit: { matches: ["mconduit", "mana conduit"], type: "special", maskedType: "augment", specialType: "Mana Conduit", statusType: "Enhancement", name: "Mana Conduit", expiry: "end", duplicate: "block", description: "This character may spend 5 MP immediately before making an ability check to increase its total by 1." },
        masterwork_ornamentation: { matches: ["mwork", "masterwork", "ornament", "ornamentation", "masterwork ornamentation"], type: "special", maskedType: "augment", specialType: "Masterwork Ornamentation", statusType: "Enhancement", name: "Masterwork Ornamentation", expiry: "end", duplicate: "block", description: "Grants one advantage die on checks involving speech. This effect cannot be used if the other character is hostile or is unable to see this character." },
        mug: { matches: ["mug", "mugging"], type: "special", maskedType: "matched", matchingType: "mugged", specialType: "Mug", name: "Mug", statusType: "Enhancement", expiry: "start", duplicate: "block", description: "Increases the damage the target takes from abilities by 1." },
        mugged: { matches: ["mugged"], type: "special", specialType: "Mugged", name: "Mugged", marker: "mugged", statusType: "Enfeeblement", expiry: "sourceStart", description: "Increases the damage you take from abilities by 1 until the character who inflicted this status starts their next turn." },
        ninjutsu_cooldown: { matches: ["ninjutsu cooldown", "ncooldown", "ninjutsu"], type: "special", specialType: "Ninjutsu Cooldown", name: "Ninjutsu Cooldown", statusType: "Enhancement", expiry: "turn2", duplicate: "replace", description: "You cannot use Ninjutsu abilities. Ninjutsu Cooldown cannot be removed by effects that remove enfeeblements." },
        opo_opo_form: { matches: ["opo-opo form", "opo", "opo form", "opo opo form", "oform", "monk1", "m1"], type: "special", maskedType: "ready(x)", specialType: "Opo-Opo Form", statusType: "Enhancement", name: "Opo-Opo Form", expiry: "turn2", duplicate: "replace", description: "Enhances Bootshine and Dragon Kick." },
        overheated: { matches: ["overheated", "overheat", "heat"], type: "special", specialType: "Overheated", name: "Overheated", statusType: "Enhancement", expiry: "start", duplicate: "block", description: "While under the effect of Overheated, use the lower of the target's Defense or Magic Defense as the CR for your ability checks." },
        paralyzed: { matches: ["paralysis", "paralyze", "paralyzed"], type: "paralyzed", maskedType: "paralyzed", statusType: "Enfeeblement", marker: "paralyzed", name: "Paralyzed", expiry: "turn", curable: true, duplicate: "block", description: "If you use a Primary ability and roll a 5 or lower for its ability check, Paralysis interrupts the ability, negating it completely. Do not resolve any of its effects or spend any resources." },
        petrified: { matches: ["petrify", "petrified"], type: "petrified", maskedType: "petrified", statusType: "Enfeeblement", marker: "petrified", name: "Petrified", expiry: "turn2", curable: true, duplicate: "block", description: "You cannot act during your turn or use Instant abilities. You incur a -5 penalty on all checks.\n\nCharacters targeting you receive one advantage die on their ability check." },
        power_surge: { matches: ["power surge", "psurge"], type: "special", maskedType: "dps(x)", specialType: "Power Surge", name: "Power Surge", statusType: "Enhancement", expiry: "phase", duplicate: "bigger", description: "Your abilities deal additional damage." },
        precision_opener: { matches: ["popener", "precision opener"], type: "special", maskedType: "augment", specialType: "Precision Opener", statusType: "Enhancement", name: "Precision Opener", expiry: "end", duplicate: "block", description: "Grants one advantage die on the first ability check this character makes during their first turn of an encounter." },
        prone: { matches: ["prone"], type: "prone", maskedType: "prone", statusType: "Enfeeblement", marker: "prone", name: "Prone", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot take standard movement action on you turn unless you spend half your Speed (rounded up) to get back on your feet.\n\nProne characters incur a -2 penalty on all checks.\n\nCharacters targeting you receive one advantage die when making an ability check." },
        raging_strikes: { matches: ["rstrikes", "raging strikes"], type: "special", maskedType: "dps(x)", specialType: "Raging Strikes", statusType: "Enhancement", name: "Raging Strikes", expiry: "turn", duplicate: "block", description: "Your primary abilities deal an additional 2 damage until the end of this turn." },
        raise: { matches: ["raise", "ascend" ], type: "special", specialType: "Raise", statusType: "Enhancement", name: "Raise", expiry: "ephemeral" },
        rampart: { matches: ["rampart"], type: "special", maskedType: "defense(x)", specialType: "Rampart", statusType: "Enhancement", name: "Rampart", expiry: "start", duplicate: "block", description: "Reduces the damage you take from abilities by 2 until the start of your next turn." },
        raptor_form: { matches: ["raptor form", "raptor", "rform", "monk2", "m2"], type: "special", maskedType: "ready(x)", specialType: "Raptor Form", statusType: "Enhancement", name: "Raptor Form", expiry: "turn2", duplicate: "replace", description: "Enables you to perform True Strike, Twin Snakes or Four-Point Fury." },
        ready: { matches: ["ready"], type: "ready(x)", maskedType: "ready(x)", statusType: "Enhancement", name: "(X) Ready", expiry: "use", duplicate: "block", description: "You may use an ability that requires you to be under this enhancement. X Ready is removed after the ability is used." },
        reassemble: { matches: ["reassemble"], type: "special", specialType: "Reassemble", name: "Reassemble", statusType: "Enhancement", expiry: "turn", description: "The next ability you use this turn automatically scores a critical unless it is interrupted or otherwise negated." },
        regen: { matches: ["regen", "revivify"], type: "regen(x)", maskedType: "regen(x)", statusType: "Enhancement", name: "Regen (X)", expiry: "phase", description: "Restores a given amount of HP at the end of the [Adventurer Step]." },
        reprisal: { matches: ["repr", "reprisal"], type: "special", maskedType: "ddown(x)", specialType: "Reprisal", statusType: "Enfeeblement", marker: "reprisal", name: "Reprisal", expiry: "round", duplicate: "block", description: "Reduces the damage you deal with abilities by 2 until the end of this round." },
        restore: { matches: ["restore"], type: "restore(x)", maskedType: "restore(x)", statusType: "Enhancement", name: "Restore uses of Y by (X)", expiry: "ephemeral" },
        restore_magic: { matches: ["restorem", "restore magic"], type: "special", specialType: "Restore Magic", statusType: "Enhancement", name: "Restore Magic", expiry: "ephemeral" },
        roll: { matches: ["roll", "roll up"], type: "roll(x)", maskedType: "roll(x)", statusType: "Enhancement", name: "Increment Ability Roll (X)", expiry: "use", description: "Allows the option to increment the value of an ability roll for purposes of achieving a Direct Hit or a Critical." },
        ruby: { matches: ["ruby"], type: "special", maskedType: "gem", specialType: "Ruby", name: "Ruby", statusType: "Enhancement", expiry: "sourceStart", duplicate: "replace", description: "Your gem abilities become fire-aspected and deal an additional 1d6 damage. When your pet enters a square occupied by an enemy, that enemy takes 1 damage. An enemy can only suffer damage from this effect once per turn." },
        silence: { matches: ["silence"], type: "silence", maskedType: "silence", statusType: "Enfeeblement", marker: "silence", name: "Silence", expiry: "turn", curable: true, duplicate: "block", description: "You cannot use invoked abilities." },
        sleep: { matches: ["sleep"], type: "sleep", maskedType: "sleep", statusType: "Enfeeblement", marker: "sleep", name: "Sleep", expiry: "damage", curable: true, duplicate: "block", description: "You incur a -3 penalty on all checks. Sleep is removed when you take damage.\n\nCharacters may use a Primary action to wake a Sleeping character in an adjacent square." },
        slow: { matches: ["slow"], type: "slow", maskedType: "slow", statusType: "Enfeeblement", marker: "slow", name: "Slow", expiry: "encounter", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to your Speed.\n\nYou incur a -2 penalty on all checks." },
        stun: { matches: ["stun"], type: "stun", maskedType: "stun", statusType: "Enfeeblement", marker: "stun", name: "Stun", expiry: "turn", duplicate: "block", description: "You cannot act during your turn or use Instant abilities.\n\nAny and all markers for which a Stunned character is the creator are removed.\n\nYou incur a -5 penalty to all checks.\n\nCharacters targeting you receive one advantage die on ability checks.\n\nStun cannot be removed by effects that remove enfeeblements.\n\nA character that has been Stunned cannot be Stunned again in the same encounter." },
        unstunnable: { matches: ["unstun", "unstunnable", "stunresist", "stun resistance"], type: "unstunnable", maskedType: "unstunnable", statusType: "Enhancement", name: "Stun Immunity", expiry: "encounter", duplicate: "block", description: "You are immune to Stun effects for this encounter." },
        surging_tempest: { matches: ["stempest", "surging tempest"], type: "special", specialType: "Surging Tempest", statusType: "Enhancement", name: "Surging Tempest", expiry: "encounter", duplicate: "block", description: "While under the effect of Surging Tempest, treat any roll of 1 when determining damage as if it were a 2." },
        transcendent: { matches: ["trans", "transcendent"], type: "transcendent", maskedType: "transcendent", statusType: "Enhancement", name: "Transcendent", expiry: "start", duplicate: "block", description: "You are immune to damage and enfeeblements inflicted by enemy abilities, traits and encounter mechanics. Transcendent is removed at the start of the character's turn or when the character uses an ability." },
        transpose: { matches: ["transpose"], type: "special", specialType: "Transpose", name: "Transpose", expiry: "ephemeral" },
        thrill_of_battle: { matches: ["thrill", "tbattle", "thrill of battle"], type: "special", specialType: "Thrill of Battle", statusType: "Enhancement", name: "Thrill of Battle", expiry: "ephemeral", duplicate: "allow" },
        thunder: { matches: ["thunder"], type: "special", maskedType: "dot(x)", specialType: "Thunder", statusType: "Enfeeblement", marker: "thunder", name: "Thunder", expiry: "phase", curable: true, duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        thunderhead_ready: { matches: ["tready", "thunderhead", "thunderhead ready"], type: "special", maskedType: "ready(x)", specialType: "Thunderhead Ready", statusType: "Enhancement", name: "Thunderhead Ready", expiry: "use", duplicate: "block", description: "Enables one use of a Lightning-aspected ability, such as Thunder or Thunder II." },
        topaz: { matches: ["topaz"], type: "special", maskedType: "gem", specialType: "Topaz", name: "Topaz", statusType: "Enhancement", expiry: "sourceStart", duplicate: "replace", description: "Your gem abilities become earth-aspected and deal an additional 2 damage. You take 1 less damage from abilities." },
        umbral_ice: { matches: ["uice", "umbral ice"], type: "special", specialType: "Umbral Ice", statusType: "Enhancement", name: "Umbral Ice", expiry: "turn2", duplicate: "replace", description: "While under the effect of Umbral Ice, your ice-aspected abilities restore 5 MP each time they deal damage.\n\nUmbral Ice is removed when you are granted Astral Fire or, if the effect is not renewed, at the end of your next turn." },
        venomous_bite: { matches: ["venom", "vbite", "wbite", "windbite", "venomous bite"], type: "special", specialType: "Venomous Bite", maskedType:"dot(x)", marker: "venomous-bite", statusType: "enfeeblement", name: "Venomous Bite", expiry: "phase", curable: true, duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        warding_talisman: { matches: ["ward", "talisman", "wtalisman", "warding talisman"], type: "special", maskedType: "item", augmentType: "ability", ability: "protective_ward", specialType: "Warding Talisman", statusType: "Enhancement", name: "Warding Talisman", expiry: "permanent", duplicate: "allow", description: "When this item is obtained, the GM chooses a specific enemy or character classification. So long as the owner possesses this item, grants the Protective Ward ability. This ability can only be used once, after which the talisman loses its power and has no further effect." },
        weak: { matches: ["weak", "weakness"], type: "weak", maskedType: "weak", name: "Weak", statusType: "Enfeeblement", marker: "weak", expiry: "rest", duplicate: "block", description: "A Weakened character incurs a -2 penalty on all checks. If you are afflicted with Weakness from another effect, you are instead afflicted with Brink of Death.\n\nWeakness can only be removed by completing a rest or by effects that specifically remove it." }
    };

    this.matches = Object.values(this.effects);

    this.expiries = {
        encounterstart: "Start of an encounter",
        stepstart: "Start of the [Adventurer Step]",
        start: "Start of your turn",
        start2: "Start of your turn next round",
        sourceStart: "Start of the originator's turn",
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
        damage: "On damage",
        refresh: "Refreshes each turn"
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
        if (expiry === "refresh") {
            descriptions.push("refreshes each turn");
        } else {
            descriptions.push(`expires ${this.expiries[expiry]}`);
        }
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
            .replaceAll(/[ -]/g, "_")
            .trim().toLowerCase();
    };

    this.isEffectOfType = function(effect, type) {
        let fullType = effect.type.toLowerCase();
        return fullType.includes(type.toLowerCase());
    };
    
    this.classify = function(effects) {
        var result = {
            effects: [],
            abilityAdvantages: [],
            damageRerolls: [],
            dpsChanges: [],
            expireOnHitRoll: [],
            expireOnPrimaryUse: [],
            expireOnSecondaryUse: [],
            notifyProcs: [],
            readyEffects: []
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
                case "advantage":
                    result.abilityAdvantages.push(effect);
                    result.expireOnHitRoll.push(effect);
                    break;
                case "augment":
                    if (effect.specialType.trim().toLowerCase() == "aetherial focus") {
                        result.mpMaxIncrease = true;
                    }
                    break;
                case "brink":
                    result.isBrink = true;
                    break;
                case "critical(x)":
                    if (effect.value) {
                        result.criticalThreshold -= parseInt(effect.value);
                    }
                    break;
                case "ddown(x)":
                case "dps(x)":
                    result.dpsChanges.push(effect);
                    break;
                case "dreroll":
                    result.damageRerolls.push(effect.data.name);
                    break;
                case "gem":
                    result.gemEffect = effect;
                    break;
                case "ready":
                    result.readyEffects.push(effect);
                    break;
                case "silence":
                    result.isSilenced = true;
                    break;
                case "stun":
                    result.isStunned = true;
                    break;
                case "weak":
                    result.isWeak = true;
                    break;
                default:
                    break;
            }
            if (effect.type == "special") {
                switch (effect.specialType.trim().toLowerCase()) {
                    case "astral fire":
                        result.astralFire = effect;
                        break;
                    case "coeurl form":
                    case "opo-opo form":
                    case "raptor form":
                        result.monkForm = effect;
                        break;
                    case "hawk's eye":
                        result.hawksEye = effect;
                        break;
                    case "hidden":
                        result.abilityAdvantages.push(effect);
                        result.expireOnPrimaryUse.push(effect);
                        result.expireOnSecondaryUse.push(effect);
                        break;
                    case "overheated":
                        result.notifyProcs.push("Overheated proc: Target the lowest CR");
                        break;
                    case "reassemble":
                        result.expireOnHitRoll.push(effect);
                        result.criticalThreshold = 0;
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

    //#region Interface
    this.set = function(attributes) {
        for (let attribute of Object.entries(attributes)) {
            let name = attribute[0];
            let value = attribute[1];
            if (value === undefined || value === null) {
                this.logger.i("Undefined value encountered for " + name);
                continue;
            }

            if (name.endsWith("_max")) {
                let baseName = name.replace("_max", "");
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
        let filteredAttributes = this.getFilteredAttributesAndEffects(attributes);
        let effects = Object.values(filteredAttributes.effects);
        completion(filteredAttributes.values, effectUtilities.classify(effects));
    };

    this.getEffects = function(completion) {
        this.getAttrsAndEffects([], (_, effects) => {
            completion(effects);
        });
    };

    this.getSectionValues = function(sections, attributes, completion) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        let filteredAttributes = allAttributes.reduce(
            (accumulator, currentValue) => {
                let match = currentValue.get("name").match(/^repeating_([-\w]+)_([-\w]+)_([\w_]+)$/);
                if (match) {
                    let section = match[1];
                    if (!sections.includes(section)) {
                        return accumulator;
                    }

                    let id = match[2];
                    let attributeName = match[3];
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

    this.removeEffectById = function(id) {
        this.getEffect(id, effect => {
            if (!effect) {
                this.logi("Couldn't find effect to remove");
                return;
            }
            this.remove(effect);
        });
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
    //#endregion

    //#region Helpers
    this.getEffect = function(id, completion) {
        let filteredAttributes = this.getFilteredAttributesAndEffects([], [id]);
        let effects = Object.values(filteredAttributes.effects);
        if (!effects || effects.length == 0) {
            completion(null);
            return;
        }
        if (effects.length > 1) {
            this.logi("Unexpectedly found more than one effect");
        }
        completion(effects[0]);
    };

    this.getFilteredAttributesAndEffects = function(attributeNames, effectIds = []) {
        let allAttributes = findObjs({ type: "attribute", characterid: this.character.id });
        return allAttributes.reduce(
            (accumulator, currentValue) => {
                let name = currentValue.get("name");
                let match = currentValue.get("name").match(/^repeating_effects_([-\w]+)_([\w_]+)$/);
                if (match) {
                    let id = match[1];
                    if (effectIds.length > 0 && !effectIds.includes(id)) {
                        // Skipping effect
                        return accumulator;
                    }

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
                } else if (attributeNames.includes(name)) {
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
    };
    //#endregion
};

const engine = null;
this.export.ModEngine = ModEngine;
this.export.engine = engine;

// Build (version 1.0.0): Source/mods/common/effectcache.js


const TokenEffectData = function(id, marker=null, managed=true) {
    this.id = id;
    this.marker = marker;
    this.managed = managed;
};

const TokenEffects = function(logger, token, obj=null) {
    this.getStatusMarkers = function() {
        let statusmarkers = this.token.get("statusmarkers");
        if (statusmarkers) {
            return statusmarkers.split(",");
        }
        return [];
    };

    if (obj) {
        Object.assign(this, obj);
        this.logger = logger;
        this.token = token;
    } else {
        this.token = token;
        this.logger = logger;
        this.effectsById = {};

        this.markersToAdd = {};
        this.markerMap = [];

        let currentMarkers = this.getStatusMarkers();
        for (let marker of currentMarkers) {
            this.markerMap.push(new TokenEffectData(null, marker, false));
        }
    }

    this.set = function(id, property, value) {
        let effect;
        if (this.effectsById[id]) {
            effect = this.effectsById[id];
        } else {
            effect = new TokenEffectData(id);
            this.effectsById[id] = effect;
        }
        
        if (property === "type" || property === "specialType") {
            let searchableName = effectUtilities.searchableName(value);
            let data = effectData.effects[searchableName];
            if (data && data.marker) {
                // Created a new status marker
                var markers = this.getStatusMarkers();
                let availableMarkers = JSON.parse(Campaign().get("token_markers") || "[]");
                let markerObject = availableMarkers.find(marker => marker.name === data.marker );
                if (!markerObject) {
                    this.logger.d(`Couldn't find status marker ${data.marker}`);
                } else {
                    let tag = markerObject.tag;
                    markers.push(tag);
                    token.set("statusmarkers", markers.join(","));
                    effect.marker = tag;

                    this.markerMap.push(effect);
                    this.logger.d(`Updated status markers for ${id} - '${markers}'`);
                }
            }
        }
        this.effectsById[id][property] = value;
    };

    this.remove = function(id, stopRecursion=false) {
        this.logger.d("Removing status marker with id " + id);
        var markers = this.getStatusMarkers();
        if (markers.length != this.markerMap.length) {
            this.logger.d("Number of markers is inconsistent");
            this.reconfigureMarkerMap(markers);
        }

        for (let index in this.markerMap) {
            let effect = this.markerMap[index];

            if (effect.marker !== markers[index]) {
                this.logger.d("Marker contents are inconsistent");

                // Reconfigure and rerun operation
                this.reconfigureMarkerMap(markers);
                if (stopRecursion) {
                    this.logger.i(`Couldn't remove marker for effect ${id}; unresolvable inconsistencies with status marker list 
                        (${JSON.stringify(markers)}) vs (${JSON.stringify(this.markerMap)})`);
                    if (this.effectsById[id]) {
                        delete this.effectsById[id];
                    }
                } else {
                    this.remove(id, true);
                }
                return;
            }

            if (effect.id === id) {
                markers.splice(index, 1);
                this.markerMap.splice(index, 1);
                break;
            }
        }
        token.set("statusmarkers", markers.join(","));

        if (this.effectsById[id]) {
            delete this.effectsById[id];
        }
    };

    this.getEffects = function() {
        return this.markerMap;
    };

    this.reconfigureMarkerMap = function(markers=null) {
        this.logger.d("Reconfiguring markers");
        if (!markers) {
            markers = this.getStatusMarkers();
        }
        var managedMarkers = this.markerMap.filter(value => value.managed);
        var newMarkerMap = [];
        let markerNames = managedMarkers.map(m => m.marker);
        for (let marker of markers) {
            this.logger.d(`Compare: ${marker} to ${JSON.stringify(markerNames)}`);
            let foundMatch = false;
            for (let index in managedMarkers) {
                let managedMarker = managedMarkers[index];
                if (marker === managedMarker.marker) {
                    this.logger.d(`Cached marker: ${marker} (${JSON.stringify(managedMarker)})`);
                    newMarkerMap.push(managedMarker);
                    foundMatch = true;

                    // Discard all managed markers up until this match
                    managedMarkers.splice(0, index + 1);
                    break;
                }
            }
            if (!foundMatch) {
                // This marker is unmanaged
                this.logger.d("Unmanaged marker: " + marker);
                newMarkerMap.push(new TokenEffectData(null, marker, false));
            }
        }
        if (managedMarkers.length > 0) {
            for (let leftoverMarker of managedMarkers) {
                if (this.effectsById[leftoverMarker.id]) {
                    this.logger.d("Deleting missing cached effect " + JSON.stringify(leftoverMarker));
                    delete this.effectsById[leftoverMarker.id];
                }
            }
        }
        this.markerMap = newMarkerMap;
        this.logger.d("New state: " + JSON.stringify(newMarkerMap.map(value => { return `${value.marker}` + (value.managed ? "" : "-unmanaged"); })));
    };
};

const EffectCache = function(obj=null) {
    if (obj) {
        Object.assign(this, obj);
    } else {
        this.cacheByToken = {};
    }
    this.logger = new Logger("FFXIVCache", true);

    this.get = function(token) {
        let id = token.get("_id");
        if (!this.cacheByToken[id]) {
            this.cacheByToken[id] = new TokenEffects(this.logger, token);
            return this.cacheByToken[id];
        } else if (this.cacheByToken[id] instanceof TokenEffects) {
            return this.cacheByToken[id];
        } else {
            this.cacheByToken[id] = new TokenEffects(this.logger, token, this.cacheByToken[id]);
            return this.cacheByToken[id];
        }
    };

    this.remove = function(token) {
        let id = token.get("_id");
        if (this.cacheByToken[id]) {
            delete this.cacheByToken[id];
        }
    };
};

this.export.TokenEffectData = TokenEffectData;
this.export.TokenEffects = TokenEffects;
this.export.EffectCache = EffectCache;

// Build (version 1.0.0): Source/mods/common/tokenengine.js


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

    //#region Interface
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

    this.getEffects = function(completion) {
        this.getAttrsAndEffects([], (_, effects) => {
            completion(effects);
        });
    };

    this.getSectionValues = function(sections, attributes, completion) {
        this.modengine.getSectionValues(sections, attributes, completion);
    };

    this.remove = function(object) {
        this.effectCache.remove(object.id);
    };

    this.removeEffectById = function(id) {
        this.effectCache.remove(id);
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
    //#endregion

    //#region Helpers
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
    //#endregion
};

this.export.TokenEngine = TokenEngine;

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
        var effectIds = [];
        for (let effect of effects) {
            if (!effect || !effect.adjustedName) {
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
                this.engine().logi("Unhandled effect " + JSON.stringify(adjustedEffect));
                continue;
            }
            let duplicatesResult = this.resolveDuplicates(state, adjustedEffect);
            if (!duplicatesResult.result) {
                this.engine().logd("Skipping effect due to duplicate");
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
            attributes[`repeating_effects_${initValues.id}_repeatingExpandItem`] = "on";
            attributes[`repeating_effects_${initValues.id}_name`] = effectData.hoverDescription(data.name, initValues.value, initValues.expiry, initValues.curable);
            effectIds.push(initValues.id);

            if (duplicatesResult.summaries.length === 0) {
                summaries.push(`Activated ${data.name.replace("(X)", initValues.value)}`);
            }
        }
        if (Object.keys(attributes).length > 0) {
            this.engine().set(attributes);
        }
        return {
            addedIds: effectIds,
            summary: summaries.join(", ")
        };
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
        } else if (effect.data.duplicate == "bigger") {
            var didReplace = false;
            var hadDuplicate = false;
            for (let replacable of state.existingEffects.effects) {
                if (
                    replacable.type === effect.data.type
                    && replacable.specialType === effect.data.specialType
                    && replacable.source === effect.source
                ) {
                    hadDuplicate = true;
                    if (effect.value > replacable.value) {
                        summaries.push(`Reactivated ${effect.data.specialType ?? effect.data.type}`);
                        this.engine().remove(replacable);
                        didReplace = true;
                    }
                }
            }
            if (hadDuplicate && !didReplace) {
                // Couldn't replace - the effect was blocked.
                this.engine.logd("Skipping effect; already an identical or greater effect from the same source");
                return { result: false, summaries: [] };
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
            case "astral_fire": {
                // Clear MP recovery
                attributes.mpRecoveryBlock = "on";

                // Remove Umbral Ice
                if (state.existingEffects.umbralIce) {
                    summaries.push("Removed Umbral Ice");
                    this.engine().remove(state.existingEffects.umbralIce);
                }
                let result = this.addBySpecificationString(state, ["Thunderhead Ready"]);
                summaries.push(result.summary);
                break;
            }
            case "barrier": {
                let barrierValue = Math.max(parseInt(state.barrierPoints), parseInt(value));
                this.engine().set({
                    barrierPoints: barrierValue,
                    barrierPoints_max: barrierValue
                });
                summaries.push(`Granted ${value} HP barrier`);
                break;
            }
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
            case "coeurl_form":
            case "opo_opo_form":
            case "raptor_form": {
                if (state.existingEffects.monkForm && state.existingEffects.monkForm.adjustedName !== effect.adjustedName) {
                    this.engine().logd("Monk Form to replace: " + JSON.stringify(state.existingEffects.monkForm));
                    summaries.push(`Removed ${state.existingEffects.monkForm.data.name}`);
                    this.engine().remove(state.existingEffects.monkForm);
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
                this.engine().getSectionValues(["items"], itemAttributes, items => {
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
                    if (existingEffect.type === "weak" || existingEffect.type === "brink") {
                        continue;
                    }
                    if (existingEffect.expiry !== "end" && existingEffect.expiry !== "permanent") {
                        log(`Removing ${existingEffect.data.name}`);
                        this.removeEffects().remove(existingEffect);
                    }
                }
                attributes.hitPoints = 0;
                attributes.barrierPoints = 0;
                attributes.mpRecoveryBlock = "on";
                break;
            }
            case "carbuncle":
            case "emerald":
            case "ruby":
            case "topaz": {
                if (state.existingEffects.gemEffect && state.existingEffects.gemEffect.adjustedName !== effect.adjustedName) {
                    this.engine().logd("Gem to replace: " + JSON.stringify(state.existingEffects.gemEffect));
                    summaries.push(`Removed ${state.existingEffects.gemEffect.data.name}`);
                    this.engine().remove(state.existingEffects.gemEffect);
                }
                break;
            }
            case "damage": {
                let damageValue = parseInt(value);
                let barrierDamage = 0;
                let remainingDamage = damageValue;
                let barrierPoints = parseInt(state.barrierPoints);
                let hitPoints = parseInt(state.hitPoints);
                let barrierValue = barrierPoints;
                if (barrierPoints > 0) {
                    barrierDamage = Math.min(barrierPoints, damageValue);
                    barrierValue = barrierPoints - barrierDamage;
                    remainingDamage = damageValue - barrierDamage;
                }
                this.engine().set({
                    barrierPoints: barrierValue,
                    barrierPoints_max: barrierValue,
                    hitPoints: Math.max(hitPoints - remainingDamage, 0)
                });
                summaries.push(`Dealt ${value} damage`);
                break;
            }
            case "heal": {
                let hitPoints = parseInt(state.hitPoints);
                let healValue = parseInt(value);
                let newValue = Math.min(parseInt(state.hitPoints_max), hitPoints + healValue);
                this.engine().set({
                    hitPoints: newValue
                });
                summaries.push(`Granted ${newValue - hitPoints} HP`);
                break;
            }
            case "life_surge": {
                var data = effectData.effects.advantage;
                data.expiry = "turn";
                let turnBasedAdvantage = {
                    type: data.type,
                    value: "1",
                    adjustedName: "advantage",
                    statusType: data.statusType,
                    description: data.description,
                    expiry: "turn",
                    data: data
                };
                turnBasedAdvantage.icon = effectData.icon(turnBasedAdvantage);
                let result = this.add(state, [turnBasedAdvantage]);
                summaries.push(result);
                break;
            }
            case "lucid_dreaming":
                attributes.mpRecovery = 3;
                break;
            case "raise": {
                // Add/upgrade weak status and add transcendent
                let weakness = state.existingEffects.isWeak ? "brink" : "weak";
                let transcendentResult = this.addBySpecificationString(state, ["transcendent"]);
                let weaknessResult = this.addBySpecificationString(state, [weakness]);
                summaries.push(...[transcendentResult.summary, weaknessResult.summary]);
                break;
            }
            case "restore": {
                let components = value.split("-");
                let section = components[0].toLowerCase();
                let sections = [1,2,3].map(index => `${section}${index}`);
                let abilityName = components[1];
                let normalizedName = abilityName.toLowerCase();
                let increment = parseInt(components[2]);
                if (isNaN(increment)) {
                    log("Cannot read value for effect " + effect.adjustedName);
                }

                summaries.push(`Restored ${increment} use(s) of ${abilityName}`);
                this.engine().logd("Restoring uses of " + abilityName);

                let abilityAttributes = ["title", "uses", "uses_max"];
                this.engine().getSectionValues(sections, abilityAttributes, abilities => {
                    for (let ability of abilities) {
                        let title = ability.title;
                        if (title.toLowerCase() === normalizedName) {
                            let uses = ability.uses;
                            let max = ability.uses_max;
                            if (uses < max) {
                                this.engine().logd("Restored " + abilityName);
                                var attributes = {};
                                attributes[`${ability.fullId}_uses`] = Math.min(uses + increment, max);
                                this.engine().set(attributes);
                            }
                            return;
                        }
                    }
                    this.engine().logi("Failed to find " + abilityName);
                });
                break;
            }
            case "restore_magic": {
                let magicPoints = parseInt(state.magicPoints);
                let restoreValue = parseInt(value);
                let newValue = Math.min(parseInt(state.magicPoints_max), magicPoints + restoreValue);
                this.engine().set({
                    magicPoints: newValue
                });
                summaries.push(`Granted ${newValue - magicPoints} MP`);
                break;
            }
            case "thrill_of_battle": {
                // Heal by roll total and add a barrier for anything that exceeds max HP
                let result = parseInt(state.dice.damage.result);
                if (isNaN(result) || result === 0) {
                    this.engine().logi("Invalid dice roll for Thrill of Battle: " + JSON.stringify(state.dice.damage));
                } else {
                    let difference = state.hitPoints_max - state.hitPoints;
                    var hitPointsToAdd = Math.min(result, difference);

                    if (hitPointsToAdd >= 0) {
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
                            barrierPoints: barrierPoints,
                            barrierPoints_max: barrierPoints
                        });
                    }
                }
                break;
            }
            case "umbral_ice": {
                if (state.existingEffects.astralFire) {
                    summaries.push("Removed Astral Fire");
                    this.engine().remove(state.existingEffects.astralFire);

                    // Reset MP recovery
                    attributes.mpRecoveryBlock = "off";
                }
                let result = this.addBySpecificationString(state, ["Thunderhead Ready"]);
                summaries.push(result.summary);
                break;
            }
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
            case "knocked_out": {
                if (state.existingEffects.isBrink) {
                    let adjustedEffect = this.effectFromSpecification("comatose");
                    adjustedEffect.source = effect.source;
                    return { effect: adjustedEffect, valid: true };
                }
                break;
            }
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

    this.removeById = function(id) {
        this.engine().removeEffectById(id);
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

    this.consumeOnAbility = function(damageRoll, effects) {
        var summaries = [];
        if (damageRoll.hitRoll) {
            summaries.push(...this.consumeEffectsInList(effects.expireOnHitRoll));
        }
        if (damageRoll.type.includes("Primary")) {
            summaries.push(...this.consumeEffectsInList(effects.expireOnPrimaryUse));
        } else if (damageRoll.type.includes("Secondary")) {
            summaries.push(...this.consumeEffectsInList(effects.expireOnSecondaryUse));
        }

        // Consume any X ready effects that enable this ability
        for (let effect of effects.readyEffects) {
            if (this.shouldConsumeReadyEffect(effect)) {
                summaries.push(this.consumeEffect(effect));
            }
        }
        return summaries.join(", ");
    };

    this.consumeEffectsInList = function (effects) {
        var summaries = [];
        for (let effect of effects) {
            summaries.push(this.consumeEffect(effect));
        }
        return summaries;
    };

    this.consumeEffect = function (effect) {
        this.engine().logd("Consuming effect " + JSON.stringify(effect));
        this.engine().remove(effect);

        let effectName = effect.specialType || effectData.effects[effect.type.replace("(x)", "")].name;
        return `Consumed ${(effectName.replace("(X)", effect.value))}`;
    };

    this.shouldConsumeReadyEffect = function(damageRoll, effect) {
        let isReadyType = effect.type === "ready(x)" || effect.maskedType === "ready(x)";
        if (!isReadyType) {
            return false;
        }
        let specialType = effect.specialType.toLowerCase();
        let normalizedName = damageRoll.title.toLowerCase();
        let normalizedCondition = damageRoll.condition.toLowerCase();
        let value = (effect.value ?? "").toLowerCase();
        return specialType.includes(normalizedName) ||
               normalizedCondition.includes(specialType) ||
               (isReadyType && value === normalizedName) ||
               (isReadyType && normalizedCondition.includes(value));
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
            this.engine().getSectionValues([section], attributeNames, abilities => {
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

// Build (version 1.0.0): Source/mods/addeffect/addEffectParser.js


const AddEffectParser = function(msg) {
    this.msg = msg;

    this.parseEffectSpecification = function(specificationText) {
        let specifications = specificationText.split(",");
        var effects = [];
        for (let specification of specifications) {
            let effect = {
                id: "-1",
                type: "none",
                statusType: "Enhancement",
                typeName: "",
                specialType: "",
                value: "",
                source: "Self",
                abilities: undefined,
                editable: "1",
                target: "selected",
                characters: [],
                player: this.msg.playerid,
                who: this.msg.who,
                origin: "FFXIVAddEffect"
            };
            let formatMatch = specification.match(/([-'_\s\w]+)(?:[([]([-|\s\w]+)[)\]])?/);
            if (!formatMatch) {
                return {
                    success: false,
                    effects: effects,
                    message: "Malformed effect specification " + specification
                };
            }
            let name = formatMatch[1];
            if (formatMatch.length > 2 && formatMatch[2]) {
                effect.value = formatMatch[2];
            }

            let data = effectData.matches.find(type => type.matches && type.matches.includes(name.toLowerCase()));
            if (!data) {
                return {
                    success: false,
                    effects: effects,
                    message: "Unknown effect" + name
                };
            }
            effect.data = data;

            if (data.specialType) {
                effect.specialType = data.specialType;
                effect.maskedType = data.maskedType;
                effect.typeName = data.specialType;
                if (data.ability) {
                    effect.abilities = effectData.abilities[data.ability];
                }
            } else {
                effect.typeName = data.name;
            }
            effect.adjustedName = effectUtilities.searchableName(data.specialType ?? data.type);
            effect.icon = effectData.icon(effect);
            effect.type = data.type;
            effect.statusType = data.statusType;
            effect.description = data.description;
            effects.push(effect);
        }
        return {
            success: true,
            effects: effects,
            message: null
        };
    };
};

this.export.AddEffectParser = AddEffectParser;

// Build (version 1.0.0): Source/mods/addeffect/addEffectResolver.js



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
                        effect.fullId = `$repeating_effects_${effect.id}`;
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
                characters.push({
                    token: object,
                    character: character
                });
                logger.d("Adding character " + JSON.stringify(character));
            }
            return { result: characters, error: null };
        } else if (target == "mine") {
            let characters = findObjs({ type: "character", controlledby: msg.playerid }).map(value => { return { character: value }; });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters controlled by player");
                return { result: [], error: "No available controlled characters to apply status effects to." };
            }
        } else {
            logger.d("Searching for character " + target);
            let characters = findObjs({ type: "character", name: target }).map(value => { return { character: value }; });
            if (characters) {
                logger.d("Adding characters " + JSON.stringify(characters));
                return { result: characters, error: null };
            } else {
                logger.d("No characters named " + target);
                return { result: [], error: `No characters named ${target}` };
            }
        }
    };

    const outputEvent = (type, who, summary, playerid) => {
        logger.d("Outputting to chat");
        let prefix;
        if (playerIsGM(playerid)) {
            prefix = "/w gm ";
        } else {
            prefix = "";
        }
        switch (type) {
            case "add": {
                if (!summary) {
                    logger.d("Nothing to post; posting an error instead");
                    sendChat("FFXIV Effects", `${prefix}Unable to post add effect summary; no summary found`);
                    break;
                }
                sendChat(who, `${prefix}<h4>Effects:</h4>${summary}`);
                break;
            }

            case "error":
                sendChat(who, `${prefix}${summary}`);
                break;

            default:
                logger.i(`Unrecognized type: ${type}`);
                break;
        }
    };

    const help = () => {
        let helpContent = `<h4>${scriptName} !eos --help</h4>` +
            `<h5>Arguments</h5>` +
            `<li><code>--{effects}</code> - Required: The specification of the effect(s), a comma separated list of effect names and values. <b>Examples:</b> <code>dot(3)</code>, <code>dot(3),stun</code></li>` +
            `</ul>` +
            `<li><code>name</code> - the name of the effect, needs to match any of the available FFXIV effects.</li>` +            
            `<li><code>value</code> Optional - An optional value in parentheses. Required for certain effects.</li>` +
            `<ul>` +
            `<h5>Options</h5>` +
            `<ul>` +
            `<li><code>--help</code> - displays this message in chat.</li>` +
            `<li><code>--clean</code> - cleans out the internal cache for token status markers.<li>` +
            `<li><code>--source {X}</code> - the name of the character that originated the effect, or "Self."</li>` +
            `<li><code>--match {X}</code> - the id of a matching effect on the character that originated this effect. Used to link effects together between two characters./li>` +
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
        let parser = new imports.AddEffectParser(msg);

        var effects = [];
        let target = "selected";

        logger.d("==============================================");
        logger.d("Parsing command " + msg.content);
        logger.d("==============================================");
        for (let a of args) {
            let parts = a.split(/\s+/);
            switch (parts[0].toLowerCase()) {
                case "!ffe":
                    // Do nothing for the API keyword
                    break;
                case "clean":
                    state["FFXIVCache"] = {
                        effects: new imports.EffectCache()
                    };
                    return;
                case "curable":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effects.forEach(effect => effect.curable = ["1", "on"].includes(parts[1]) ? "on" : "off");
                    } else {
                        logger.i("Unrecognized curable type " + parts[1]);
                        return;
                    }
                    break;
                case "edit":
                    if (["0", "1", "on", "off"].includes(parts[1])) {
                        effects.forEach(effect => effect.editable = parts[1]);
                    } else {
                        logger.i("Unrecognized editable type " + parts[1]);
                        return;
                    }
                    break;
                case "expire": {
                    let expiry = parts[1].toLowerCase();
                    if (imports.effectData.expiryTypes.includes(expiry)) {
                        effects.forEach(effect => effect.expiry = expiry);
                    } else {
                        logger.i("Unrecognized expiry type " + expiry);
                        return;
                    }
                    break;
                }
                case "dupe":
                    if (["block", "replace", "allow"].includes(parts[1])) {
                        effects.forEach(effect => effect.duplicate = parts[1]);
                    } else {
                        logger.i("Unrecognized dupe type " + parts[1]);
                        return;
                    }
                    break;
                case "help":
                    help();
                    return;
                case "match":
                    effects.forEach(effect => effect.match = parts[1]);
                    break;
                case "source":
                    effects.forEach(effect => effect.source = parts[1]);
                    break;
                case "t": {
                    let target = parts.slice(1).join(" ");
                    effects.forEach(effect => effect.target = target);
                    break;
                }
                default: {
                    let specificationText = parts.join(" ");
                    let parseResult = parser.parseEffectSpecification(specificationText);
                    if (!parseResult.success) {
                        outputEvent("error", who, parseResult.message, msg.playerid);
                        return;
                    }
                    effects = parseResult.effects;
                    break;
                }
            }
        }
        if (effects.length === 0) {
            logger.i("Found no matching effect for " + msg.content);
            outputEvent("error", who, "Found no matching effect for " + msg.content, msg.playerid);
            return;
        }
        let targetResult = getCharacters(msg, target);
        if (targetResult.error) {
            outputEvent("error", who, targetResult.error, msg.playerid);
            return;
        }

        let characters = targetResult.result;
        let effectCache = new imports.EffectCache(state["FFXIVCache"].effects);
        let resolver = new imports.AddEffectResolver(logger);
        let summary = resolver.add(effects, characters, effectCache);
        state["FFXIVCache"].effects = effectCache;
        outputEvent("add", who, summary, msg.playerid);
    };

    const reconfigureMarkers = (token) => {
        logger.d("Status markers changed for token " + token.get("_id"));
        if (!token.get("represents")) {
            logger.d("No representation for token; cancelling marker update");
            return;
        }
        let character = getObj("character", token.get("represents"));
        let sheetType = imports.unpackAttribute(character, "sheet_type").get("current");
        if (sheetType === "unique") {
            logger.d("Character is unique; no need to update status markers");
            return;
        }

        let effectCache = new imports.EffectCache(state["FFXIVCache"].effects);
        let tokenCache = effectCache.get(token);
        tokenCache.reconfigureMarkerMap();
        state["FFXIVCache"].effects = effectCache;
    };

    const registerEventHandlers = () => {
        on("chat:message", handleInput);
        on("change:graphic:statusmarkers", reconfigureMarkers);
    };

    on("ready", () => {
        state[scriptName] = {
            version: version
        };
        if (!state["FFXIVCache"]) {
            logger.d("Initialising effect cache");
            state["FFXIVCache"] = {
                effects: new imports.EffectCache()
            };
        }
        registerEventHandlers();
    });
})();