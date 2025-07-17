/*
    FFXIVAddEffect.js

    An API that enables adding FFXIV TTRPG effects to any given character from Macros.

*/
const FFXIVAddEffect = (() => {

    const scriptName = "FFXIVAddEffect"
    const version = "0.1.0"

    const types = [
        { matches: ["advantage"], type: "advantage", name: "Advantage" },
        { matches: ["attribute", "attribute(x)"], type: "attribute(x)", name: "Attribute Up(X)" },
        { matches: ["blind"], type: "blind", name: "Blind" },
        { matches: ["bind", "bound"], type: "bound", name: "Bound" },
        { matches: ["brink"], type: "brink", name: "Brink of Death" },
        { matches: ["comatose"], type: "comatose", name: "Comatose" },
        { matches: ["enmity", "enmity(x)"], type: "enmity(x)", name: "Enmity(X)" },
        { matches: ["critical", "critical(x)"], type: "critical(x)", name: "Critical Up(X)" },
        { matches: ["damage"], type: "damage", name: "Damage Reroll" },
        { matches: ["dot", "dot(x)"], type: "dot(x)", name: "DOT(X)" },
        { matches: ["heavy"], type: "heavy", name: "Heavy" },
        { matches: ["paralyzed", "paralysis"], type: "paralyzed", name: "Paralyzed" },
        { matches: ["petrified", "petrify"], type: "petrified", name: "Petrified" },
        { matches: ["prone"], type: "prone", name: "Prone" },
        { matches: ["ready"], type: "ready", name: "X Ready" },
        { matches: ["regen", "regen(x)", "revivify", "revivify(x)"], type: "regen(x)", name: "Regen(X)" },
        { matches: ["roll", "roll(x)"], type: "roll(x)", name: "Roll Up(X)" },
        { matches: ["silence"], type: "silence", name: "Silence" },
        { matches: ["sleep"], type: "sleep", name: "Sleep" },
        { matches: ["stun"], type: "stun", name: "Stun" },
        { matches: ["unstunnable"], type: "unstunnable", name: "Unstunnable" },
        { matches: ["weak"], type: "weak", name: "Weak" }
    ]

    const expiries = [
        "use",
        "damage",
        "turn",
        "turn2",
        "phase",
        "encounter",
        "rest",
        "end",
        "permanent",
        "ephemeral"
    ]

    const generateUUID = (() => {
        let a = 0
        let b = []
        return () => {
            let c = (new Date()).getTime() + 0
            let f = 7
            let e = new Array(8)
            let d = c === a
            a = c
            for (; 0 <= f; f--) {
                e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64)
                c = Math.floor(c / 64)
            }
            c = e.join("")
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--) {
                    b[f] = 0
                }
                b[f]++
            } else {
                for (f = 0; 12 > f; f++) {
                    b[f] = Math.floor(64 * Math.random())
                }
            }
            for (f = 0; 12 > f; f++) {
                c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f])
            }
            return c
        }
    })()

    const generateRowID = () => generateUUID().replace(/_/g, "Z")

    const getIconForEffectType = (type, specialType) => {
        if (type == "none") {
            return ""
        }
        if (type == "special") {
            let imageName = specialType.toLowerCase().replace("'", "").replace(" ", "-")
            return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`
        }

        let imageName = type.replace("(x)", "-x")
        return `https://raw.githubusercontent.com/p-dahlback/roll20-ffxiv-ttrpg/refs/heads/main/Images/Effects/${imageName}.png`
    }

    const getCharacters = (msg, target) => {
        if (target == "selected") {
            let tokens = msg.selected
            if (!tokens) {
                return { result: [], error: "Select a token to apply an status effect." }
            }

            var characters = []
            for (let token of tokens) {
                if (token._type != "graphic") {
                    continue
                }
                let object = getObj("graphic", token._id)
                if (!object || !object.get("represents")) {
                    log("FFXIVAddEffect: No representation for token; skipping")
                    continue
                }
                let character = getObj("character", object.get("represents"))
                characters.push(character)
                log("FFXIVAddEffect: Adding character " + JSON.stringify(character))
            }
            return { result: characters, error: null }
        } else if (target == "mine") {
            let characters = findObjs({ type: "character", controlledby: msg.playerid })
            if (characters) {
                log("FFXIVAddEffect: Adding characters " + JSON.stringify(characters))
                return { result: characters, error: null }
            } else {
                log("FFXIVAddEffect: No characters controlled by player")
                return { result: [], error: "No available controlled characters to apply status effects to." }
            }
        } else {
            log("FFXIVAddEffect: Searching for character " + target)
            let characters = findObjs({ type: "character", name: target })
            if (characters) {
                log("FFXIVAddEffect: Adding characters " + JSON.stringify(characters))
                return { result: characters, error: null }
            } else {
                log("FFXIVAddEffect: No characters named " + target)
                return { result: [], error: `No characters named ${target}` }
            }
        }
    }

    const unpackNaN = (value) => {
        let intValue = parseInt(value)
        if (isNaN(intValue)) {
            return 0
        }
        return intValue
    }

    const unpackAttribute = (character, name, defaultValue) => {
        let attribute = findObjs({ type: "attribute", characterid: character.id, name: name })
        if (!attribute || attribute.length == 0) {
            return {
                fake: {
                    name: name,
                    characterid: character.id
                },
                get: (key) => {
                    if (key == "name") {
                        return name
                    }
                    if (key == "current") {
                        return defaultValue
                    }
                    return ""
                }
            }
        }
        return attribute[0]
    }

    const setAttribute = (attribute, key, value) => {
        if (attribute.fake) {
            var settings = {
                name: attribute.fake.name,
                characterid: attribute.fake.characterid
            }
            settings[key] = value
            createObj("attribute", settings)
        } else {
            attribute.set(key, value)
        }
    }

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

    const getEffectsWithName = (name, character) => {
        let objects = findObjs({ type: "attribute", characterid: character.id, current: name })
        let effects = objects.reduce((accumulator, object) => {
            let objectName = object.get("name")
            let normalizedName = objectName.toLowerCase()
            if (!normalizedName.includes("repeating_effects") || !normalizedName.includes("type")) {
                return accumulator
            }
            let id = objectName.replace("repeating_effects_", "").replace(/_\w*[Tt]{1}ype/, "")
            accumulator.push({
                id: id,
                characterid: character.id
            })
            return accumulator
        }, [])
        return effects
    }

    const performAdditionalEffectChanges = (effect, character) => {
        switch (effect.specialType.toLowerCase()) {
            case "astral fire": {
                // Clear MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off")
                setAttribute(mpRecoveryBlock, "current", "on")
                break
            }
            case "barrier": {
                let barrierPoints = unpackAttribute(character, "barrierPoints", 0)
                let currentPoints = unpackNaN(barrierPoints.get("current"))
                let value = unpackNaN(effect.value)

                setAttribute(barrierPoints, "current", Math.max(currentPoints, value))
                break
            }
            case "umbral ice": {
                // Reset MP recovery
                let mpRecoveryBlock = unpackAttribute(character, "mpRecoveryBlock", "off")
                setAttribute(mpRecoveryBlock, "current", "off")
                break
            }
        }
    }

    const addEffect = (effect) => {
        let summaryIntro = `${effect.typeName.replace("X", effect.value)} to `
        var summaries = []

        log(`FFXIVAddEffect: Adding effect ${effect.typeName} to ${effect.characters.length} character(s)`)
        for (let character of effect.characters) {
            let existingEffects = getEffectsWithName(effect.specialType ?? effect.type, character)
            if (effect.duplicate === "block") {
                if (existingEffects.some(element => element.characterid === character.id)) {
                    log(`FFXIVAddEffect: Skipping ${character.get("name")} due to duplicate effect`)
                    continue
                }
            }

            var update = false
            var id = ""
            if (effect.duplicate == "replace") {
                let duplicate = existingEffects.find(element => element.characterid == character.id)
                if (duplicate) {
                    // Overwrite the contents of the effect with the new specification
                    id = duplicate.id
                    update = true
                    log(`FFXIVAddEffect: Replacing existing effect`)
                } else {
                    id = generateRowID()
                }
            } else {
                id = generateRowID()
            }

            if (effect.expiry != "ephemeral") {
                let attributes = {
                    icon: effect.icon,
                    type: effect.type,
                    specialType: effect.specialType,
                    value: effect.value,
                    expiry: effect.expiry,
                    editable: effect.editable == "1" ? "on" : "off",
                    curable: effect.curable == "1" ? "on" : "off",
                    origin: effect.origin
                }
                for (let entry of Object.entries(attributes)) {
                    if (!entry[1]) {
                        continue
                    }

                    if (update) {
                        let object = unpackAttribute(
                            character, 
                            `repeating_effects_${id}_${entry[0]}`, 
                            null
                        )
                        setAttribute(object, "current", entry[1])
                    } else {
                        createObj("attribute", {
                            name: `repeating_effects_${id}_${entry[0]}`,
                            current: entry[1],
                            characterid: character.id
                        })
                    }
                }
            }
            summaries.push(character.get("name"))
            performAdditionalEffectChanges(effect, character)
        }
        let summary = summaryIntro + summaries.join(", ")
        return { who: effect.who, summary: summary }
    }

    const outputEvent = (type, event) => {
        switch (type) {
            case "add":
                sendChat(event.who, `Added effect: <b>${event.summary}</b>. <i>(FFXIVAddEffect)</i>`)
                break

            case "error":
                sendChat("FFXIV Effects", `/w gm ${event}`)
                break

            default:
                log(`FFXIVAddEffect: Unrecognized type: ${type}`)
                break
        }
    }

    const handleInput = (msg) => {
        if ("api" === msg.type) {
            if (msg.content.match(/^!ffe(\b\s|$)/)) {
                let who = (getObj("player", msg.playerid) || { get: () => "API" }).get("_displayname")
                let args = msg.content.split(/\s+--/)

                let effect = {
                    id: "-1",
                    type: "none",
                    typeName: "",
                    specialType: "",
                    value: "1",
                    expiry: "turn",
                    editable: "1",
                    target: "selected",
                    characters: [],
                    player: msg.playerid,
                    who: who,
                    origin: "FFXIVAddEffect",
                    level: null
                }

                log("FFXIVAddEffect: Parsing command " + msg.content)
                args.forEach(a => {
                    let parts = a.split(/\s+/)
                    switch (parts[0].toLowerCase()) {
                        case "help":
                            return

                        case "v":
                            effect.value = parts[1]
                            break

                        case "expire":
                            let expiry = parts[1].toLowerCase()
                            if (expiries.includes(expiry)) {
                                effect.expiry = expiry
                            } else {
                                log("FFXIVAddEffect: Unrecognized expiry type " + expiry)
                                return
                            }
                            break

                        case "edit":
                            if (["0", "1"].includes(parts[1])) {
                                effect.editable = parts[1]
                            } else {
                                log("FFXIVAddEffect: Unrecognized editable type " + parts[1])
                                return
                            }
                            break

                        case "curable":
                            if (["0", "1"].includes(parts[1])) {
                                effect.curable = parts[1]
                            } else {
                                log("FFXIVAddEffect: Unrecognized curable type " + parts[1])
                                return
                            }
                            break

                        case "dupe":
                            if (["block", "replace", "allow"].includes(parts[1])) {
                                effect.duplicate = parts[1]
                            } else {
                                log("FFXIVAddEffect: Unrecognized dupe type " + parts[1])
                                return
                            }
                            break

                        case "t":
                            let target = parts.slice(1).join(" ")
                            effect.target = target
                            break
                        
                        case "l":
                            let parsedLevel = parseInt(parts[1])
                            if (isNaN(parsedLevel)) {
                                log("FFXIVAddEffect: Invalid level value " + parts[1])
                                return
                            }
                            effect.level = parsedLevel
                            break

                        default:
                            let name = parts.join(" ")
                            let match = types.find(type => type.matches.includes(name.toLowerCase())) ?? { type: "special" }
                            let specialType
                            if (match.type == "special") {
                                specialType = name
                                effect.typeName = name
                            } else {
                                specialType = ""
                                effect.typeName = match.name
                            }
                            effect.type = match.type
                            effect.specialType = specialType
                            break
                    }
                })
                if (effect.type == "none") {
                    log("FFXIVAddEffect: Found no matching effect for " + msg.content)
                    return
                }
                effect.icon = getIconForEffectType(effect.type, effect.specialType)
                let targetResult = getCharacters(msg, effect.target)
                if (targetResult.error) {
                    outputEvent("error", targetResult.error)
                    return
                }

                effect.characters = targetResult.result
                let event = addEffect(effect)
                if (!playerIsGM(msg.playerid)) {
                    outputEvent("add", event)
                }
            }
        }
    }

    const registerEventHandlers = () => {
        on("chat:message", handleInput)
    }

    on("ready", () => {
        state[scriptName] = {
            version: version
        }
        registerEventHandlers()
    })
})()