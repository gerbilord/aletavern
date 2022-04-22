import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import GetSamePromptAllPlayers from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetSamePromptAllPlayers';
import TextPrompt from 'Icebreaker/IbHost/Rounds/HostAsksTextPromptToAllRound/TextPrompt';
import GameWebSocket from 'Frontend/GameWebSocket';
import Players from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Players';
import Ib_GetSamePromptAllPlayers from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetSamePromptAllPlayers';
import Ib_PlayerPromptResponse from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_PlayerPromptResponse';

// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuestionRound {
    private hostWs: any;
    private players: Players;
    private promptData: TextPrompt
    private timeLimit: number;
    private playerAnswers: any[];
    private playerAnswersHistory: any[];
    private playersYetToAnswer: any[];
    private isRoundActive: boolean;
    private endRound: { ():any };
    private promptPromise: Ib_GetSamePromptAllPlayers;

    constructor(hostWs: GameWebSocket, players: Players) {
        this.hostWs = hostWs;
        this.players = players;

        this.promptData = new TextPrompt();
        this.timeLimit  = 0;
        this.playerAnswers = [];
        this.playerAnswersHistory = [];
        this.playersYetToAnswer = [];
        this.isRoundActive = false;
        this.getViewData = this.getViewData.bind(this);
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;
    }

    setPrompt(newPrompt){
        this.promptData.prompt = newPrompt;
    }

    resetPlayersYetToAnswer(){
        this.playersYetToAnswer = Array.from(this.players.players);
    }

    removePlayerFromPlayersYetToAnswer(playerPromptResponse: Ib_PlayerPromptResponse){
        if(playerPromptResponse?.playerId){
            ListUtils.removeItemFromList(this.playersYetToAnswer, this.players.findPlayerFromId(playerPromptResponse.playerId));
        }
    }

    async sendPrompt(){
        if(!this.isRoundActive){
            this.isRoundActive = true;
            this.playerAnswers = [];
            this.resetPlayersYetToAnswer();
            let timeout;
            if(this.timeLimit) { timeout = setTimeout(this.sendEndRound.bind(this), this.timeLimit);}
            this.promptPromise = new GetSamePromptAllPlayers(this.hostWs, this.players,
                CONSTANTS.PROMPT_TYPE.TEXT, this.promptData, this.timeLimit ? this.timeLimit + 1500 : 0,
                [(playerPromptResponse)=>this.removePlayerFromPlayersYetToAnswer(playerPromptResponse)]);
            // @ts-ignore
            this.playerAnswers = await this.promptPromise; // Fix this to make typescript happy.
            this.playerAnswersHistory.push(this.playerAnswers);
            console.log(this.playerAnswers);
            if(this.timeLimit){clearTimeout(timeout);}
            this.sendEndRound();
        }
    }

    sendEndRound() {
        if(this.isRoundActive){
            this.players.sendMessageToAllPlayers(this.createEndRoundMessage());
            this.isRoundActive = false;
        }
    }

    forceEnd() {
        this.sendEndRound();
        setTimeout(()=>this.promptPromise.forceEnd(), 1500);
    }

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    setTimeLimit(newTimeLimit){

        let intLimit = 0;

        try {
            intLimit = parseInt(newTimeLimit, 10);
        } catch (e){
            console.log("Time limit is not a number");
        }

        this.timeLimit = (intLimit * 1000);

    }

    getViewData():ViewData {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.HOST_ASKS_TEXT_PROMPT_TO_ALL);
        viewData.setExtraData(this);
        return viewData;
    }
}
