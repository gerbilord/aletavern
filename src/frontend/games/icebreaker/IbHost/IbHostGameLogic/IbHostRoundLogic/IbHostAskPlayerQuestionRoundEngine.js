import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';

// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuestionRound {
    constructor(hostWs, players, prompts, groupSize, timeToAnswer) {
        this.hostWs = hostWs;
        this.players = players;
        this.playersYetToAnswer = [...players.players];
        this.playerAnswers = [];
        this.prompts = prompts; // Array of prompts.
        this.groupSize = groupSize;
        this.timeToAnswer = timeToAnswer;

        this.timeLeft = timeToAnswer;

        this.cleanUpFunctions = []; // run before ending round.
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        this.listenForPlayerAnswers();
        this.sendPlayersPrompts();
        this.startEndRoundTimer();
    }

    startEndRoundTimer(){
        setTimeout(()=>{this.cleanUpAndEndRound(5000)}, this.timeToAnswer);
        const countDown = setInterval(()=>{this.timeLeft -= 1000}, 1000);
        this.cleanUpFunctions.push(()=>{clearInterval(countDown)});
    }

    listenForPlayerAnswers() {
        const updatePlayerAnswer = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSpecificRound() ===
                    CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION &&
                message.getMainMessageType() ===
                    CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS &&
                message.getSender() !== this.hostWs.hostId && // Don't listen to your own messages! // TODO Maybe check if person is in round?
                this.players.length >= CONSTANTS.MIN_PLAYERS
            ) {
                this.playerAnswers[message.getSender()] = message.getData(); // Update player response.
                this.playersYetToAnswer = this.playersYetToAnswer.filter(player => player.id !== message.getSender());
                if (
                    Object.keys(this.playerAnswers).length ===
                    this.players.length
                ) {
                    // end if all players answered.
                    this.cleanUpAndEndRound();
                }
            }
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onMessageGame,
            updatePlayerAnswer
        );
    }

    sendPlayersPrompts() {
        const groups = [];
        let playersToPlace = [...this.players.players];

        ListUtils.shuffleList(playersToPlace);

        // Split players into groups of equal size.
        while (playersToPlace.length >= this.groupSize) {
            const subGroup = playersToPlace.slice(0, this.groupSize);
            groups.push(subGroup);
            playersToPlace = playersToPlace.slice(this.groupSize);
        }

        // Split remaining players evenly among groups.
        for (let i = 0; i < playersToPlace.length; i++) {
            groups[i % groups.length].push(playersToPlace[i]);
        }

        // Send unique prompt to each group
        for (let i = 0; i < groups.length; i++) {
            const subGroup = groups[i];

            const promptMessage = this.createStartRoundMessage(this.prompts[i]);
            this.players.sendGroupMessage(subGroup, promptMessage);
        }
    }

    addObjectToListAndCleanUp(objectList, object) {
        this.cleanUpFunctions.push(
            ListUtils.createRemoveItemCallback(objectList, object)
        );
        objectList.push(object);
    }

    async cleanUpAndEndRound(waitTime = 0) {
        this.players.sendMessageToAllPlayers(this.createEndRoundMessage()); // Notify players round is over.
        await new Promise(r => setTimeout(r, waitTime)); // wait for players to get in their answers.
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    // TODO Consider refactoring to start round. (currently type is start round).
    createStartRoundMessage(question) {
        const promptMessage = new MessageObject();
        promptMessage.addRound(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);
        promptMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.START_ROUND);
        promptMessage.setData(question);
        return promptMessage.getMessage();
    }

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    getViewData() {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);

        const extraData = {timeLeft: this.timeLeft, playersYetToAnswer: this.playersYetToAnswer};
        viewData.setExtraData(extraData);
        return viewData;
    }
}
