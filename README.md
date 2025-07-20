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
* Automatic MP recovery and enhancement/enfeeblement expiration via [turn order mod](#ffxivendofstep)
* Buttons in ability rolls for quickly adding an enhancement/enfeeblement to any selected token via [chat/macro mod](#ffxivaddeffect)

Further features like a Charactermancer for automatic setup of abilities and stats depending on job and level is in development.

## APIs

### FFXIVTurnOrder

FFXIVTurnOrder is an API that performs MP and job resource recovery on tokens in Turn Order at the appropriate step:

* "End of Adventurer Step": All tokens with a sheet marked "adventurer" recover MP
* "End of Enemy Step": All tokens with a sheet marked "enemy" recover MP

Custom Turn Order entries need to be created that match the above names (without quotation marks).

Further, the API can manage expirations of enhancements/enfeeblements on the following triggers:

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

* `--{name}` - Required: The name of the effect. Example: `!ffe --dot`

#### Options

* `--help` - displays this breakdown in chat.
* `--v {X}` - the value for the effect, useful for some effects like attribute(x), which expects a value to apply to an attribute. **Default:** no value.
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
