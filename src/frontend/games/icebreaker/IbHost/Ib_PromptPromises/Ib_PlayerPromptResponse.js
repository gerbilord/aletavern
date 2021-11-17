export default class Ib_PlayerPromptResponse {

    constructor() {
    }

    setPromptType(promptType){
        this.promptType = promptType;
    }

    getPromptType(){
        return this.promptType;
    }

    setPlayerResponse(playerResponse){
        this.playerResponse = playerResponse;
    }

    getPlayerResponse() {
        return this.playerResponse;
    }

    setPlayerId(playerId){
        this.playerId = playerId;
    }

    getPlayerId(){
        return this.playerId;
    }
}