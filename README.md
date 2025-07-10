# FFXIV TTRPG Custom Sheet for Roll20

An amateur custom character sheet for Roll20 using FFXIV's TTRPG rules.

The code is public domain, but the repository contains some icons and image assets from FFXIV for purposes of:

* Making it easier to get into the TTRPG for players of the MMO, by shared icons for jobs, abilities and enhancements/enfeeblements
* To make character sheets look cool

These images were taken from https://xivapi.com/docs/Icons and are hosted in this repository to mitigate risk of dead image links. Images stored in this repository can be assumed to be the intellectual property of Square Enix in all cases unless stated otherwise.

## Capabilities

The project is a work in progress, but its capabilities are as follows:

* Character sheet with customizable stats
* Customizable Traits, Titles, Minions and inventory
* Customizable abilities
* Editable list of enhancements/enfeeblements
* Stat rolls taking enhancements/enfeeblements into account
* Ability/damage rolls taking enhancements/enfeeblements into account and automatically expending/granting resources
* For combos, direct link to follow-up from the previous ability in the chat log
* Ability to lock down editing of fields that players would never need to edit. (This feature is just to hide or block options that may be necessary during sheet creation but superfluous during play. Players can still open up full editing on their sheet if they choose to.)

Automatic management of some job specific features (like Black Mage's Umbral/Astral modes and their effect on MP cost and damage rolls) are not yet developed.

Further features like a Charactermancer for automatic setup of abilities and stats depending on job and level is in development.

## APIs

Included is an API EndOfStep that performs MP and job resource recovery on tokens in Turn Order at the appropriate step:

* "End of Adventurer Step": All tokens with a sheet marked "adventurer" recover MP
* "End of Enemy Step": All tokens with a sheet marked "enemy" recover MP

Custom Turn Order entries need to be created that match the above names (without quotation marks).

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
   --offset| 0,1
}}
```

### Add EndOfStep to turn order

Adds the custom turn orders used by the EndOfStep API, with initiative values that should sort them correctly given 4 adventurers.

Using `AddCustomTurn`:

```bash
!act +0 5 --index 4 --End of Adventurer Step
!act +0 99 --index 99 --End of Enemy Step
```
