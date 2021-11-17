import GetPlayerPromptPromise from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetPlayerPromptPromise';

// noinspection JSUnusedGlobalSymbols
export default class Ib_GetSamePromptAllPlayers {
    constructor(hostWs, players, promptType, promptData, timeLimit, functionsToRunOnIndividualResolve) {
        this.hostWs = hostWs;
        this.players = players;
        this.playerAnswers = [];
        this.promptType = promptType;
        this.promptData = promptData;
        this.timeLimit = timeLimit;
        this.functionsToRunOnIndividualResolve = functionsToRunOnIndividualResolve;
    }

    ask() {
        this.playerPromptPromises = this.players.players.map((player)=> new GetPlayerPromptPromise(this.hostWs, player.id, this.promptType, this.promptData, this.timeLimit, this.functionsToRunOnIndividualResolve));
        return Promise.all(this.playerPromptPromises);
    }

    forceEnd() {
        if(this.playerPromptPromises){
            this.playerPromptPromises.forEach(ppp => ppp.forceEnd());
        }
    }
}