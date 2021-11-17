import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import Ib_GetSamePromptAllPlayers from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetSamePromptAllPlayers';
import MatchingPrompt from 'Icebreaker/IbHost/Rounds/HostAsksMatchingPromptToAll/MatchingPrompt';

// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuestionRound {
    constructor(hostWs, players) {
        this.hostWs = hostWs;
        this.players = players;

        this.prompt = new MatchingPrompt();
        this.timeLimit  = null;
        this.playerAnswers = [];
        this.playerAnswersHistory = [];
        this.playersYetToAnswer = [];
        this.isRoundActive = false;
        this.getViewData = this.getViewData.bind(this);

        this.cleanUpFunctions = []; // run before ending round.
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;
    }

    setMainPrompt(newPrompt){
        this.prompt.mainPrompt = newPrompt;
    }

    addMatchable(newMatchable){
        this.prompt.matchables.push(newMatchable);
    }

    addCategory(newCategory){
        this.prompt.categories.push(newCategory);
    }

    resetPromptData(){
        this.prompt.matchables = [];
        this.prompt.categories = [];
    }

    resetPlayersYetToAnswer(){
        this.playersYetToAnswer = Array.from(this.players.players);
    }

    removePlayerFromPlayersYetToAnswer(playerPromptResponse){
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
            this.promptPromise = new Ib_GetSamePromptAllPlayers(this.hostWs, this.players,
                CONSTANTS.PROMPT_TYPE.MATCHING, this.prompt, this.timeLimit ? this.timeLimit + 1500 : null,
                [(playerPromptResponse)=>this.removePlayerFromPlayersYetToAnswer(playerPromptResponse)]);
            this.playerAnswers = await this.promptPromise.ask();
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
        viewData.addViewType(CONSTANTS.ROUNDS.HOST_ASKS_MATCHING_PROMPT_TO_ALL);
        viewData.setExtraData(this);
        return viewData;
    }
}
