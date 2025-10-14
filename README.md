# FFXIV TTRPG Custom Sheet for Roll20

An amateur custom character sheet for Roll20 using FFXIV's TTRPG rules.

The code is public domain, but the repository contains some icons and image assets from FFXIV for purposes of:

* Making it easier to get into the TTRPG for players of the MMO, by shared icons for jobs, abilities and enhancements/enfeeblements
* To make character sheets look cool

These images were taken from https://xivapi.com/docs/Icons and are hosted in this repository to mitigate risk of dead image links. Images stored in this repository can be assumed to be the intellectual property of Square Enix in all cases unless stated otherwise.

## Capabilities

The project is a work in progress, but its capabilities are as follows:

### Sheet basics

* Character sheet with customizable stats
* Customizable Traits, Titles, Minions and inventory
* Customizable abilities
* Editable list of enhancements/enfeeblements
* Stat rolls taking enhancements/enfeeblements into account
* Ability/damage rolls taking enhancements/enfeeblements into account and automatically expending/granting resources
* For combos, direct link to follow-up from the previous ability in the chat log
* Lock down editing of fields that players would never need to edit. (This feature is just to hide or block options that may be necessary during sheet creation but superfluous during play. Players can still open up full editing on their sheet if they choose to.)
* Quick actions to restore resources and reset effects on end of phase, rest and end of adventure.

### Automagic

* Automatic addition of self enhancements (Warrior, Black Mage, Bard, Astrologian)
* Automatic MP recovery and enhancement/enfeeblement expiration via [turn order mod](#ffxivturnorder)
* Buttons in ability rolls for quickly adding an enhancement/enfeeblement to any selected token via [chat/macro mod](#ffxivaddeffect)
* Quick setup for LV30 of some jobs

## APIs

### FFXIVTurnOrder

FFXIVTurnOrder is an API that performs MP and job resource recovery on tokens in Turn Order at the appropriate step:

* "End of Adventurer Step": All tokens with a sheet marked "adventurer" recover MP
* "End of Enemy Step": All tokens with a sheet marked "enemy" recover MP

Custom Turn Order entries need to be created that match the above names (without quotation marks).

Further, the API can manage execution and expirations of enhancements/enfeeblements on the following triggers:

* Start of encounter (On the first active turn in turnorder, can also be forced via chat API `!fft --start`)
* Start of step
* Start of turn
* End of turn
* End of step
* End of round

FFXIVTurnOrder will ignore if any turns pass in reverse or if it triggers due to a new turn being added to first in order.

#### Chat API

FFXIVTurnOrder manages resources automatically, but there's a chat API for on-the-fly configuration to for example only run it when desired, or rerun a specific turn.

A suggested way to use these could be to `!fft --stop` turn management until you have filled out the Turn Order, then `!fft --start` to begin turn management in a state where everything is set up correctly. This could avoid some unintentional turn effect triggers while adding to or sorting the Turn Order.

`!fft <options>`

##### Options

* `--help` - displays this breakdown in chat.
* `--clean` - cleans out the FFXIVCache data, used mostly to store effects applied to tokens for generic characters.
* `--block {X}` - block any turn management until X turns have passed in the turn order. Example: `!fft --block 5`
* `--config` - output the current configuration of FFXIVTurnOrder to chat.
* `--end` - blocks any turn management until the Turn Order has been rendered empty.
* `--force` - immediately carries out turn management on the current first in turn order.
* `--fx {X}` - enables/disables the effect management part of turn management. 1 or on to enable, 0 or off to disable. Example: `!fft --fx 0`
* `--recover {X}` - enables/disables the resource recovery part of turn management. 1 or on to enable. 0 or off to disable. Example: `!fft --recover 0`
* `--reset` - resets the configuration to standard: no blocks on turn management, all subsystems enabled.
* `--start` - removes any blocks on turn management and runs `--force` on the current first in turn order. For effect management, this will be treated as the start of the encounter.
* `--stop` - blocks all turn management until `--start` or `--reset` is called.

### FFXIVAddEffect

FFXIVAddEffect is a chat API that allows for adding arbitrary enhancements/enfeeblements to any given token or character.

`!ffe --{name} <options>`

#### Arguments

* `--{specification}` - The specification of the effect(s), a comma separated list of effect names and values. Examples: `!ffe --dot(3)`, `!ffe --dot(3),stun` 
  * `name` - The name of the effect, needs to match any of the available FFXIV effects.
  * `value`, Optional - An optional value in parentheses. Required for certain effects.

#### Options

* `--help` - displays this breakdown in chat.
* `--clean` - cleans out the FFXIVCache data, used mostly to store effects applied to tokens for generic characters.
* `--expire {X}` - when the effect should expire. **Default:** `turn`. Valid values are:
  * `encounterstart` - Start of an encounter
  * `stepstart` - Start of the [Adventurer Step]/[Enemy step], depending on the character's affiliation
  * `start` - Start of the character's turn
  * `turn` - End of the character's turn
  * `turn2` - End of the character's next turn
  * `step` - End of the [Adventurer Step]/[Enemy step], depending on the character's affiliation
  * `round` - End of this round. Triggers after the end of the [Enemy Step]
  * `phase` - End of phase
  * `encounter` - End of encounter
  * `rest` - After rest
  * `end` - After adventure/module
  * `permanent` - Never expires
  * `use` - On use
  * `damage` - When the character receives damage
* `--edit {X}` - whether the effect should be manually editable in the character sheet. 1 or on to enable editing, 0 or off to disable. **Default:** enabled.
* `--curable {X}` - if the effect can be removed by abilities like Esuna, or certain items. 1 or on to enable, 0 or off to disable. **Default:** disabled.
* `--dupe {X}` - how duplicates of the effect should be handled. **Default:** `allow`. Valid values are:
  * `allow` - any number of this effect can be added to the same character
  * `block` - the same effect cannot be applied again, and will be discarded if an attempt is made
  * `replace` - if the same effect is applied again, it will replace the previous instance
* `--t {X}` - the target. Default: `selected`. Valid values are:
  * `selected` - the selected token(s)
  * `mine` - the tokens controlled by the player who triggered this call
  * A character name
* `--l {X}` - the level of the effect, for any cases where that may matter. **Default:** no value.

#### Available effects

<details>

<summary>
Standard effects
</summary>

| Icon | Name | Matches |
| ---- | ---- | ------- |
| ![Aero icon](/Images/Effects/aero.png) | Aero (x) | `aero` |
| ![Aetherial Focus icon](/Images/Effects/augment.png) | Aetherial Focus | `afocus`, `aetherial focus` |
| ![Addle icon](/Images/Effects/addle.png) | Addle | `addle` |
| ![Advantage icon](/Images/Effects/advantage.png) | Advantage | `adv`, `advantage` |
| ![Astral Fire icon](/Images/Effects/astral-fire.png) | Astral Fire | `afire`, `astralf`, `astral fire` |
| ![Attribute Up icon](/Images/Effects/attribute-x.png) | Attribute Up (x) | `attr`, `attribute`, `attribute up` |
| ![Berserk icon](/Images/Effects/berserk.png) | Berserk | `berserk` |
| ![Blind icon](/Images/Effects/blind.png) | Blind | `blind` |
| ![Bind icon](/Images/Effects/bound.png) | Bind | `bind`, `bound` |
| ![Brink of Death icon](/Images/Effects/brink.png) | Brink of Death | `brink`, `brink of death` |
| ![Comatose icon](/Images/Effects/comatose.png) | Comatose | `coma`, `comatose` |
| ![Combust icon](/Images/Effects/combust.png) | Combust (x) | `combust` |
| ![Critical Up icon](/Images/Effects/critical-x.png) | Critical Up (x) | `crit`, `critical`, `critical up` |
| ![Curecast Focus icon](/Images/Effects/augment.png) | Curecast Focus | `ccast`, `curecast`, `curecast focus` |
| ![Damage Down icon](/Images/Effects/damage-down-x.png) | Damage Down (x) | `ddown`, `damage down` |
| ![Damage Reroll icon](/Images/Effects/dreroll.png) | Damage Reroll | `dreroll`, `damage reroll` |
| ![Damage Up icon](/Images/Effects/damage-up-x.png) | Damage Up (x) | `dps`, `dup`, `damage up` |
| ![Darkside icon](/Images/Effects/darkside.png) | Darkside | `dside`, `darkside` |
| ![Defender's Boon icon](/Images/Effects/augment.png) | Defender's Boon | `dboon`, `defender's boon`, `defenders boon` |
| ![Deflecting Edge icon](/Images/Effects/augment.png) | Deflecting Edge | `edge`, `dedge`, `deflecting`, `deflecting edge` |
| ![Damage over time icon](/Images/Effects/dot-x.png) | DOT (x) | `dot` |
| ![Elemental Veil 1 icon](/Images/Effects/augment.png) | Elementail Veil I | `eveil`, `eveil1`, `eveili`, `eveil 1`, `eveil i`, <br/><br/>`elementail veil`, `elemental veil 1`, `elementail veil i` |
| ![Elemental Veil 2 icon](/Images/Effects/augment.png) | Elementail Veil II | `eveil2`, `eveilii`, `eveil 2`, `eveil ii`, <br/><br/>`elemental veil 2`, `elementail veil ii` |
| ![Enmity icon](/Images/Effects/enmity-x.png) | Enmity (x) | `enmity` |
| ![Flamecast focus icon](/Images/Effects/augment.png) | Flamecast Focus | `fcast`, `flamecast`, `flamecast focus` |
| ![Hawk's eye icon](/Images/Effects/hawks-eye.png) | Hawk's Eye | `hawk`, `hawke`, `heye`, `hawkeye`, <br/><br/>`hawk's eye`, `hawks eye` |
| ![Heavy icon](/Images/Effects/heavy.png) | Heavy | `heavy` |
| ![Icecast focus icon](/Images/Effects/augment.png) | Icecast Focus | `icast`, `icecast`, `icecast focus` |
| ![Improved padding icon](/Images/Effects/augment.png) | Improved Padding | `ipad`, `ipadding`, `improved padding` |
| ![Knocked out icon](/Images/Effects/knocked-out.png) | Knocked Out | `ko`, `kout`, `knocked`,  `knocked out` |
| ![Lightweight refit icon](/Images/Effects/augment.png) | Lightweight Refit | `refit`, `lrefit`, `lightweight refit` |
| ![Lucid Dreaming icon](/Images/Effects/lucid-dreaming.png) | Lucid Dreaming | `lucid`, `ldreaming`, `lucid dreaming` |
| ![Mage's Ballad icon](/Images/Effects/mages-ballad.png) | Mage's Ballad | `mballad`, `mage's ballad`, `mages ballad` |
| ![Magic Damper icon](/Images/Effects/augment.png) | Magic Damper | `damper`, `mdamper`, `magic damper` |
| ![Major Arcana icon](/Images/Effects/major-arcana.png) | Major Arcana | `marcana`, `major arcana` |
| ![Mana Conduit icon](/Images/Effects/augment.png) | Mana Conduit | `mconduit`, `mana conduit` |
| ![Masterwork Ornamentation icon](/Images/Effects/augment.png) | Masterwork Ornamentation | `mwork`, `masterwork`, `ornament`, `ornamentation`, `masterwork ornamentation` |
| ![Paralyze icon](/Images/Effects/paralyzed.png) | Paralyze | `paralysis`, `paralyze`, `paralyzed` |
| ![Petrify icon](/Images/Effects/petrified.png) | Petrify | `petrify`, `petrified` |
| ![Precision opener icon](/Images/Effects/augment.png) | Precision Opener | `popen`, `popener`, `precision opener` |
| ![Prone icon](/Images/Effects/prone.png) | Prone | `prone` |
| ![Raging strikes icon](/Images/Effects/raging-strikes.png) | Raging Strikes | `rstrikes`, `raging strikes` |
| ![Rampart icon](/Images/Effects/rampart.png) | Rampart | `rampart` |
| ![X Ready icon](/Images/Effects/ready-x.png) | (x) Ready | `ready` |
| ![Reprisal icon](/Images/Effects/reprisal.png) | Reprisal | `repr`, `reprisal` |
| ![Revivify icon](/Images/Effects/regen-x.png) | Revivify (x) | `regen`, `revivify` |
| ![Roll Up icon](/Images/Effects/roll-x.png) | Roll Up (x) | `roll`, `roll up` |
| ![Silence icon](/Images/Effects/silence.png) | Silence | `silence` |
| ![Sleep icon](/Images/Effects/sleep.png) | Sleep | `sleep` |
| ![Slow icon](/Images/Effects/slow.png) | Slow | `slow` |
| ![Stun icon](/Images/Effects/stun.png) | Stun | `stun` |
| ![Unstunnable icon](/Images/Effects/unstunnable.png) | Stun resistance | `unstun`, `unstunnable`, `stunresist`, `stun resistance` |
| ![Surging Tempest icon](/Images/Effects/surging-tempest.png) | Surging Tempest | `stempest`, `surging tempest` |
| ![Transcendent icon](/Images/Effects/transcendent.png) | Transcendent | `trans`, `transcendent` |
| ![Thunder icon](/Images/Effects/thunder.png) | Thunder (x) | `thunder` |
| ![Thunderhead Ready icon](/Images/Effects/thunderhead-ready.png) | Thunderhead Ready | `tready`, `thunderhead`, `thunderhead ready` |
| ![Umbral Ice icon](/Images/Effects/umbral-ice.png) | Umbral Ice | `uice`, `umbral ice` |
| ![Warding Talisman icon](/Images/Effects/warding-talisman.png) | Warding Talisman | `ward`, `talisman`, `wtalisman`, `warding talisman` |
| ![Weakness icon](/Images/Effects/weak.png) | Weakness | `weak`, `weakness` |

</details>

<br/>

<details>

<summary>
Ephemeral effects
</summary>

Ephemeral effects immediately execute an action when applied and do not persist afterward as a regular effect would.

| Name | Details | Matches |
| ---- | ------- | ------- |
| Barrier | Grants the given token or character a barrier with `value`.  | `barrier` |
| Clear Enfeeblements | Removes all enfeeblements on the given token or character. | `clear`, `cleare`, `clear enfeeblements` |
| Consume item | Consumes one count of the item with a name matching `value`. | `consume`, `consume item` |
| Damage | Inflicts `value` damage to the given token or character. | `damage` |
| Heal | Heals `value` HP on the given token or character. | `heal` |
| Restore | Restores usages of an ability Y by X, as given by `value` = `X\|Y`. | `restore` |
| Thrill of Battle | Heals `value` HP on the given token or character and grants a barrier for any overhealing. | `thrill`, `tbattle`, `thrill of battle` |
| Transpose | Switches Astral Fire to Umbral Ice and vice versaq on the given character. | `transpose` |

</details>

## Helpful Macros

### Add marker

Adds a marker to the end of the turn order, that will delete itself from the order once it arrives.

Using `AddCustomTurn`:

```bash
!act -1 1 --index 99 --?{Marker name|Marker} --delete-on-zero
```

With `SpawnDefaultToken`, to simultaneously spawn a token for the marker:

```bash
!act -1 1 --index 99 --?{Marker name|Marker} --delete-on-zero
!Spawn {{
   --name| <character sheet for marker token>
   --qty| 1
   --size| 3,3
   --offset| 0,2
}}
```

### Add FFXIVTurnOrder steps to turn order

Adds the custom turn orders used by the FFXIVTurnOrder API, with initiative values that should sort them correctly given 4 adventurers.

Using `AddCustomTurn`:

```bash
!act +0 5 --index 4 --End of Adventurer Step
!act +0 99 --index 99 --End of Enemy Step
```
