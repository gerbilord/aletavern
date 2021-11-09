import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import PlayerPromptResponse from 'Icebreaker/IbHost/Prompts/PlayerPromptResponse';

// noinspection JSUnusedGlobalSymbols

export default class GetPlayerPromptPromise {
    constructor(hostWs, playerId, promptType, promptData, timeLimit) {
        this.hostWs = hostWs;
        this.playerId = playerId;
        this.promptType = promptType;
        this.promptData = promptData;
        this.timeLimit = timeLimit;
        this.playerAnswer = new PlayerPromptResponse();
        this.playerAnswer.setPlayerId(playerId);
        this.playerAnswer.setPromptType(promptType);


        this.cleanUpFunctions = []; // run before ending promise
    }

    // Get prompt
    async then(resolve) {
        this.resolve = resolve;

        this.listenForPlayerAnswer();
        this.sendPlayerPrompt();
        this.startEndTimer();
    }

    startEndTimer(){
        if(this.timeLimit){
            const timeOut = setTimeout(()=>{this.cleanUpAndEndRound()}, this.timeLimit);
            this.cleanUpFunctions.push(()=>{clearTimeout(timeOut)});
        }
    }

    listenForPlayerAnswer() {
        const updatePlayerAnswer = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSpecificRound() ===
                CONSTANTS.ROUNDS.PROMPT &&
                message.getMainMessageType() ===
                CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS &&
                message.getSender() === this.playerId
            ) {
                this.playerAnswer.setPlayerResponse(message.getData()); // Update player response.
                this.cleanUpAndEndRound();
            }
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onMessageGame,
            updatePlayerAnswer
        );
    }

    sendPlayerPrompt() {
        const promptMessage = this.createStartRoundMessage(this.promptData);
        this.hostWs.sendMessageToOne(this.playerId, promptMessage);
    }

    addObjectToListAndCleanUp(objectList, object) {
        this.cleanUpFunctions.push(
            ListUtils.createRemoveItemCallback(objectList, object)
        );
        objectList.push(object);
    }

    cleanUpAndEndRound() {
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.resolve(this.playerAnswer); // (resolve promise)
    }

    createStartRoundMessage(question) {
        const promptMessage = new MessageObject();
        promptMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        // promptMessage.addRound(this.promptType); // TODO uncomment when more prompt types exist
        promptMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.START_ROUND);
        promptMessage.setData(question);
        return promptMessage.getMessage();
    }

}
