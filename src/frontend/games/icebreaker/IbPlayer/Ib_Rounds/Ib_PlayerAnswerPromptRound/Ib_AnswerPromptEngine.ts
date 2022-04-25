import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import GameWebSocket, { onMessageGamePayload } from 'Frontend/GameWebSocket';

export type PlayerPromptExtraViewData<promptDataType> = {
    promptData: promptDataType, answerSent:boolean, updateAnswer:{(newAnswer):void}, sendAnswer:{():void},
};

export default class AnswerPromptRound {
    private playerWs: GameWebSocket;
    private cleanUpFunctions: {():void}[];
    private hostStartRoundMessage: MessageObject;
    private promptData: any; // TODO - type this
    private isPromptBatch: boolean;
    private answerSent: boolean;
    private currentPromptIndex: number;
    private endRound: () => void;

    constructor(playerWs : GameWebSocket, hostStartRoundMessage: MessageObject) {
        this.playerWs = playerWs;
        this.cleanUpFunctions = []; // run before ending round.
        this.cleanUpFunctions.push(this.sendAnswer.bind(this));
        this.hostStartRoundMessage = hostStartRoundMessage;
        this.promptData = hostStartRoundMessage.getData(); // Depends on promptType.
        this.isPromptBatch = Array.isArray(this.promptData);
        if(!this.isPromptBatch){
            this.promptData = [this.promptData]; // TODO - always make promptData an array (even when there is only one prompt)
        }
        this.answerSent = false;
        this.currentPromptIndex = 0;
    }

    // play round
    async then(endRound): Promise<void> { // TODO: Change to play() to make Typescript happy.
        this.endRound = endRound;
        this.listenForRoundEnding();
    }

    updateAnswer(newAnswer):void {
        this.promptData[this.currentPromptIndex].answer = newAnswer;
    }

    sendAnswer(): void {
        if(this.currentPromptIndex >= this.promptData.length - 1){
            if(!this.answerSent){
                this.answerSent = true;
                const answerMessage = new MessageObject();
                answerMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
                answerMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS);

                answerMessage.setData(this.isPromptBatch ? this.promptData : this.promptData[0]);
                this.playerWs.sendMessageToHost(answerMessage.getMessage()); // TODO consider cleaning up when sending msg
            }
        } else {
            this.currentPromptIndex++;
        }
    }

    listenForRoundEnding(): void {
        const endRoundListener = (msgObj:onMessageGamePayload) => {
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

    cleanUpAndEndRound(): void {
        this.cleanUpFunctions.forEach((func) => func()); // Remove end round listener. Send answer if not sent yet.
        this.endRound(); // End the round. (resolve promise)
    }

    getViewData(): ViewData {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.PROMPT);
        viewData.addViewType(this.hostStartRoundMessage.getSpecificRound())
        const extraData:PlayerPromptExtraViewData<any> = {promptData: this.promptData[this.currentPromptIndex], answerSent: this.answerSent, updateAnswer: this.updateAnswer.bind(this), sendAnswer: this.sendAnswer.bind(this)};
        viewData.setExtraData(extraData);

        return viewData;
    }
}
