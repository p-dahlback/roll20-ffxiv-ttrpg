/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*build:end*/

const EffectData = function() {
    this.effects = {
        aero: { matches: ["aero"], type: "special", maskedType: "dot(x)", specialType: "Aero", statusType: "Enfeeblement", marker: "aero", name: "Aero", expiry: "phase", curable: true, duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        aetherial_focus: { matches: ["afocus", "aetherial focus"], type: "special", maskedType: "augment", specialType: "Aetherial Focus", statusType: "Enhancement", name: "Aetherial Focus", expiry: "end", duplicate: "block", description: "Begin encounters with X MP. This effect does not increase Max MP." },
        addle: { matches: ["addle"], type: "special", maskedType: "ddown", statusType: "Enfeeblement", specialType: "Addle", marker: "addle", name: "Addle", expiry: "turn", description: "Reduces the damage dealt by your abilities." },
        advantage: { matches: ["adv", "advantage"], type: "advantage", maskedType: "advantage", statusType: "Enhancement", name: "Advantage", expiry: "use", description: "Provides an advantage die that can be used once for any ability roll." },
        astral_fire: { matches: ["afire", "astralf", "astral fire"], type: "special", specialType: "Astral Fire", statusType: "Enhancement", name: "Astral Fire", expiry: "turn2", duplicate: "replace", description: "While under the effect of Astral Fire your fire-aspected abilities deal an additional 1d6 damage* and you do not recover MP at the end of the [Adventurer Step].\n\nAstral Fire is removed when you are granted Umbral Ice or, if the effect is not renewed, at the end of your next turn. \n\n*After attaining level 50, this damage increases to 2d6." },
        attribute: { matches: ["attr", "attribute"], type: "attribute(x)", maskedType: "attribute(x)", statusType: "Enhancement", name: "Attribute Up (X)", expiry: "turn", description: "Improves the given attribute by a set value." },
        barrier: { matches: ["barrier"], type: "special", specialType: "Barrier(X)", statusType: "Enhancement", name: "Barrier (X)", expiry: "ephemeral" },
        berserk: { matches: ["berserk"], type: "special", maskedType: "dps(x)", specialType: "Berserk", statusType: "Enhancement", name: "Berserk", expiry: "turn", duplicate: "block", description: "Your abilities deal an additional 2 damage until the end of this turn." },
        bio_ii: { matches: ["bio", "bio ii", "bio2", "bio 2" ], type: "special", maskedType: "dot(x)", specialType: "Bio II", statusType: "Enfeeblement", marker: "bio", name: "Bio II", expiry: "phase", duplicate: "bigger", description: "Damages the character by a given amount at the end of the [Adventurer Step]." },
        blind: { matches: ["blind"], type: "blind", maskedType: "blind", statusType: "Enfeeblement", marker: "blind", name: "Blind", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot see and automatically fail any checks that rely entirely on vision. You incur a -2 penalty on all checks, and characters receive one advantage die when targeting you." },
        bloodbath: { matches: ["bloodbath"], type: "special", maskedType: "drain", specialType: "Bloodbath", statusType: "Enhancement", name: "Bloodbath", expiry: "turn", duplicate: "bigger", description: "You regain HP each time you deal damage. When using abilities that affect multiple targets or deal multiple instances of damage, HP is recovered for each target damaged or each instance of damage dealt." },
        bound: { matches: ["bind", "bound"], type: "bound", maskedType: "bound", statusType: "Enfeeblement", marker: "bound", name: "Bound", expiry: "encounter", curable: true, duplicate: "block", description: "When Bound, Small and Medium characters' Speed falls to 0, while larger characters' Speed is reduced by 2.\n\nCharacters receive one advantage die when targeting you." },
        brink: { matches: ["brink", "brink of death"], type: "brink", maskedType: "brink", statusType: "Enfeeblement", marker: "brink", name: "Brink of Death", expiry: "rest", duplicate: "block", description: "You take a -5 penalty on all checks. If you are targeted by another effect that inflicts Weak, you are inflicted with Comatose instead.\n\nBrink of Death can only be removed by completing a rest or by effects that specifically remove it." },
        chicken: { matches: ["chicken"], type: "chicken", statusType: "Enfeeblement", marker: "chicken", name: "Chicken", expiry: "turn", duplicate: "replace", description: "You are a chicken." },
        clear_enfeeblements: { matches: ["clear", "cleare", "clear enfeeblements"], type: "special", specialType: "Clear Enfeeblements", statusType: "Enhancement", name: "Clear Enfeeblements", expiry: "ephemeral" },
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
        enmity: { matches: ["enmity"], type: "enmity(x)", maskedType: "enmity(x)", statusType: "Enfeeblement", marker: "enmity", name: "Enmity (X)", expiry: "turn", duplicate: "replace", description: "For any ability this character makes that does not target the source of the Enmity effect, a penalty of the given value is applied to the ability roll." },
        feint: { matches: ["feint"], type: "special", maskedType: "ddown", statusType: "Enfeeblement", specialType: "Feint", marker: "feint", name: "Feint", expiry: "turn", description: "Reduces the damage dealt by your abilities." },
        fight_or_flight: { matches: ["fflight", "fight or flight"], type: "special", specialType: "Fight or Flight", statusType: "Enhancement", name: "Fight or Flight", expiry: "turn", duplicate: "block", description: "Grants one advantage die on your next ability check this turn." },
        flamecast_focus: { matches: ["fcast", "flamecast", "flamecast focus"], type: "special", maskedType: "augment", augmentType: "ability", ability: "fire", specialType: "Flamecast Focus", statusType: "Enhancement", name: "Flamecast Focus", expiry: "end", duplicate: "block", description: "Grants the Fire ability." },
        hawks_eye: { matches: ["hawk", "hawke", "heye", "hawkeye", "hawk's eye", "hawks eye"], type: "special", maskedType: "Straight Shot Ready", specialType: "Hawk's Eye", statusType: "Enhancement", name: "Hawk's Eye", expiry: "use", duplicate: "block", description: "While under the effect of Hawk's Eye, you ignore the penalty incurred on ability checks made while Blinded." },
        heal: { matches: ["heal"], type: "special", specialType: "Heal(X)", statusType: "Enhancement", name: "Heal (X)", expiry: "ephemeral" },
        heavy: { matches: ["heavy"], type: "heavy", maskedType: "heavy", statusType: "Enfeeblement", marker: "heavy", name: "Heavy", expiry: "turn", curable: true, duplicate: "block", description: "Your Speed is halved (rounded up) and cannot be affected by effects which would add to their Speed.\n\nAbility checks targeting you automatically result in direct hits." },
        icecast_focus: { matches: ["icast", "icecast", "icecast focus"], type: "special", maskedType: "augment", augmentType: "ability", ability: "ice", specialType: "Icecast Focus", statusType: "Enhancement", name: "Icecast Focus", expiry: "end", duplicate: "block", description: "Grants the Ice ability." },
        improved_padding: { matches: ["ipad", "ipadding", "improved padding"], type: "special", maskedType: "augment", specialType: "Improved Padding", statusType: "Enhancement", name: "Improved Padding", expiry: "end", duplicate: "block", description: "Grants a barrier of 1 HP at the start of the [Adventurer Step]." },
        knocked_out: { matches: ["ko", "kout", "knocked", "knocked out"], type: "knocked_out", maskedType: "knocked_out", name: "Knocked Out", statusType: "Enfeeblement", marker: "ko", expiry: "rest", duplicate: "block", description: "A character that has been Knocked Out is unconscious and cannot perceive their surroundings. They cannot use abilities or perform other actions during their turn.\n\nThey are treated as both Prone and Stunned.\n\nThey cannot recover HP or MP.\n\nKnocked Out can only be removed by effects that specifically remove it.\n\nA character that has been knocked out has all enhancements and enfeeblements removed. They cannot be granted any enhancements or afflicted with further enfeeblements other than Comatose." },
        lightweight_refit: { matches: ["refit", "lrefit", "lightweight refit"], type: "special", maskedType: "augment", specialType: "Lightweight Refit", statusType: "Enhancement", name: "Lightweight Refit", expiry: "end", duplicate: "block", description: "Increases Speed by 1 during this character's first turn of an encounter." },
        lucid_dreaming: { matches: ["lucid", "ldreaming", "lucid dreaming"], type: "special", specialType: "Lucid Dreaming", statusType: "Enhancement", name: "Lucid Dreaming", expiry: "step", duplicate: "replace", description: "Recover an additional 1 MP at the end of this round's [Adventurer Step)." },
        mages_ballad: { matches: ["mballad", "mage's ballad", "mages ballad", "mballad"], type: "special", maskedType: "dreroll", specialType: "Mage's Ballad", statusType: "Enhancement", name: "Mage's Ballad", expiry: "use", duplicate: "block", description: "While under the effect of Mage's Ballad, you may reroll a single die when determining the amount of damage dealt by an ability." },
        magic_damper: { matches: ["damper", "mdamper", "magic damper"], type: "special", maskedType: "augment", augmentType: "ability", ability: "aetherwall", specialType: "Magic Damper", statusType: "Enhancement", name: "Magic Damper", expiry: "end", duplicate: "block", description: "Grants the Aetherwall ability." },
        major_arcana: { matches: ["marcana", "major arcana"], type: "special", maskedType: "dreroll", specialType: "Major Arcana", statusType: "Enhancement", name: "Major Arcana", expiry: "turn", duplicate: "replace", description: "While a character is under the effect of Major Arcana, they may reroll a single die of their choosing when determining the amount of damage dealt by an ability. Any die rerolled in this way cannot be rerolled again, and its result must be used.\n\nMajor Arcana is removed when its effect is resolved or at the end of the character's turn." },
        mana_conduit: { matches: ["mconduit", "mana conduit"], type: "special", maskedType: "augment", specialType: "Mana Conduit", statusType: "Enhancement", name: "Mana Conduit", expiry: "end", duplicate: "block", description: "This character may spend 5 MP immediately before making an ability check to increase its total by 1." },
        masterwork_ornamentation: { matches: ["mwork", "masterwork", "ornament", "ornamentation", "masterwork ornamentation"], type: "special", maskedType: "augment", specialType: "Masterwork Ornamentation", statusType: "Enhancement", name: "Masterwork Ornamentation", expiry: "end", duplicate: "block", description: "Grants one advantage die on checks involving speech. This effect cannot be used if the other character is hostile or is unable to see this character." },
        paralyzed: { matches: ["paralysis", "paralyze", "paralyzed"], type: "paralyzed", maskedType: "paralyzed", statusType: "Enfeeblement", marker: "paralyzed", name: "Paralyzed", expiry: "turn", curable: true, duplicate: "block", description: "If you use a Primary ability and roll a 5 or lower for its ability check, Paralysis interrupts the ability, negating it completely. Do not resolve any of its effects or spend any resources." },
        petrified: { matches: ["petrify", "petrified"], type: "petrified", maskedType: "petrified", statusType: "Enfeeblement", marker: "petrified", name: "Petrified", expiry: "turn2", curable: true, duplicate: "block", description: "You cannot act during your turn or use Instant abilities. You incur a -5 penalty on all checks.\n\nCharacters targeting you receive one advantage die on their ability check." },
        precision_opener: { matches: ["popener", "precision opener"], type: "special", maskedType: "augment", specialType: "Precision Opener", statusType: "Enhancement", name: "Precision Opener", expiry: "end", duplicate: "block", description: "Grants one advantage die on the first ability check this character makes during their first turn of an encounter." },
        prone: { matches: ["prone"], type: "prone", maskedType: "prone", statusType: "Enfeeblement", marker: "prone", name: "Prone", expiry: "encounter", curable: true, duplicate: "block", description: "You cannot take standard movement action on you turn unless you spend half your Speed (rounded up) to get back on your feet.\n\nProne characters incur a -2 penalty on all checks.\n\nCharacters targeting you receive one advantage die when making an ability check." },
        raging_strikes: { matches: ["rstrikes", "raging strikes"], type: "special", maskedType: "dps(x)", specialType: "Raging Strikes", statusType: "Enhancement", name: "Raging Strikes", expiry: "turn", duplicate: "block", description: "Your primary abilities deal an additional 2 damage until the end of this turn." },
        raise: { matches: ["raise", "ascend" ], type: "special", specialType: "Raise", statusType: "Enhancement", name: "Raise", expiry: "ephemeral" },
        rampart: { matches: ["rampart"], type: "special", maskedType: "defense(x)", specialType: "Rampart", statusType: "Enhancement", name: "Rampart", expiry: "start", duplicate: "block", description: "Reduces the damage you take from abilities by 2 until the start of your next turn." },
        ready: { matches: ["ready"], type: "ready(x)", maskedType: "ready(x)", statusType: "Enhancement", name: "(X) Ready", expiry: "use", duplicate: "block", description: "You may use an ability that requires you to be under this enhancement. X Ready is removed after the ability is used." },
        regen: { matches: ["regen", "revivify"], type: "regen(x)", maskedType: "regen(x)", statusType: "Enhancement", name: "Regen (X)", expiry: "phase", description: "Restores a given amount of HP at the end of the [Adventurer Step]." },
        reprisal: { matches: ["repr", "reprisal"], type: "special", maskedType: "ddown(x)", specialType: "Reprisal", statusType: "Enfeeblement", marker: "reprisal", name: "Reprisal", expiry: "round", duplicate: "block", description: "Reduces the damage you deal with abilities by 2 until the end of this round." },
        restore: { matches: ["restore"], type: "restore(x)", maskedType: "restore(x)", statusType: "Enhancement", name: "Restore uses of Y by (X)", expiry: "ephemeral" },
        restore_magic: { matches: ["restorem", "restore magic"], type: "special", specialType: "Restore Magic", statusType: "Enhancement", name: "Restore Magic", expiry: "ephemeral" },
        roll: { matches: ["roll", "roll up"], type: "roll(x)", maskedType: "roll(x)", statusType: "Enhancement", name: "Increment Ability Roll (X)", expiry: "use", description: "Allows the option to increment the value of an ability roll for purposes of achieving a Direct Hit or a Critical." },
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