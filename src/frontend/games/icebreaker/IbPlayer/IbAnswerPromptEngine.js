import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';

export default class AnswerPromptRound {
    constructor(playerWs, startRoundMessage) {
        this.playerWs = playerWs;
        this.cleanUpFunctions = []; // run before ending round.
        this.cleanUpFunctions.push(this.sendAnswer.bind(this));
        this.startRoundMessage = startRoundMessage;
        this.prompt = startRoundMessage.getData();
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
            answerMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
            answerMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS);
            const data = {prompt:this.prompt, answer:this.currentAnswer}
            answerMessage.setData(data);
            this.playerWs.sendMessageToHost(answerMessage.getMessage()); // TODO consider cleaning up when sending msg
        }
    }

    listenForRoundEnding() {
        const endRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (message.getSender() === this.playerWs.hostId
                && message.getSpecificMessageType() === CONSTANTS.MESSAGE_TYPE.END_ROUND
                && message.getSpecificRound() === CONSTANTS.ROUNDS.PROMPT
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
        viewData.addViewType(CONSTANTS.ROUNDS.PROMPT);
        viewData.addViewType(this.startRoundMessage.getSpecificRound())
        const extraData = {prompt: this.prompt, answerSent: this.answerSent, updateAnswer: this.updateAnswer.bind(this), sendAnswer: this.sendAnswer.bind(this)};
        viewData.setExtraData(extraData);

        return viewData;
    }
}
