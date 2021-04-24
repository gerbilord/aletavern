import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';

// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuestionRound {
    constructor(hostWs, players, prompts, groupSize) {
        this.hostWs = hostWs;
        this.players = players;
        this.playersYetToAnswer = [...players.players];
        this.playerAnswers = [];
        this.prompts = prompts; // Array of prompts.
        this.groupSize = groupSize;

        this.cleanUpFunctions = []; // run before ending round.

        this.viewData = new ViewData();
        this.viewData.addViewType(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        this.listenForPlayerAnswers();
        this.sendPlayersPrompts();
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

            const promptMessage = this.createPromptMessage(this.prompts[i]);
            this.players.sendGroupMessage(subGroup, promptMessage);
        }
    }

    addObjectToListAndCleanUp(objectList, object) {
        this.cleanUpFunctions.push(
            ListUtils.createRemoveItemCallback(objectList, object)
        );
        objectList.push(object);
    }

    cleanUpAndEndRound() {
        this.players.sendMessageToAllPlayers(this.createEndRoundMessage()); // Notify players round is over.
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    // TODO Consider refactoring StartRound and EndRound messages
    createStartRoundMessage() {
        const startRoundMessage = new MessageObject();
        startRoundMessage.addRound(CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION);
        startRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.START_ROUND);
        return startRoundMessage.getMessage();
    }

    // TODO Consider refactoring to start round. (currently type is start round).
    createPromptMessage(question) {
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
        return this.viewData;
    }
}
