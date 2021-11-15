import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';

// noinspection JSUnusedGlobalSymbols

export default class LobbyRound {
    constructor(hostWs, players) {
        this.hostWs = hostWs;
        this.players = players;
        this.cleanUpFunctions = []; // run before ending round.

        this.viewData = new ViewData();
        this.viewData.addViewType(CONSTANTS.ROUNDS.LOBBY);
        this.viewData.setExtraData(this.players.players);
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        this.listenForPlayerEndingLobby();
        this.listenForNewPlayers();
    }

    listenForPlayerEndingLobby() {
        const endWhenPlayerAsks = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getMainRound() === CONSTANTS.ROUNDS.LOBBY
                && message.getMainMessageType() === CONSTANTS.MESSAGE_TYPE.END_ROUND
                && message.getSpecificRound() === CONSTANTS.ROUNDS.LOBBY
                && message.getSender() !== this.hostWs.hostId && // Don't listen to your own messages!
                // this.players.isPlayerIdVip(playerId) && // TODO Consider implementing VIP
                this.players.length >= CONSTANTS.MIN_PLAYERS
            ) {
                this.cleanUpAndEndRound();
            }
        };

        ListUtils.addObjectToListAndAddCleanUp(this.hostWs.onMessageGame, endWhenPlayerAsks, this.cleanUpFunctions);
    }

    listenForNewPlayers() {
        const addNewPlayerOnJoin = (msgObj) => {
            const newPlayer = this.players.addPlayerFromServer(msgObj);

            if (newPlayer) {
                this.players.sendPlayerMessage(
                    newPlayer,
                    this.createStartRoundMessage()
                );
                this.players.sendMessageToAllPlayers(
                    this.createNumberOfPlayersUpdateMessage()
                );
            }
        };

        ListUtils.addObjectToListAndAddCleanUp(this.hostWs.onOtherJoinGame, addNewPlayerOnJoin, this.cleanUpFunctions);
    }

    cleanUpAndEndRound() {
        this.players.sendMessageToAllPlayers(this.createEndRoundMessage()); // Notify players round is over.
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    createStartRoundMessage() {
        const startRoundMessage = new MessageObject();
        startRoundMessage.addRound(CONSTANTS.ROUNDS.LOBBY);
        startRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.START_ROUND);
        return startRoundMessage.getMessage();
    }

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.LOBBY);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    createNumberOfPlayersUpdateMessage() {
        const playerUpdateMessage = new MessageObject();
        playerUpdateMessage.addRound(CONSTANTS.ROUNDS.LOBBY);
        playerUpdateMessage.addMessageType(
            CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS
        );
        playerUpdateMessage.setData(this.players.length);
        return playerUpdateMessage.getMessage();
    }

    getViewData() {
        return this.viewData;
    }
}
