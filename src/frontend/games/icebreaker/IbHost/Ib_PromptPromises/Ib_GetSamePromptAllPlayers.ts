import GetPlayerPromptPromise from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetPlayerPromptPromise';
import Players from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Players';
import GameWebSocket from 'Frontend/GameWebSocket';

export default class Ib_GetSamePromptAllPlayers {
    private hostWs: any;
    private players: Players;
    private playerAnswers: any[];
    private promptType: string;
    private promptData: any;
    private timeLimit: number;
    private functionsToRunOnIndividualResolve: any;
    private resolve: any;
    private playerPromptPromises: any;

    constructor(hostWs: GameWebSocket, players: Players, promptType: string, promptData: any, timeLimit: number, functionsToRunOnIndividualResolve:{(resolvedValue: any): void}[]) {
        this.hostWs = hostWs;
        this.players = players;
        this.playerAnswers = [];
        this.promptType = promptType;
        this.promptData = promptData;
        this.timeLimit = timeLimit;
        this.functionsToRunOnIndividualResolve = functionsToRunOnIndividualResolve;
    }

    // Resolves into an array of Ib_PlayerPromptResponse.js
    then(resolve): Promise<any> {
        this.resolve = resolve;
        this.playerPromptPromises = this.players.players.map((player)=> new GetPlayerPromptPromise(this.hostWs, player.id, this.promptType, this.promptData, this.timeLimit, this.functionsToRunOnIndividualResolve));
        return Promise.all(this.playerPromptPromises).then((ppps)=>resolve(ppps));
    }

    forceEnd() {
        if(this.playerPromptPromises){
            this.playerPromptPromises.forEach(ppp => ppp.forceEnd());
            this.resolve(this.playerPromptPromises);
        }
    }
}