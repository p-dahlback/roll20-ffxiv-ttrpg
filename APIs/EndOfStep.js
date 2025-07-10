/*
    EndOfStep.js

    An API that performs resource recovery for respective Adventurer and Enemy teams when encountering the following custom turn orders:
    * End of Adventurer Step
    * End of Enemy Step
  
    MP update is performed on token bar3. Tokens need to be attached to a sheet to check the attributes:
    * mpRecovery - an integer value of how much MP will be recovered at the end of a given step
    * team - string value controlling which steps will trigger recovery. Valid values are "adventurer" or "enemy".
    
    Resource update is only performed on sheets with "sheet_type" attribute set to "unique". The sheet will also be checked for the following attributes:
    * resource - The name of the resource
    * resourceValue - The current and max values of the resource
    * resourceRecovery - an integer value of how much resource will be recovered at the end of the given step
    
    For jobs with additional resources like Monk, the additional resource can also be updated:
    * resource2 - The name of the secondary resource
    * resource2Value - The current and max values of the secondary resource
    * resource2Recovery - an integer value of how much secondary resource will be recovered at the end of the given step
*/
on('ready', () => {

    const resourceResolver = (character, resource) => {
        let sheetType = getAttrByName(character.id, "sheet_type")
        if (sheetType != "unique") {
            return
        }

        let resourceName = getAttrByName(character.id, resource)
        if (!resourceName) {
            return
        }

        var resourceObject = findObjs({ type: "attribute", characterid: character.id, name: `${resource}Value` })[0]
        if (!resourceObject) {
            log("EndOfStep: No resource")
            return
        }
        let recovery = getAttrByName(character.id, `${resource}Recovery`) ?? 0
        if (recovery <= 0) {
            return
        }
        let currentValue = parseInt(resourceObject.get("current") ?? "0")
        let max = parseInt(resourceObject.get("max") ?? "0")
        if (max <= 0) {
            return
        }

        let updatedValue = Math.min(currentValue + parseInt(recovery), max)

        resourceObject.set("current", updatedValue)
        return `Recovered ${recovery} ${resourceName} (${currentValue} -> ${updatedValue}/${max})`
    }

    const mpResolver = (token, character) => {
        var mpObject = findObjs({ type: "attribute", characterid: character.id, name: "magicPoints" })[0]
        if (!mpObject) {
            log("EndOfStep: No MP")
            return
        }
        let mpRecovery = getAttrByName(character.id, "mpRecovery") ?? "2"
        if (mpRecovery <= 0) {
            return
        }
        let currentMp = parseInt(token.get("bar3_value") ?? "0")
        let maxMp = parseInt(token.get("bar3_max") ?? "0")
        if (maxMp <= 0) {
            return
        }

        let updatedMp = Math.min(currentMp + parseInt(mpRecovery), maxMp)

        token.set("bar3_value", updatedMp)
        return `Recovered ${mpRecovery} MP (${currentMp} -> ${updatedMp}/${maxMp})`
    }

    const resolver = (token, character) => {
        let summaries = [
            mpResolver(token, character),
            resourceResolver(character, "resource"),
            resourceResolver(character, "resource2")
        ].filter(element => element)

        return summaries.join("\n")
    }

    const teamForStep = (step) => {
        switch (step.custom) {
            case "End of Adventurer Step":
                return "adventurer"
            case "End of Enemy Step":
                return "enemy"
            default:
                return ""
        }
    }

    function checkTurnOrder(obj, prev) {
        let turnOrder = JSON.parse(obj.get("turnorder") ?? "[]")
        let previousTurnOrder = JSON.parse(prev.turnorder ?? "[]")
        let firstInTurn = turnOrder.length > 0 ? turnOrder[0] : { id: "-1" }
        let previousFirstInTurn = previousTurnOrder.length > 0 ? previousTurnOrder[0] : { id: "-1" }

        if (firstInTurn.id === previousFirstInTurn.id) {
            return
        }

        let affectedTeam = teamForStep(firstInTurn)
        if (!affectedTeam) {
            return
        }

        for (let turn of turnOrder) {
            let token = getObj("graphic", turn.id)
            if (!token || !token.get("represents")) {
                continue
            }
            let character = getObj("character", token.get("represents"))
            let team = getAttrByName(character.id, "team")
            if (team != affectedTeam) {
                continue
            }
            let content = resolver(token, character)
            try {
                sendChat(token.get("name"), content)
            } catch(e){
                log(`EndOfStep: ERROR PARSING: ${content}`)
                log(`EndOfStep: ERROR: ${e}`)
            }
        }
    }

    on(
        'change:campaign:turnorder',
        (obj, prev) => setTimeout(() => checkTurnOrder(Campaign(), prev), 1000)
    )
})