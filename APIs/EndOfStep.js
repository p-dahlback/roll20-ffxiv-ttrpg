/*
    EndOfStep.js

    An API that performs MP recovery for respective Adventurer and Enemy teams when encountering the following custom turn orders:
    * End of Adventurer Step
    * End of Enemy Step
  
    MP update is performed on token bar3. Tokens need to be attached to a sheet to check the attributes:
    * mpRecovery - an integer value of how much MP will be recovered at the end of a given step
    * team - string value controlling which steps will trigger recovery. Valid values are "adventurer" or "enemy".
*/
on('ready', () => {

    const resolver = (token, character) => {
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