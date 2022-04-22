import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import Ib_GetSamePromptAllPlayers from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetSamePromptAllPlayers';
import MatchingPrompt from 'Icebreaker/IbHost/Rounds/HostAsksMatchingPromptToAll/MatchingPrompt';
import GameWebSocket from 'Frontend/GameWebSocket';
import Players from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Players';
import Player from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Player';
import Ib_PlayerPromptResponse from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_PlayerPromptResponse';

// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuestionRound {
    private hostWs: GameWebSocket;
    private players: Players;
    private promptData: MatchingPrompt;
    private timeLimit: number;
    private playerAnswers: any[];
    private playerAnswersHistory: any[];
    private playersYetToAnswer: Player[];
    private isRoundActive: boolean;
    private endRound: { (resolveValue): void; };
    private promptPromise: Ib_GetSamePromptAllPlayers;

    constructor(hostWs: GameWebSocket, players: Players) {
        this.hostWs = hostWs;
        this.players = players;

        this.promptData = new MatchingPrompt();
        this.timeLimit  = 0;
        this.playerAnswers = [];
        this.playerAnswersHistory = [];
        this.playersYetToAnswer = [];
        this.isRoundActive = false;
        this.getViewData = this.getViewData.bind(this);
    }

    // play round
    async then(endRound): Promise<void> {
        this.endRound = endRound;
    }

    setMainPrompt(newPrompt:string): void{
        this.promptData.mainPrompt = newPrompt;
    }

    addMatchable(newMatchable: string): void {
        this.promptData.matchables.push(newMatchable);
    }

    addCategory(newCategory: string): void {
        this.promptData.categories.push(newCategory);
    }

    resetPromptData(): void{
        this.promptData.matchables = [];
        this.promptData.categories = [];
    }

    resetPlayersYetToAnswer(): void{
        this.playersYetToAnswer = Array.from(this.players.players);
    }

    removePlayerFromPlayersYetToAnswer(playerPromptResponse: Ib_PlayerPromptResponse):void{
        if(playerPromptResponse?.playerId){
            ListUtils.removeItemFromList(this.playersYetToAnswer, this.players.findPlayerFromId(playerPromptResponse.playerId));
        }
    }

    async sendPrompt(): Promise<void> {
        if(!this.isRoundActive){
            this.isRoundActive = true;
            this.playerAnswers = [];
            this.resetPlayersYetToAnswer();
            let timeout;
            if(this.timeLimit) { timeout = setTimeout(this.sendEndRound.bind(this), this.timeLimit);}
            this.promptPromise = new Ib_GetSamePromptAllPlayers(this.hostWs, this.players,
                CONSTANTS.PROMPT_TYPE.MATCHING, this.promptData, this.timeLimit ? this.timeLimit + 1500 : 0,
                [(playerPromptResponse)=>this.removePlayerFromPlayersYetToAnswer(playerPromptResponse)]);

            // @ts-ignore
            this.playerAnswers = await this.promptPromise;
            this.playerAnswersHistory.push(this.playerAnswers);
            console.log(this.playerAnswers);
            if(this.timeLimit){clearTimeout(timeout);}
            this.sendEndRound();
        }
    }

    sendEndRound(): void {
        if(this.isRoundActive){
            this.players.sendMessageToAllPlayers(this.createEndRoundMessage());
            this.isRoundActive = false;
        }
    }

    forceEnd(): void {
        this.sendEndRound();
        setTimeout(()=>this.promptPromise.forceEnd(), 1500);
    }

    createEndRoundMessage():{[CONSTANTS.MESSAGE_TYPE_KEY]: string[], [CONSTANTS.ROUND_KEY]: string[], data: any} {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    setTimeLimit(newTimeLimit): void{

        let intLimit = 0;

        try {
            intLimit = parseInt(newTimeLimit, 10);
        } catch (e){
            console.log("Time limit is not a number");
        }
        this.timeLimit = (intLimit * 1000);
    }

    getViewData(): ViewData {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.HOST_ASKS_MATCHING_PROMPT_TO_ALL);
        viewData.setExtraData(this);
        return viewData;
    }
}
