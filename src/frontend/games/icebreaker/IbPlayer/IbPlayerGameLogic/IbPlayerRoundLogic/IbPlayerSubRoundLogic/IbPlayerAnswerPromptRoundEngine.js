import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';

export default class AnswerPromptRound {
    constructor(playerWs, prompt) {
        this.playerWs = playerWs;
        this.cleanUpFunctions = []; // run before ending round.
        this.cleanUpFunctions.push(this.sendAnswer.bind(this));

        this.prompt = prompt;
        this.currentAnswer = '';
        this.answerSent = false;
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;
        this.listenForRoundEnding();
    }

    updateAnswer(newAnswer) {
        this.currentAnswer = newAnswer;
    }

    sendAnswer(){
        if(!this.answerSent){
            this.answerSent = true;
            const answerMessage = new MessageObject();
            answerMessage.addRound(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);
            answerMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS);
            answerMessage.setData(this.currentAnswer);
            this.playerWs.sendMessageToHost(answerMessage.getMessage());
        }
    }

    listenForRoundEnding() {
        const endRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (message.getSender() === this.playerWs.hostId
                && message.getSpecificMessageType() === CONSTANTS.MESSAGE_TYPE.END_ROUND
                && message.getSpecificRound() === CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION
            ) {
                this.cleanUpAndEndRound();
            }
        };

        ListUtils.addObjectToListAndAddCleanUp(this.playerWs.onMessageGame, endRoundListener, this.cleanUpFunctions);
    }

    cleanUpAndEndRound() {
        this.cleanUpFunctions.forEach((func) => func()); // Remove end round listener. Send answer if not sent yet.
        this.endRound(); // End the round. (resolve promise)
    }

    getViewData() {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);
        const extraData = {prompt: this.prompt, answerSent: this.answerSent, updateAnswer: this.updateAnswer.bind(this), sendAnswer: this.sendAnswer.bind(this)};
        viewData.setExtraData(extraData);

        return viewData;
    }
}
