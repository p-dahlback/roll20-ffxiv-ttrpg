/*build:remove*/
/*eslint no-unused-vars: "error"*/
/*exported sheets*/
/*build:end*/

const sheets = {
    template: {
        job: "",
        jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/X.png",
        role: "X / Y",
        level: 30,
        resources: { 
            hitPoints: 24, hitPoints_max: 24, magicPoints: 5, magicPoints_max: 5, 
            resource: "", resourceValue: 0, resourceValue_max: 0, 
            resource2: "none", resource2Value: 0, resource2Value_max: 0, 
            resource3: "none", resource3Value: 0, resource3Value_max: 0, 
            range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
            resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
        },
        attributes: { str: 1, dex: 4, vit: 2, int: 3, mnd: 2, defense: 13, magicDefense: 13, vigilance: 12, speed: 5 },
        traits: [
            { title: "", effect: "" }
        ],
        abilities: {
            primary: [
                { title: "", type: "", cost: 0, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "INT (d20 + 5)", cr: "Target's X", baseEffect: "", directHit: "", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "", dhValue: "", effectSelf: "", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/blizzard.png" }
            ]
        }
    },
    npc: {
        job: "NPC",
        jobIcon: "",
        role: "",
        level: 30,
        override: "manual",
        resources: { 
            hitPoints: 0, hitPoints_max: 0, magicPoints: 0, magicPoints_max: 0, 
            resource: "", resourceValue: 0, resourceValue_max: 0, 
            resource2: "none", resource2Value: 0, resource2Value_max: 0, 
            resource3: "none", resource3Value: 0, resource3Value_max: 0, 
            range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
            resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
        },
        attributes: { str: 0, dex: 0, vit: 0, int: 0, mnd: 0, defense: 0, magicDefense: 0, vigilance: 0, speed: 0 }
    },

    level30: {
        ast: {
            job: "AST",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/AST.png",
            role: "Healer / Astrologian",
            level: 30,
            resources: { 
                hitPoints: 24, hitPoints_max: 24, magicPoints: 5, magicPoints_max: 5,
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
            },
            attributes: { str: 2, dex: 2, vit: 2, int: 2, mnd: 4, defense: 12, magicDefense: 13, vigilance: 14, speed: 5 },
            traits: [
                { title: "Play Arcana", effect: "At the start of your turn, grant a single ally of your choosing within 10 squares Major Arcana and a barrier of 1 HP." },
                { title: "Major Arcana", effect: "While a character is under the effect of Major Arcana, they may reroll a single die of their choosing when determining the amount of damage dealt by an ability. Any die rerolled in this way cannot be rerolled again, and its result must be used.\n\nMajor Arcana is removed when its effect is resolved or at the end of the character's turn." }
            ],
            abilities: {
                primary: [
                    { title: "Play Arcana", type: "Trait, Free action", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "10 squares", condition: "May only be used at the start of your turn", baseEffect: "Grants the target Major Arcana and a barrier of 1 HP.", hitType: "None", damageType: "Effect", effectTarget: "Major Arcana, Barrier(1)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/play-arcana.png" },
                    { title: "Malefic", type: "Primary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 4)", cr: "Target's Magic Defense", baseEffect: "Deals 2 damage to the target.", directHit: "Deals an additional 1d6 damage.", stat: "MND", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/malefic.png" },
                    { title: "Helios", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "All allies within range", range: "A 5x5 area centered on this character", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 + 2 HP to all targets.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/helios.png" },
                    { title: "Repose", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 4)", cr: "Target's Magic Defense", baseEffect: "Inflicts Sleep on target.", directHit: "Removes all markers generated by the target.", stat: "MND", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", effectTarget: "Sleep", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Healer/repose.png" },
                    { title: "Ascend", type: "Primary, Magic, Invoked", cost: 3, uses: 0, uses_max: 0, resource: "MP", target: "1 Knocked Out character", range: "5 squares*", check: "Special (d20, Critical)", baseEffect: "Removes Knocked Out from the target, then restores 1d6 + 2 HP, grants Transcendent, and afflicts them with Weakness. *This ability can also target a character outside the encounter map. When doing so, move the target to an empty square within range after resolving the ability's effects.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 2", effectTarget: "Raise", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/ascend.png" },
                    { title: "Benefic II", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 2d6 + 4 HP to the target.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "2d6 + 4", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/benefic-ii.png" }
                ],
                secondary: [
                    { title: "Benefic", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 HP to the target.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/benefic.png" },
                    { title: "Lightspeed", type: "Secondary", cost: 0, uses: 2, uses_max: 2, baseEffect: "Immediately use one of your magic abilities.", limitation: "Twice per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/lightspeed.png" },
                    { title: "Lucid Dreaming", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Recover an additional 1 MP at the end of this round's [Adventurer Step].", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Lucid Dreaming", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/lucid-dreaming.png" },
                    { title: "Combust", type: "Secondary, Magic", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", baseEffect: "Inflicts a DOT (3) on the target.", hitType: "None", damageType: "Effect", effectTarget: "Combust(3)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/combust.png" },
                    { title: "Esuna", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", baseEffect: "Removes a single enfeeblement of the target's choosing.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Healer/esuna.png" }
                ],
                instant: [
                    { title: "Swiftcast", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Immediately use one of your magic abilities.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/swiftcast.png" },
                    { title: "Essential Dignity", type: "Instant, Magic", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 HP to the target. If the target's HP is less than or equal to half of their Max HP (rounded up), restores 2d6 + 2HP instead.", limitation: "Once per phase", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6", dhValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/AST/essential-dignity.png" }
                ],
                limit: [
                    { title: "Astral Stasis", type: "Limit Break", cost: 0, uses: 1, uses_max: 1, trigger: "Any time", condition: "Limit Breaks have been made available for this encounter.", target: "All allied adventurers within range", range: "The entire encounter map*", baseEffect: "Removes all enfeeblements from all targets, fully restores their HP, and grants them Major Arcana. Astral Stasis can remove Knocked Out, Weakness and Brink of Death. *This ability also targets characters outside the encounter map. When doing so, move these targets to an empty square within 5 squares of this character after resolving the ability's effects.", hitType: "None", damageType: "Effect", effectTarget: "Astral Statis:Clear Enfeeblements,Heal(999),Major Arcana", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        blm: {
            job: "BLM",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/BLM.png",
            role: "DPS / Black Mage",
            level: 30,
            resources: { 
                hitPoints: 21, hitPoints_max: 21, magicPoints: 5, magicPoints_max: 5, 
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 0, dex: 2, vit: 1, int: 5, mnd: 4, defense: 11, magicDefense: 15, vigilance: 14, speed: 5 },
            traits: [
                { title: "Consecutive Invocation", effect: "On your turn, after resolving the effects of an ability that enables this trait, you may forgo all standard movement until the end of your turn to use a additional invoked primary ability. You may choose a new target when using this additional ability. Consecutive Invocation can only be used once per turn, and does not prevent you from using focus to perform additional secondary action." },
                { title: "Umbral Ice", effect: "Certain effects grant you Umbral Ice. While under the effect of Umbral Ice, your ice-aspected abilities restore 5 MP each time they deal damage. Umbral Ice is removed when you are granted Astral Fire or, if the effect is not renewed, at the end of your next turn." },
                { title: "Astral Fire", effect: "Certain effects grant you Astral Fire. While under the effect of Astral Fire your fire-aspected abilities deal an additional 1d6 damage and you do not recover MP at the end of the [Adventurer Step].\n\nAstral Fire is removed when you are granted Umbral Ice or, if the effect is not renewed, at the end of your next turn." },
                { title: "Thunderhead Ready", effect: "Whenever you are granted Umbral Ice while not under the effect of Umbral Ice, or Astral Fire while not under the effect of Astral Fire grant Thunderhead Ready*.\n\n*You cannot use a thunder spell ability to inflict a DOT on a character already suffering from a DOT inflicted by one of your thunder spell abilities." }
            ],
            abilities: {
                primary: [
                    { title: "Blizzard", type: "Primary, Magic, Ice-Aspected, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage to the target, grants Umbral Ice, and enables Consecutive Invocation.", directHit: "Deals an additional 1d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectSelf: "Umbral Ice", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/blizzard.png" },
                    { title: "Fire", type: "Primary, Magic, Fire-Aspected, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage to the target, grants Astral Fire, and enables Consecutive Invocation.", directHit: "Deals an additonal 1d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectSelf: "Astral Fire", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/fire.png" },
                    { title: "Sleep", type: "Primary, Magic, Invoked", cost: 2, resource: "MP", uses: 0, uses_max: 0, target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Inflicts Sleep on all targets.", directHit: "Removes all markers generated by all targets.", stat: "INT", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", baseValue: "", dhValue: "", effectSelf: "", effectTarget: "Sleep", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/sleep.png" },
                    { title: "Blizzard II", type: "Primary, Magic, Ice-Aspected, Invoked", cost: 2, resource: "MP", uses: 0, uses_max: 0, target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage to all targets and grants Umbral Ice.", directHit: "Deals an additional 1d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectSelf: "Umbral Ice", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/blizzard-ii.png" },
                    { title: "Fire II", type: "Primary, Magic, Fire-Aspected, Invoked", cost: 3, resource: "MP", uses: 0, uses_max: 0, target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage to all targets and grants Astral Fire", directHit: "Deals an additional 1d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectSelf: "Astral Fire", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/fire-ii.png" }
                ],
                secondary: [
                    { title: "Transpose", type: "Secondary", cost: 0, uses: 0, uses_max: 0, baseEffect: "Removes Umbral Ice and grants Astral Fire, or removes Astral Fire and grants Umbral Ice. Transpose can only be used once per turn.", hitType: "None", damageType: "Effect", effectSelf: "Transpose", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/transpose.png" },
                    { title: "Thunder", type: "Secondary, Magic, Lightning-Aspected, Thunder-Spell", condition: "Under the effect of Thunderhead Ready", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "10 squares", baseEffect: "Deals 2 damage and inflicts a DOT (3) on the target.", hitType: "None", damageType: "Damage", baseValue: "2", effectTarget: "Thunder(3)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/thunder.png" },
                    { title: "Manafont", type: "Secondary", condition: "Under the effect of Astral Fire", cost: 0, uses: 1, uses_max: 1, baseEffect: "Fully restores MP and grants Thunderhead Ready.", limitation: "Once per phase.", hitType: "None", damageType: "Effect", restore: "5 MP", effectSelf: "Thunderhead Ready", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/manafont.png" },
                    { title: "Lucid Dreaming", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Recover an additional 1 MP at the end of this round's [Adventurer Step].", limitation: "Once per phase.", hitType: "None", damageType: "Effect", effectSelf: "Lucid Dreaming", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/lucid-dreaming.png" },
                    { title: "Thunder II", type: "Secondary, Magic, Lightning-Aspected, Thunder Spell", condition: "Under the effect of Thunderhead Ready", cost: 0, uses: 0, uses_max: 0, target: "All enemies within range", range: "A 5x5 area within 10 squares of this character.", baseEffect: "Inflicts a DOT (3) on all targets.", hitType: "None", damageType: "Effect", effectTarget: "Thunder(3)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/thunder-ii.png" },
                    { title: "Manaward", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Grants a barrier of 2 HP.", limitation: "Once per phase.", hitType: "None", damageType: "Effect", effectSelf: "Barrier(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/manaward.png" },
                    { title: "Scathe", type: "Secondary, Magic", cost: 1, resource: "MP", uses: 0, uses_max: 0, target: "Single", range: "10 squares", baseEffect: "Deals 4 damage to the target.", hitType: "None", damageType: "Damage", baseValue: "4", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BLM/scathe.png" }
                ],
                instant: [
                    { title: "Addle", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy is resolved.", target: "The enemy that triggered this ability.", range: "5 squares", baseEffect: "Reduces the damage dealt by the target's abilities by 2 until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Addle", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/addle.png" },
                    { title: "Swiftcast", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Immediately use on of your magic abilities.", limitation: "Once per phase", hitType: "None", damageType: "Damage", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/swiftcast.png" }
                ],
                limit: [
                    { title: "Meteor", type: "Limit Break, Magic, Fire-Aspected", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Any time", target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", baseEffect: "Deals 4d6 damage to all targets.", hitType: "None", damageType: "Damage", baseValue: "4d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        brd: {
            job: "BRD",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/BRD.png",
            role: "DPS / Bard",
            level: 30,
            resources: { 
                hitPoints: 24, hitPoints_max: 24, magicPoints: 5, magicPoints_max: 5, 
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
            },
            attributes: { str: 1, dex: 4, vit: 2, int: 3, mnd: 2, defense: 13, magicDefense: 13, vigilance: 12, speed: 5 },
            traits: [
                { title: "Arrow Flurry", effect: "On your turn, after resolving the effects of an ability that enables this trait, you may use an additional flurry ability. You may choose a new target when using this additional ability.\n\nArrow Flurry can only be used once per turn." },
                { title: "Bardsong", effect: "At the start of your turn, you may use one of your song abilities as a free action. Song effects are removed at the start of your next turn, at the end of a phase, or when you are Knocked Out." },
                { title: "Hawk's Eye", effect: "While under the effect of Hawk's Eye, you may use Straight Shot or Wide Volley and ignore the penalty incurred on ability checks made while Blinded.\n\nHawk's Eye is removed after using Straight Shot or Wide Volley." }
            ],
            abilities: {
                song: [
                    { title: "Minstrel's Refrain", type: "Magic, Song", cost: 0, uses: 0, uses_max: 0, baseEffect: "Grants the song effect of a single song ability of your choosing that you have already used this phase.", hitType: "None", damageType: "Effect", effectTarget: "Mage's Ballad", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/minstrels-refrain.png" },
                    { title: "Mage's Ballad", type: "Magic, Song", cost: 0, uses: 1, uses_max: 1, baseEffect: "Restores one use of Bloodletter and grants the following song effect.", effectName: "Mage's Ballad:", effect: "All allies may each reroll a single die when determining the amount of damage dealt by an ability.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "restore(instant-Bloodletter-1)", effectTarget: "Mage's Ballad", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/mages-ballad.png" }
                ],
                primary: [
                    { title: "Heavy Shot", type: "Primary, Physical, Ranged, Flurry", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target and enables Arrow Flurry. If the die rolled for this ability check lands on a 15 or higher, the following proc effect triggers.", effectName: "Heavier Shot:", effect: "Grants Hawk's Eye.", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectSelf: "Hawk's Eye[d>=15]", combo: "Heavy Shot, Straight Shot", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/heavy-shot.png" },
                    { title: "Venomous Bite + Windbite", type: "Primary, Physical, Ranged, Wind-Aspected, Poison", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Inflicts a DOT (4) on the target and enables Arrow Flurry.", directHit: "Deals 1d6 damage to the target.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "", dhValue: "1d6", effectTarget: "Venomous Bite(4)", combo: "Heavy Shot, Straight Shot", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/venomous-bite%2Bwindbite.png" },
                    { title: "Wide Volley", type: "Primary, Physical, Ranged", cost: 0, uses: 0, uses_max: 0, condition: "Under the effect of Hawk's Eye", target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 5 damage to all targets", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "5", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/wide-volley.png" },
                    { title: "Straight Shot", type: "Primary, Physical, Ranged, Flurry", cost: 0, uses: 0, uses_max: 0, condition: "Under the effect of Hawk's Eye", target: "Single", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 5 damage to the target and enables Arrow Flurry.", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "5", dhValue: "1d6", combo: "Heavy Shot, Straight Shot", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/straight-shot.png" },
                    { title: "Quick Nock", type: "Primary, Physical, Ranged", cost: 0, uses: 0, uses_max: 0, target: "All enemies within range", range: "A 3x3 area adjacent to this character", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 3 damage to all targets. If the die rolled for this ability check lands on a 15 or higher, the following proc effect triggers.", effectName: "Enhanced Quick Nock:", effect: "Grant's Hawk's Eye", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectSelf: "Hawk's Eye[d>=15]", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/quick-nock.png" }
                ],
                secondary: [
                    { title: "Raging Strikes", type: "Secondary", cost: 0, uses: 2, uses_max: 2, baseEffect: "Your primary abilities deal an additional 2 damage until the end of this turn.", limitation: "Twice per phase", hitType: "None", damageType: "Effect", effectSelf: "Raging Strikes(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/raging-strikes.png" }
                ],
                instant: [
                    { title: "Leg Graze", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately after an enemy makes an ability check", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Reduces the total of the ability check that triggered Leg Graze by 1d6.", limitation: "Once per phase", hitType: "None", damageType: "Effect", baseValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Ranged/leg-graze.png" },
                    { title: "Foot Graze", type: "Instant, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an enemy moves", target: "The enemy that triggered this ability", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "None.", directHit: "Inflicts Bound on the target until the end of this turn.", limitation: "Once per phase", stat: "DEX", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", effectTarget: "bound", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Ranged/foot-graze.png" },
                    { title: "Repelling Shot", type: "Instant, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", target: "Single", range: "10 squares", baseEffect: "Move up to 3 squares. You cannot end this movement in a square that is closer to the target than where you began.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/repelling-shot.png" },
                    { title: "Second Wind", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Restores 1d6 + 2 HP", limitation: "Once per phase", hitType: "None", damageType: "Healing", baseValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/dps/second-wind.png" },
                    { title: "Bloodletter", type: "Instant, Physical, Ranged", cost: 0, uses: 2, uses_max: 2, trigger: "When any character ends their turn", target: "Single", range: "10 squares", baseEffect: "Deals 4 damage to the target.", limitation: "Twice per phase", hitType: "None", damageType: "Damage", baseValue: "4", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/BRD/bloodletter.png" },
                    { title: "Head Graze", type: "Instant, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, trigger: "When an enemy within 10 squares of this character uses an invoked ability, or is using an invoked ability to generate a marker", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Interrupts the invoked ability that triggered Head Graze, negating it completely.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Ranged/head-graze.png" }
                ],
                limit: [
                    { title: "Sagittarius Arrow", type: "Limit Break, Physical", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Any time", target: "All enemies within range", range: "A 5x area extending in a straight line across the entire encounter map from 1 square adjacent to this character.", baseEffect: "Deals 6d6 damage divided evenly (rounded up) amongst all targets and inflicts a DOT (4) on all targets.", hitType: "None", damageType: "Damage", baseValue: "6d6", effectTarget: "DOT(4)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        drg: {
            job: "DRG",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/DRG.png",
            role: "DPS / Dragoon",
            level: 30,
            resources: { 
                hitPoints: 26, hitPoints_max: 26, magicPoints: 5, magicPoints_max: 5, 
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
            },
            attributes: { str: 5, dex: 3, vit: 2, int: 1, mnd: 1, defense: 14, magicDefense: 11, vigilance: 11, speed: 5 },
            traits: [
                { title: "Power Surge", effect: "While under the effect of Power Surge, your abilities deal an additional 2 damage." },
                { title: "Combo", effect: "After resolving the effects of an ability with Combo, you may use one of the specified abilities at any point during your turn. You may move before doing so, and may choose a new target when using this additional ability." }
            ],
            abilities: {
                primary: [
                    { title: "True Thrust", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR(d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 3 damage to the target. Combo: Dragoon Combo or Disembowel.", directHit: "Deals an additional 2d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "2d6", combo: "Dragoon Combo,Disembowel", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/true-thrust.png" },
                    { title: "Piercing Talon", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "5 squares", check: "STR (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 3 damage to the target.", directHit: "Deals an additional 2d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/piercing-talon.png" },
                    { title: "Jump", type: "Primary, Physical", cost: 0, uses: 1, uses_max: 1, target: "Single", range: "5 squares", check: "STR (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 2d6 + 3 damage to the target.", directHit: "Deals an additional 2d6 damage.", limitation: "Once per phase", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2d6 + 3", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/jump.png" },
                    { title: "Dragoon Combo (Vorpal Thrust + Full Thrust)", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 3 damage to the target.", directHit: "Deals an additional 2d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/dragoon-combo.png" },
                    { spacer: true },
                    { spacer: true },
                    { title: "Disembowel", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 3 damage to the target and grants Power Surge.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectSelf: "Power Surge(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/disembowel.png" }
                ],
                secondary: [
                    { title: "Life Surge", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Grants Drain(2) until the end of this turn and one advantage die on your next ability check this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Life Surge(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/life-surge.png" },
                    { title: "Bloodbath", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Grants Drain(2) until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Bloodbath(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/bloodbath.png" },
                    { title: "Lance Charge", type: "Secondary", cost: 0, uses: 2, uses_max: 2, baseEffect: "Your abilities deal an additional 2 damage until the end of this turn.", limitation: "Twice per phase", hitType: "None", damageType: "Effect", effectSelf: "Lance Charge(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRG/lance-charge.png" },
                    { title: "Leg Sweep", type: "Secondary, Physical", cost: 0, uses: 1, uses_max: 1, target: "Single", range: "1 square", baseEffect: "Stuns the target until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Stun", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/leg-sweep.png" }
                ],
                instant: [
                    { title: "Second Wind", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Restores 1d6 + 2 HP", limitation: "Once per phase", hitType: "None", damageType: "Healing", baseValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/dps/second-wind.png" },
                    { title: "Feint", type: "Instant, Physical", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy is resolved.", target: "The enemy that triggered this ability.", range: "2 squares", baseEffect: "Reduces the damage dealt by the target's abilities by 2 until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Feint", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/feint.png" }
                ],
                limit: [
                    { title: "Dragonsong Dive", type: "Limit Break, Physical", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Any time", target: "Single", range: "5 squares", baseEffect: "Deals 6d6 damage to the target, then move to an empty square adjacent to the target if one is available.", hitType: "None", damageType: "Damage", baseValue: "6d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        drk: {
            job: "DRK",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/DRK.png",
            role: "Tank / Dark Knight",
            level: 30,
            resources: { 
                hitPoints: 32, hitPoints_max: 32, magicPoints: 5, magicPoints_max: 5, 
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
            },
            attributes: { str: 4, dex: 0, vit: 4, int: 0, mnd: 4, defense: 15, magicDefense: 14, vigilance: 14, speed: 5 },
            traits: [
                { title: "Darkside", effect: "While under the effect of Darkside, you may spend 2 MP when you score a direct hit on an enemy with a single-target ability to treat any roll of 1. 2, or 3 as if it were a 0 and any roll of 4, 5, or 6 as if it were a 10 when determining damage. Darkside is removed at the end of your next turn it the effect is not renewed." },
                { title: "Combo", effect: "After resolving the effects of an ability with Combo, you may use one of the specified abilities at any point during your turn. You may move before doing so, and may choose a new target when using this additional ability." }
            ],
            abilities: {
                primary: [
                    { title: "Dark Knight Combo (Hard Slash + Siphon Strike)", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target. Restores 1 MP. Combo: Souleater", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", restore: "1MP", effectTarget: "Enmity(5)", combo: "Souleater", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRK/dark-knight-combo.png" },
                    { title: "Unleash", type: "Primary, Magic", cost: 0, uses: 0, uses_max: 0, resource: "MP", target: "All enemies within range", range: "A 5x5 area centered on this character", check: "MND (d20 + 4)", cr: "Target's Magic Defense", baseEffect: "Inflicts Enmity on all targets.", directHit: "Deals 2 damage to all targets.", stat: "MND", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "", dhValue: "2", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRK/unleash.png" },
                    { title: "Unmend", type: "Primary, Magic", cost: 0, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "5 squares", check: "MND (d20 + 4)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage and inflicts Enmity on the target.", directHit: "Deals an additional 1d6 damage.", stat: "MND", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRK/unmend.png" },
                    { title: "Souleater", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target. Restores 2HP.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", restore: "2 HP", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRK/souleater.png" }
                ],
                secondary: [
                    { title: "Rampart", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Reduces the damage you take from abilities by 2 until the start of your next turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Rampart(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/rampart.png" },
                    { title: "Low Blow", type: "Secondary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", baseEffect: "Stuns the target until the end of this turn.", hitType: "None", damageType: "Effect", effectTarget: "Stun", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/low-blow.png" },
                    { title: "Flood of Darkness", type: "Secondary, Magic", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "All enemies within range", range: "A 3x3 area adjacent to this character", baseEffect: "Deals 2 damage to all targets and grants Darkside.", hitType: "None", damageType: "Damage", baseValue: "2", effectSelf: "Darkside", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/DRK/flood-of-darkness.png" }
                ],
                instant: [
                    { title: "Provoke", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When an enemy begins their turn", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Inflicts Enmity on the target.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/provoke.png" },
                    { title: "Interject", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When an adjacent enemy uses an invoked ability, or is using an invoked ability to generate a marker", target: "The enemy that triggered this ability", range: "1 square", baseEffect: "Interrupts the invoked ability that triggered Interject, negating it completely.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/interject.png" },
                    { title: "Reprisal", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy within 2 squares is resolved", target: "All enemies within range", range: "A 5x5 area centered on this character", baseEffect: "Reduces the damage dealt by the abilities of all targets by 2 until the end of this round.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Reprisal(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/reprisal.png" }
                ],
                limit: [
                    { title: "Dark Force", type: "Limit Break", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Immediately before an effect that deals damage or inflicts enfeeblements is resolved", target: "Single", baseEffect: "Prevents all damage and enfeeblements that the effect that triggered Dark Force inflicts on the target.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        mch: {
            job: "MCH",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/MCH.png",
            role: "DPS / Machinist",
            level: 30,
            resources: { 
                hitPoints: 24, hitPoints_max: 24, magicPoints: 5, magicPoints_max: 5, 
                resource: "Heat", resourceValue: 0, resourceValue_max: 4, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
            },
            attributes: { str: 3, dex: 4, vit: 2, int: 2, mnd: 1, defense: 14, magicDefense: 12, vigilance: 11, speed: 5 },
            traits: [
                { title: "Mechanized Sharpshooter", effect: "You may use any number of instant abilities on your turn." },
                { title: "Thermal Trap", effect: "Certain effects grant you Heat. You can have up to 4 Heat at any time." },
                { title: "Overheated", effect: "While under the effect of Overheated, use the lower of the target's Defense or Magic Defense as the CR for your ability checks. Overheated is removed at the start of your next turn." }
            ],
            abilities: {
                primary: [
                    { title: "Machinist Combo (Split Shot + Slug Shot)", type: "Primary, Physical, Ranged", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 4 damage to the target and grants 1 Heat. Combo: Clean Shot.", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "4", dhValue: "1d6", restore: "1 Heat", combo: "Clean Shot", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/machinist-combo.png" },
                    { title: "Hot Shot", type: "Primary, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, target: "Single", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 7 damage to the target.", directHit: "Deals an additional 2d6 damage.", limitation: "Once per phase.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "7", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/hot-shot.png" },
                    { title: "Spread Shot", type: "Primary, Physical, Ranged", cost: 0, uses: 0, uses_max: 0, target: "All enemies within range", range: "A 5x5 area adjacent to this character", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 4 damage to all targets and grants 1 Heat.", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "4", dhValue: "1d6", restore: "1 Heat", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/spread-shot.png" },
                    { title: "Clean Shot", type: "Primary, Physical, Ranged", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 4 damage to the target and grants 1 Heat.", directHit: "Deals an additional 1d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "4", dhValue: "1d6", restore: "1 Heat", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/clean-shot.png" }
                ],
                secondary: [
                    { title: "Reassemble", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "The next ability you use this turn automatically scores a critical unless it is interrupted or otherwise negated.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Reassemble", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/reassemble.png" },
                    { title: "Hypercharge", type: "Secondary", cost: 2, resource: "Heat", uses: 0, uses_max: 0, baseEffect: "Grants Overheated until the start of your next turn.", hitType: "None", damageType: "Effect", effectSelf: "Overheated", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/hypercharge.png" }
                ],
                instant: [
                    { title: "Leg Graze", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately after an enemy makes an ability check", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Reduces the total of the ability check that triggered Leg Graze by 1d6.", limitation: "Once per phase", hitType: "None", damageType: "Effect", baseValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Ranged/leg-graze.png" },
                    { title: "Foot Graze", type: "Instant, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an enemy moves", target: "The enemy that triggered this ability", range: "10 squares", check: "DEX (d20 + 4)", cr: "Target's Defense", baseEffect: "None.", directHit: "Inflicts Bound on the target until the end of this turn.", limitation: "Once per phase", stat: "DEX", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", effectTarget: "bound", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Ranged/foot-graze.png" },
                    { title: "Head Graze", type: "Instant, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, trigger: "When an enemy within 10 squares of this character uses an invoked ability, or is using an invoked ability to generate a marker", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Interrupts the invoked ability that triggered Head Graze, negating it completely.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Ranged/head-graze.png" },
                    { title: "Second Wind", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Restores 1d6 + 2 HP", limitation: "Once per phase", hitType: "None", damageType: "Healing", baseValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/dps/second-wind.png" },
                    { title: "Gauss Round", type: "Instant, Physical, Ranged", cost: 0, uses: 1, uses_max: 1, trigger: "Any time", target: "Single", range: "10 squares", baseEffect: "Deals 5 damage to the target.", limitation: "Once per phase", hitType: "None", damageType: "Damage", baseValue: "5", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MCH/gauss-round.png" }
                ],
                limit: [
                    { title: "Satellite Beam", type: "Limit Break, Physical", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Any time during your turn as a primary action", target: "All enemies within range", range: "A 5x area extending in a straight line across the entire encounter map from 1 square adjacent to this character.", baseEffect: "Deals 6d6 + 20 damage to all targets.", hitType: "None", damageType: "Damage", baseValue: "6d6 + 20", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        mnk: {
            job: "MNK",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/MNK.png",
            role: "DPS / Monk",
            level: 30,
            resources: { 
                hitPoints: 26, hitPoints_max: 26, magicPoints: 5, magicPoints_max: 5, 
                resource: "Chakra", resourceValue: 3, resourceValue_max: 3, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 1, range3: 0, range3_max: 2, 
                resourceReset: "full", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 4, dex: 3, vit: 2, int: 1, mnd: 2, defense: 14, magicDefense: 13, vigilance: 12, speed: 5 },
            traits: [
                { title: "Martial Forms", effect: "Certain effects grant you Opo-Opo Form, Raptor Form, or Coeur Form. While under the effect of a form, receive one advantage die on you ability checks for physical abilities.\n\nIf an effect grants you a new form, your current form is removed and the new form immediately takes effect. Forms are removed at the end your next turn." },
                { title: "Deep Meditation", effect: "Certain effects grant you Chakra. You can have up to 3 Chakra at any given time. At the start of an encounter, gain 3 Chakra." },
                { title: "Bestial Fury", effect: "Certain effects grant you Raptor's Fury and Coeurl's Fury. You can have up to 1 stack of Raptor's Fury and 2 stacks of Coeurl's Fury at any given time.\n\nWhenever you resolve the effects of an ability that enables this trait, you may spend 1 stack of the corresponding beast's Fury to deal an additional 1d6 damage and move up to 2 squares." }
            ],
            abilities: {
                primary: [
                    { title: "Monk Combo", type: "Primary", cost: 0, uses: 0, uses_max: 0, baseEffect: "You may perform up to three additional primary actions this turn. They primary actions granted by this effect can only be used for physical primary abilities.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/monk-combo.png" },
                    { title: "True Strike", type: "Primary, Physical", condition: "Under the effect of Raptor Form", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target, grants Coeurl Form, and enables Bestial Fury: Raptor.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectSelf: "Coeurl Form", combo: "Bestial Fury: Raptor(cost:1 range2|roll:1d6)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/true-strike.png" },
                    { title: "Snap Punch", type: "Primary, Physical", condition: "Under the effect of Coeurl Form", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target, grants Opo-Opo Form, and enables Bestial Fury: Coeurl.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectSelf: "Opo-Opo Form", combo: "Bestial Fury: Coeurl(cost:1 range3|roll:1d6)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/snap-punch.png" },
                    { title: "Bootshine", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target, grants Raptor Form. If this ability is used while under the effect of Opo-Opo Form and results in a direct hit, it automatically scores a critical as well.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectSelf: "Raptor Form", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/bootshine.png" },
                    { title: "Twin Snakes", type: "Primary, Physical", condition: "Under the effect of Raptor Form", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target. Grants Coeurl Form, and 1 stack of Raptor's Fury.", directHit: "Deals an additional 2 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "2", restore: "1 range2", effectSelf: "Coeurl Form", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/twin-snakes.png" },
                    { title: "Demolish", type: "Primary, Physical", condition: "Under the effect of Coeurl Form", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target. Grants Opo-Opo Form and 2 stacks of Coeurl's Fury.", directHit: "Deals an additional 2 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "2", restore: "2 range3", effectSelf: "Opo-Opo Form", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/demolish.png" },
                    { title: "Arm of the Destroyer", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "All enemies within range", range: "A 3x3 area centered on this character", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to all targets and grants Raptor Form.", directHit: "Deals an additional 2 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "2", effectSelf: "Raptor Form", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/arm-of-the-destroyer.png" },
                    { spacer: true },
                    { title: "Rockbreaker", type: "Primary, Physical", condition: "Under the effect of Coeurl Form", cost: 0, uses: 0, uses_max: 0, target: "All enemies within range", range: "A 3x3 area centered on this character", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage to all targets and grants Opo-Opo Form.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectSelf: "Opo-Opo Form", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/rockbreaker.png" }
                ],
                secondary: [
                    { title: "Leg Sweep", type: "Secondary, Physical", cost: 0, uses: 1, uses_max: 1, target: "Single", range: "1 square", baseEffect: "Stuns the target until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Stun", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/leg-sweep.png" },
                    { title: "Meditation", type: "Secondary", cost: 0, uses: 0, uses_max: 0, baseEffect: "Grants 1 Chakra.", hitType: "None", damageType: "Effect", restore: "1 Chakra", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/meditation.png" },
                    { title: "Steel Peak", type: "Secondary, Physical", cost: 3, resource: "Chakra", uses: 0, uses_max: 0, target: "Single", range: "1 square", baseEffect: "Deals 4 damage to the target.", hitType: "None", damageType: "Damage", baseValue: "4", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/MNK/steel-peak.png" },
                    { title: "Bloodbath", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Grants Drain(2) until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Bloodbath(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/bloodbath.png" }
                ],
                instant: [
                    { title: "Second Wind", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Restores 1d6 + 2 HP", limitation: "Once per phase", hitType: "None", damageType: "Healing", baseValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/dps/second-wind.png" },
                    { title: "Feint", type: "Instant, Physical", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy is resolved.", target: "The enemy that triggered this ability.", range: "2 squares", baseEffect: "Reduces the damage dealt by the target's abilities by 2 until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Feint", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/feint.png" }
                ],
                limit: [
                    { title: "Final Heaven", type: "Limit Break", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Any time", baseEffect: "Immediately perform a primary action.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        nin: {
            job: "NIN",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/NIN.png",
            role: "DPS / Ninja",
            level: 30,
            resources: { 
                hitPoints: 26, hitPoints_max: 26, magicPoints: 5, magicPoints_max: 5, 
                resource: "Mudra", resourceValue: 0, resourceValue_max: 3, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0,
                resource3: "none", resource3Value: 0, resource3Value_max: 0,
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false" 
            },
            attributes: { str: 1, dex: 5, vit: 2, int: 1, mnd: 3, defense: 13, magicDefense: 12, vigilance: 13, speed: 5 },
            traits: [
                { title: "Sign Weaver", effect: "Certain effects grant you Mudra. You can have up to 1 Mudra at any given time. All Mudra are removed when you perform an action other than Ritual Weave." },
                { title: "Hide", effect: "At the start of an encounter, grants Hidden unless you were caught by surprise." },
                { title: "Hidden", effect: "While under the effect of Hidden, receive one advantage die on your ability checks. Hidden is removed when you take or deal damage or perform a primary or secondary action." },
                { title: "Ninjutsu Cooldown", effect: "Ninjutsu Cooldown is an enhancement, and cannot be removed by effects that remove enfeeblements. Ninjutsu Cooldown is removed at the end of your next turn." }
            ],
            abilities: {
                primary: [
                    { title: "Ninja Combo (Spinning Edge + Gust Slash)", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "DEX (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target. Combo: Aeolian Edge.", directHit: "Deals an additional 2d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "2d6", combo: "Aeolian Edge", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/ninja-combo.png" },
                    { title: "Throwing Dagger", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "5 squares", check: "DEX (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 3 damage to the target.", directHit: "Deals an additional 2d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/throwing-dagger.png" },
                    { title: "Ninjutsu", type: "Primary", cost: 0, uses: 0, uses_max: 0, condition: "1 or more Mudra and not under the effect of Ninjutsu Cooldown", target: "Single", baseEffect: "Immediately use one of your ninjutsu abilities. Some ninjutsu abilities can only be used if you spend 1 or more Mudra for this ability. Grants Ninjutsu Cooldown after resolving the ninjutsu ability's effects.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/ninjutsu.png" },
                    { title: "Aeolian Edge", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "DEX (d20 + 5)", cr: "Target's Defense", baseEffect: "Deals 2 damage to the target.", directHit: "Deals an additional 2d6 damage.", stat: "DEX", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/aeolian-edge.png" }
                ],
                ninjutsu: [
                    { title: "Fuma Shuriken", type: "Primary, Phyical, Ninjutsu", cost: 1, resource: "Mudra", uses: 0, uses_max: 0, target: "Single", range: "12 squares", baseEffect: "Deals 10 damage to the target.", hitType: "None", damageType: "Damage", baseValue: "10", effectSelf: "Ninjutsu Cooldown", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/fuma-shuriken.png" }
                ],
                secondary: [
                    { title: "Leg Sweep", type: "Secondary, Physical", cost: 0, uses: 1, uses_max: 1, target: "Single", range: "1 square", baseEffect: "Stuns the target until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Stun", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/leg-sweep.png" },
                    { title: "Mug", type: "Secondary, Physical", cost: 0, uses: 1, uses_max: 1, target: "Single", range: "1 square", baseEffect: "Increases the damage the target takes from abilities by 1 until the start of your next turn", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Mug", effectTarget: "Mugged(1)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/mug.png" },
                    { title: "Ritual Weave", type: "Secondary", cost: 0, uses: 0, uses_max: 0, baseEffect: "Grants 1 Mudra.", hitType: "None", damageType: "Effect", restore: "1 Mudra", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/ritual-weave.png" },
                    { title: "Bloodbath", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Grants Drain(2) until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Bloodbath(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/bloodbath.png" }
                ],
                instant: [
                    { title: "Hide", type: "Instant", cost: 0, uses: 0, uses_max: 0, trigger: "Immediately at the start of an encounter", condition: "You were not caught by surprise", baseEffect: "Grants Hidden.", hitType: "None", damageType: "Effect", effectSelf: "Hidden", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/hide.png" },
                    { title: "Shade Shift", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately after an ability check for an ability that targets you.", baseEffect: "Increases your Defense and Magic Defense by 1d6 for the ability check that triggered Shade Shift. Use this new value to determine if the ability scores a direct hit.", limitation: "Once per phase", hitType: "None", damageType: "Defense", baseValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/shade-shift.png" },
                    { title: "Trick Attack", type: "Instant, Physical", cost: 0, uses: 0, uses_max: 0, condition: "Under the effect of Hidden", trigger: "Any time", target: "Single", range: "1 square", baseEffect: "Deals 2d6 damage to the target and grants one advantage die on your next ability check.", hitType: "None", damageType: "Damage", baseValue: "2d6", effectSelf: "Advantage(1)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/NIN/trick-attack.png" },
                    { title: "Feint", type: "Instant, Physical", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy is resolved.", target: "The enemy that triggered this ability.", range: "2 squares", baseEffect: "Reduces the damage dealt by the target's abilities by 2 until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Feint", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Melee/feint.png" },
                    { title: "Second Wind", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Restores 1d6 + 2 HP", limitation: "Once per phase", hitType: "None", damageType: "Healing", baseValue: "1d6 + 2", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/dps/second-wind.png" }
                ],
                limit: [
                    { title: "Chimatsuri", type: "Limit Break, Physical", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Any time", target: "Single", range: "1 square", baseEffect: "Deals 4d6 damage to the target and grants Hidden.", hitType: "None", damageType: "Damage", baseValue: "4d6", effectSelf: "Hidden", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        pld: {
            job: "PLD",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/PLD.png",
            role: "Tank / Paladin",
            level: 30,
            resources: {
                hitPoints: 35, hitPoints_max: 35, magicPoints: 5, magicPoints_max: 5,
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 4, dex: 0, vit: 5, int: 1, mnd: 2, defense: 16, magicDefense: 13, vigilance: 12, speed: 5 },
            traits: [
                { title: "Combo", effect: "After resolving the effects of an ability with Combo, you may use one of the specified abilities at any point during your turn. You may move before doing so, and may choose a new target when using this additional ability." }
            ],
            abilities: {
                primary: [
                    { title: "Paladin Combo (Fast Blade + Riot Blade)", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target. Combo: Rage of Halone", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectTarget: "Enmity(5)", combo: "Rage of Halone", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/paladin-combo.png" },
                    { title: "Total Eclipse", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "All targets within range", range: "A 5x5 area centered on this character", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Inflicts Enmity on all targets.", directHit: "Deals 2 damage to all targets.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "", dhValue: "2", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/total-eclipse.png" },
                    { title: "Shield Lob", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "5 squares", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/shield-lob.png" },
                    { title: "Rage of Halone", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/rage-of-halone.png" },
                    { title: "Shield Bash", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 3 damage, inflicts Enmity and stuns the target until the end of this turn.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", effectTarget: "Stun & Enmity:Stun, Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/shield-bash.png" }
                ],
                secondary: [
                    { title: "Rampart", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Reduces the damage you take from abilities by 2 until the start of your next turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Rampart(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/rampart.png" },
                    { title: "Low Blow", type: "Secondary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", baseEffect: "Stuns the target until the end of this turn.", hitType: "None", damageType: "Effect", effectTarget: "Stun", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/low-blow.png" },
                    { title: "Spirits Within", type: "Secondary, Physical", cost: 0, uses: 2, uses_max: 2, target: "Single", range: "1 square", baseEffect: "Deals 2 damage and inflicts Enmity on the target.", hitType: "None", damageType: "Damage", baseValue: "2", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/spirits-within.png" }
                ],
                instant: [
                    { title: "Sturdy Shield", type: "Instant", cost: 0, uses: 0, uses_max: 0, trigger: "Immediately after an ability check for an ability that targets you.", baseEffect: "Increases your Defense by 1d6 for the ability check that triggered Sturdy Shield. Use this new value to determine if the ability scores a direct hit.", limitation: "Once per round", hitType: "None", damageType: "Defense", baseValue: "1d6 + @{defense}[Defense]", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/sturdy-shield.png" },
                    { title: "Provoke", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When an enemy begins their turn", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Inflicts Enmity on the target.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/provoke.png" },
                    { title: "Reprisal", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy within 2 squares is resolved", target: "All enemies within range", range: "A 5x5 area centered on this character", baseEffect: "Reduces the damage dealt by the abilities of all targets by 2 until the end of this round.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Reprisal(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/reprisal.png" },
                    { title: "Fight or Flight", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Any time during your turn", baseEffect: "Grants one advantage die on your next ability check this turn.", limitation: "Once per phase.", hitType: "None", damageType: "Effect", effectSelf: "Fight or Flight", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PLD/fight-or-flight.png" },
                    { title: "Interject", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When an adjacent enemy uses an invoked ability, or is using an invoked ability to generate a marker", target: "The enemy that triggered this ability", range: "1 square", baseEffect: "Interrupts the invoked ability that triggered Interject, negating it completely.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/interject.png" }
                ],
                limit: [
                    { title: "Last Bastion", type: "Limit Break, Physical", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Immediately before 1 or more allied adventurers take damage", baseEffect: "Halves the damage (rounded up) taken from the effect that triggered Last Bastion, then restores 3d6 HP and removes a single enfeeblement from all allies. Each ally may choose which enfeeblement to remove.", hitType: "None", damageType: "Healing", baseValue: "3d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        sch: {
            job: "SCH",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/SCH.png",
            role: "Healer / Scholar",
            level: 30,
            resources: {
                hitPoints: 24, hitPoints_max: 24, magicPoints: 5, magicPoints_max: 5,
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 0, dex: 1, vit: 2, int: 4, mnd: 5, defense: 12, magicDefense: 15, vigilance: 15, speed: 5 },
            traits: [
                { title: "Summon Eos", effect: "At the start of an encounter, summon the faerie Eos in your starting square. Eos is resummoned any time you recover from being Knocked Out, as well at the start of a new phase if she isn't already present on the encounter map." },
                { title: "Eos", effect: "You can summon a pet (Eos) to aid you during encounters. Your pet is immune to all effects other than those caused by your traits and abilities, and can enter and end its movement in occupied squares. Other characters may also move through or end their turn in the same square as your pet. So long as your pet remains on the encounter map, you benefit from the effects of its traits.\n  During encounters, your pet takes its turn immediately before you. On its turn, a pet can perform a standard movement action to move up to its Speed and use one of its abilities. It cannot perform any other actions.\n  Your pet is immediately dismissed and removed from the encounter map when you are Knocked Out.\n  If your pet is already present on the encounter map, any effects that would summon a pet are ignored." }
            ],
            abilities: {
                primary: [
                    { title: "Ruin", type: "Primary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 2 damage to the target.", directHit: "Deals an additional 1d6 damage.", stat: "MND", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/ruin.png" },
                    { title: "Resurrection", type: "Primary, Magic, Invoked", cost: 3, uses: 0, uses_max: 0, resource: "MP", target: "1 Knocked Out character", range: "5 squares*", check: "Special (d20, Critical)", baseEffect: "Removes Knocked Out from the target, then restores 1d6 + 2 HP, grants Transcendent, and afflicts them with Weakness. *This ability can also target a character outside the encounter map. When doing so, move the target to an empty square within range after resolving the ability's effects.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 2", effectTarget: "Raise", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/resurrection.png" },
                    { title: "Adloqium", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 + 3 HP and grants a barrier equalling the amount restored to the target.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 3", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/adloqium.png" },
                    { title: "Repose", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 4)", cr: "Target's Magic Defense", baseEffect: "Inflicts Sleep on target.", directHit: "Removes all markers generated by the target.", stat: "MND", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", effectTarget: "Sleep", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Healer/repose.png" }
                ],
                secondary: [
                    { title: "Bio II", type: "Secondary, Magic", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", baseEffect: "Deals 1 damage and inflicts a DOT(3) on the target.", hitType: "None", damageType: "Damage", baseValue: "1", effectTarget: "Bio(3)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/bio-ii.png" },
                    { title: "Heel", type: "Secondary", cost: 0, uses: 0, uses_max: 0, target: "Your pet", range: "The entire encounter map", baseEffect: "Move your pet to 1 square occupied by this character.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PET/heel.png" },
                    { title: "Lucid Dreaming", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Recover an additional 1 MP at the end of this round's [Adventurer Step].", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Lucid Dreaming", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/lucid-dreaming.png" },
                    { title: "Physick", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 HP to the target.", hitType: "Critical", damageType: "Healing", baseValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/physick.png" },
                    { title: "Esuna", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", baseEffect: "Removes a single enfeeblement of the target's choosing.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Healer/esuna.png" }
                ],
                instant: [
                    { title: "Swiftcast", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Immediately use one of your magic abilities.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/swiftcast.png" }
                ],
                limit: [
                    { title: "Angel Feathers", type: "Limit Break", cost: 0, uses: 1, uses_max: 1, trigger: "Any time", condition: "Limit Breaks have been made available for this encounter.", target: "All allied adventurers within range", range: "The entire encounter map*", baseEffect: "Removes all enfeeblements from all targets, fully restores their HP, and grants them a barrier of 3d6 HP. Angel Feathers can remove Knocked Out, Weakness and Brink of Death. *This ability also targets characters outside the encounter map. When doing so, move these targets to an empty square within 5 squares of this character after resolving the ability's effects.", hitType: "None", damageType: "Effect", baseValue: "3d6", effectTarget: "Angel Feathers:Clear Enfeeblements,Heal(999)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        smn: {
            job: "SMN",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/SMN.png",
            role: "DPS / Summoner",
            level: 30,
            resources: {
                hitPoints: 21, hitPoints_max: 21, magicPoints: 5, magicPoints_max: 5,
                resource: "Aetherflow", resourceValue: 2, resourceValue_max: 2, 
                resource2: "Arcanum", resource2Value: 0, resource2Value_max: 1,
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "full", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 1, dex: 3, vit: 1, int: 5, mnd: 2, defense: 13, magicDefense: 15, vigilance: 12, speed: 5 },
            traits: [
                { title: "Aetherdam", effect: "Certain effects grant you Aetherflow. You can have up to 2 stacks of Aetherflow at any given time. At the start of an encounter and each new phase, gain 2 stacks of Aetherflow." },
                { title: "Aethercharge", effect: "While under the effect of Aethercharge, Ruin II and Outburst have additional effects. Aethercharge is removed at the end of your turn." },
                { title: "Enhanced Aethercharge", effect: "Certain effects grant you Gemstone Arcanum. You can have up to 1 Gemstone Arcanum at any given time." },
                { title: "Summon Carbuncle", effect: "At the start of every encounter, summon Carbuncle in your starting square. Carbuncle is resummoned any time you recover from being Knocked Out, as well as at the start of a new phase if it isn't already present on the encounter map.\n\nYour pet will transform when you use Summon Gem." },
                { title: "Carbuncle", effect: "You can summon a pet (Carbuncle) to aid you during encounters. Your pet is immune to all effects other than those caused by your traits and abilities, and can enter and end its movement in occupied squares. Other characters may also move through or end their turn in the same square as your pet. So long as your pet remains on the encounter map, you benefit from the effects of its traits.\n  During encounters, your pet takes its turn immediately before you. On its turn, a pet can perform a standard movement action to move up to its Speed and use one of its abilities. It cannot perform any other actions.\n  Your pet is immediately dismissed and removed from the encounter map when you are Knocked Out.\n  If your pet is already present on the encounter map, any effects that would summon a pet are ignored." }
            ],
            abilities: {
                primary: [
                    { title: "Ruin II", type: "Primary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage to the target. If this ability is used while under the effect of Aethercharge, deals an additional 1d6 damage.", directHit: "Deals an additional 2d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", conditionalValue: "Aethercharge(1d6)", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/ruin-ii.png" },
                    { title: "Outburst", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 2 damage to all targets. If this ability is used while under the effect of Aethercharge, deals an additional 1d6 damage.", directHit: "Deals an additional 1d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", conditionalValue: "Aethercharge(1d6)", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/outburst.png" },
                    { title: "Resurrection", type: "Primary, Magic, Invoked", cost: 3, uses: 0, uses_max: 0, resource: "MP", target: "1 Knocked Out character", range: "5 squares*", check: "Special (d20, Critical)", baseEffect: "Removes Knocked Out from the target, then restores 1d6 + 2 HP, grants Transcendent, and afflicts them with Weakness. *This ability can also target a character outside the encounter map. When doing so, move the target to an empty square within range after resolving the ability's effects.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 2", effectTarget: "Raise", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/resurrection.png" },
                    { title: "Gemshine", type: "Primary, Magic, Gem, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", condition: "This ability has additional effects determined by your pet.", target: "Single", range: "10 squares", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 4 damage to the target.", directHit: "Deals an additional 2d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "4", dhValue: "2d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/gemshine.png" },
                    { title: "Precious Brilliance", type: "Primary, Magic, Gem, Invoked", cost: 3, uses: 0, uses_max: 0, resource: "MP", condition: "This ability has additional effects determined by your pet", target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 3 damage to all targets.", directHit: "Deals an additional 1d6 damage.", stat: "INT", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "3", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/precious-brilliance.png" },
                    { title: "Sleep", type: "Primary, Magic, Invoked", cost: 2, resource: "MP", uses: 0, uses_max: 0, target: "All enemies within range", range: "A 5x5 area within 10 squares of this character", check: "INT (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Inflicts Sleep on all targets.", directHit: "Removes all markers generated by all targets.", stat: "INT", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", baseValue: "", dhValue: "", effectSelf: "", effectTarget: "Sleep", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/sleep.png" }
                ],
                secondary: [
                    { title: "Heel", type: "Secondary", cost: 0, uses: 0, uses_max: 0, target: "Your pet", range: "The entire encounter map", baseEffect: "Move your pet to 1 square occupied by this character.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/PET/heel.png" },
                    { title: "Aethercharge", type: "Secondary", cost: 0, uses: 0, uses_max: 0, condition: "You have Carbuncle summoned", baseEffect: "Grants Aethercharge until the end of this turn and 1 Gemstone Arcanum.", hitType: "None", damageType: "Effect", restore: "1 Arcanum", effectSelf: "Aethercharge", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/aethercharge.png" },
                    { title: "Lucid Dreaming", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Recover an additional 1 MP at the end of this round's [Adventurer Step].", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Lucid Dreaming", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/lucid-dreaming.png" },
                    { title: "Physick", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 HP to the target.", hitType: "Critical", damageType: "Healing", baseValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SCH/physick.png" }
                ],
                instant: [
                    { title: "Summon Carbuncle", type: "Instant", cost: 0, uses: 0, uses_max: 0, trigger: "At the start of an encounter or phase, or after recovering from being Knocked Out", condition: "Pet is not summoned", baseEffect: "Summons Carbuncle to a square occupied by this character.", hitType: "None", damageType: "Effect", effectSelf: "Carbuncle(1)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/summon-carbuncle.png" },
                    { title: "Summon Gem", type: "Instant", cost: 1, resource: "Arcanum", uses: 0, uses_max: 0, trigger: "When your pet begins its turn", baseEffect: "Transforms your pet into Ruby Carbuncle, Topaz Carbuncle or Emerald Carbuncle until the start of your pet's next turn.", hitType: "None", damageType: "Effect", combo: "Ruby(damageType:Effect|selfEffects:Ruby|targetEffects:Ruby), Topaz(damageType:Effect|selfEffects:Topaz|targetEffects:Topaz), Emerald(damageType:Effect|selfEffects:Emerald|targetEffects:Emerald)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/summon-gem.png" },
                    { title: "Energy Drain", type: "Instant, Magic", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", target: "Single", range: "10 squares", baseEffect: "Deals 3 damage to the target and grants 2 stacks of Aetherflow.", limitation: "Once per phase", hitType: "None", damageType: "Damage", baseValue: "3", restore: "2 Aetherflow", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/energy-drain.png" },
                    { title: "Swiftcast", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Immediately use one of your magic abilities.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/swiftcast.png" },
                    { title: "Addle", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy is resolved", target: "The enemy that triggered this ability", range: "5 squares", baseEffect: "Reduces the damage dealt by the target's abilities by 2 until the end of this turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Addle", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/addle.png" },
                    { title: "Fester", type: "Instant, Magic", cost: 1, resource: "Aetherflow", uses: 0, uses_max: 0, trigger: "When any character ends their turn", target: "Single", range: "10 squares", baseEffect: "Deals 5 damage to the target.", hitType: "None", damageType: "Damage", baseValue: "5", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/SMN/fester.png" }
                ],
                limit: [
                    { title: "Teraflare", type: "Limit Break", cost: 0, uses: 1, uses_max: 1, trigger: "Any time", condition: "Limit Breaks have been made available for this encounter.", target: "All enemies within range", range: "The entire encounter map*", baseEffect: "Deals 3d6 damage to all targets. This ability has additional effects determined by your pet.\n-Ruby: Deals an additional 1d6 damage.\n-Topaz: Reduces the damage all allies take from abilities by 3 until the end of this turn.\n-Emerald: All allies may move up to 1 square.\n-Other: Deals an additional 2 damage.", hitType: "None", damageType: "Damage", baseValue: "3d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        war: {
            job: "WAR",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/WAR.png",
            role: "Tank / Warrior",
            level: 30,
            resources: {
                hitPoints: 35, hitPoints_max: 35, magicPoints: 5, magicPoints_max: 5,
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 4, dex: 2, vit: 5, int: 0, mnd: 1, defense: 15, magicDefense: 12, vigilance: 11, speed: 5 },
            traits: [
                { title: "Combo", effect: "After resolving the effects of an ability with Combo, you may use one of the specified abilities at any point during your turn. You may move before doing so, and may choose a new target when using this additional ability." }
            ],
            abilities: {
                primary: [
                    { title: "Warrior Combo (Heavy Swing + Maim)", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target. Combo: Storm's Path", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectTarget: "Enmity(5)", combo: "Storm's Path", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WAR/warrior-combo.png" },
                    { title: "Overpower", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "All targets within range", range: "A 5x5 area centered on this character", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Inflicts Enmity on all targets.", directHit: "Deals 2 damage to all targets.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "", dhValue: "2", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WAR/overpower.png" },
                    { title: "Tomahawk", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "5 squares", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WAR/tomahawk.png" },
                    { title: "Storm's Path", type: "Primary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", check: "STR (d20 + 4)", cr: "Target's Defense", baseEffect: "Deals 2 damage and inflicts Enmity on the target. Restores 2 HP.", directHit: "Deals an additional 1d6 damage.", stat: "STR", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", restore: "2 HP", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WAR/storms-path.png" }
                ],
                secondary: [
                    { title: "Berserk", type: "Secondary", cost: 0, uses: 3, uses_max: 3, baseEffect: "Your abilities deal an additional 2 damage until the end of this turn.", limitation: "Three times per phase", hitType: "None", damageType: "Effect", hitDie: "1d20cs20", effectSelf: "Berserk(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WAR/berserk.png" },
                    { title: "Rampart", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Reduces the damage you take from abilities by 2 until the start of your next turn.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Rampart(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/rampart.png" },
                    { title: "Low Blow", type: "Secondary, Physical", cost: 0, uses: 0, uses_max: 0, target: "Single", range: "1 square", baseEffect: "Stuns the target until the end of this turn.", hitType: "None", damageType: "Effect", effectTarget: "Stun", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/low-blow.png" }
                ],
                instant: [
                    { title: "Provoke", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When an enemy begins their turn", target: "The enemy that triggered this ability", range: "10 squares", baseEffect: "Inflicts Enmity on the target.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Enmity(5)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/provoke.png" },
                    { title: "Reprisal", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before an ability used by an enemy within 2 squares is resolved", target: "All enemies within range", range: "A 5x5 area centered on this character", baseEffect: "Reduces the damage dealt by the abilities of all targets by 2 until the end of this round.", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectTarget: "Reprisal(2)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/reprisal.png" },
                    { title: "Thrill of Battle", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "Immediately before you take damage", baseEffect: "Restores 1d6 + 2 HP and grants a barrier equaling the amount of HP restored that exceeds your Max HP.", hitType: "None", damageType: "Healing", baseValue: "1d6 + 2", effectSelf: "Thrill of Battle", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WAR/thrill-of-battle.png" },
                    { title: "Interject", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When an adjacent enemy uses an invoked ability, or is using an invoked ability to generate a marker", target: "The enemy that triggered this ability", range: "1 square", baseEffect: "Interrupts the invoked ability that triggered Interject, negating it completely.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Tank/interject.png" }
                ],
                limit: [
                    { title: "Land Waker", type: "Limit Break, Physical", cost: 0, uses: 1, uses_max: 1, condition: "Limit Breaks have been made available for this encounter.", trigger: "Immediately before 1 or more allied adventurers take damage", baseEffect: "Makes you the sole target of all damage inflicted by the effect that triggered Land Waker and halves the damage you take (rounded up). If Land Waker was triggered by an effect caused by a character, you may deal damage equaling the amount of HP you lost to that character.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        },
        whm: {
            job: "WHM",
            jobIcon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Jobs/WHM.png",
            role: "Healer / White Mage",
            level: 30,
            resources: {
                hitPoints: 24, hitPoints_max: 24, magicPoints: 5, magicPoints_max: 5,
                resource: "", resourceValue: 0, resourceValue_max: 0, 
                resource2: "none", resource2Value: 0, resource2Value_max: 0, 
                resource3: "none", resource3Value: 0, resource3Value_max: 0, 
                range1: 0, range1_max: 0, range2: 0, range2_max: 0, range3: 0, range3_max: 0, 
                resourceReset: "", hasBestial: "false", hasNadi: "false", hasOpo: "false", hasTechniques: "false"
            },
            attributes: { str: 1, dex: 1, vit: 2, int: 3, mnd: 5, defense: 11, magicDefense: 14, vigilance: 15, speed: 5 },
            traits: [
            ],
            abilities: {
                primary: [
                    { title: "Stone II", type: "Primary, Magic, Earth-Aspected, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Deals 2 damage to the target.", directHit: "Deals an additional 1d6 damage.", stat: "MND", hitType: "Hit", damageType: "Damage", hitDie: "1d20cs20", baseValue: "2", dhValue: "1d6", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/stone-ii.png" },
                    { title: "Medica", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "All allies within range", range: "a 5x5 area centered on this character", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 + 3 HP to all targets.", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 3", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/medica.png" },
                    { title: "Raise", type: "Primary, Magic, Invoked", cost: 3, uses: 0, uses_max: 0, resource: "MP", target: "1 Knocked Out character", range: "5 squares*", check: "Special (d20, Critical)", baseEffect: "Removes Knocked Out from the target, then restores 1d6 + 3 HP, grants Transcendent, and afflicts them with Weakness. *This ability can also target a character outside the encounter map. When doing so, move the target to an empty square within range after resolving the ability's effects.", stat: "MND", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 3", effectTarget: "Raise", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/raise.png" },
                    { title: "Repose", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 5)", cr: "Target's Magic Defense", baseEffect: "Inflicts Sleep on target.", directHit: "Removes all markers generated by the target.", stat: "MND", hitType: "Hit", damageType: "Effect", hitDie: "1d20cs20", effectTarget: "Sleep", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Healer/repose.png" },
                    { title: "Cure II", type: "Primary, Magic, Invoked", cost: 2, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "MND (d20 + 5)", baseEffect: "Restores 2d6 + 7 HP", stat: "MND", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "2d6 + 7", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/cure-ii.png" }
                ],
                secondary: [
                    { title: "Cure", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", check: "Special (d20, Critical)", baseEffect: "Restores 1d6 + 1 HP to the target.", stat: "MND", hitType: "Critical", damageType: "Healing", hitDie: "1d20cs20", baseValue: "1d6 + 1", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/cure.png" },
                    { title: "Esuna", type: "Secondary, Magic, Invoked", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", baseEffect: "Removes a single enfeeblement of the target's choosing.", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Healer/esuna.png" },
                    { title: "Presence of Mind", type: "Secondary", cost: 0, uses: 1, uses_max: 1, resource: "MP", baseEffect: "Immediately use one of your magic abilities.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/presence-of-mind.png" },
                    { title: "Aero", type: "Secondary, Magic, Wind-Aspected", cost: 1, uses: 0, uses_max: 0, resource: "MP", target: "Single", range: "10 squares", baseEffect: "Inflicts a DOT (3) on the target.", hitType: "None", damageType: "Effect", effectTarget: "Aero(3)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/WHM/aero.png" },
                    { title: "Lucid Dreaming", type: "Secondary", cost: 0, uses: 1, uses_max: 1, baseEffect: "Recover an additional 1 MP at the end of this round's [Adventurer Step].", limitation: "Once per phase", hitType: "None", damageType: "Effect", effectSelf: "Lucid Dreaming", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/lucid-dreaming.png" }
                ],
                instant: [
                    { title: "Swiftcast", type: "Instant", cost: 0, uses: 1, uses_max: 1, trigger: "When any character ends their turn", baseEffect: "Immediately use one of your magic abilities.", limitation: "Once per phase", hitType: "None", damageType: "Effect", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/Caster/swiftcast.png" }
                ],
                limit: [
                    { title: "Pulse of Life", type: "Limit Break", cost: 0, uses: 1, uses_max: 1, trigger: "Any time", condition: "Limit Breaks have been made available for this encounter.", target: "All allied adventurers within range", range: "The entire encounter map*", baseEffect: "Removes all enfeeblements from all targets and fully restores their HP and MP. Pulse of Life can remove Knocked Out, Weakness and Brink of Death. *This ability also targets characters outside the encounter map. When doing so, move these targets to an empty square within 5 squares of this character after resolving the ability's effects.", hitType: "None", damageType: "Effect", effectTarget: "Pulse of Life:Clear Enfeeblements,Heal(999),Restore Magic(99)", icon: "https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Abilities/General/limit-break.png" }
                ]
            }
        }
    }
};

this.export.sheets = sheets;