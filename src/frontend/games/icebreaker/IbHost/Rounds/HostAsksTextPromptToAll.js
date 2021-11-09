import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import GetSamePromptAllPlayers from 'Icebreaker/IbHost/Prompts/GetSamePromptAllPlayers';

// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuestionRound {
    constructor(hostWs, players) {
        this.hostWs = hostWs;
        this.players = players;

        this.prompt = "";
        this.timeLimit  = null;
        this.playerAnswers = [];
        this.isRoundActive = false;
        this.getViewData = this.getViewData.bind(this);

        this.cleanUpFunctions = []; // run before ending round.
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;
    }

    setPrompt(newPrompt){
        this.prompt = newPrompt;
    }

    async sendPrompt(){
        if(!this.isRoundActive){
            this.isRoundActive = true;
            this.playerAnswers = [];
            let timeout;
            if(this.timeLimit) { timeout = setTimeout(this.sendEndRound.bind(this), this.timeLimit);}
            let promptPromise = new GetSamePromptAllPlayers(this.hostWs, this.players, CONSTANTS.PROMPT_TYPE.TEXT, this.prompt, this.timeLimit ? this.timeLimit + 1500 : null);
            this.playerAnswers = await promptPromise.ask();
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

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    setTimeLimit(newTimeLimit){

        let intLimit = null;

        try {
            intLimit = parseInt(newTimeLimit, 10);
        } catch (e){
            console.log("Time limit is not a number");
        }

        if(intLimit && intLimit > 0){
            this.timeLimit = (intLimit * 1000);
        } else {
            this.timeLimit = null;
        }
    }

    getViewData() {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.HOST_ASKS_TEXT_PROMPT_TO_ALL);
        viewData.setExtraData(this);
        return viewData;
    }
}
