import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';

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
                message.getRound() === CONSTANTS.ROUNDS.LOBBY &&
                message.getMessageType() === CONSTANTS.MESSAGE_TYPE.END_ROUND &&
                message.getSender() !== this.hostWs.hostId && // Don't listen to your own messages!
                // this.players.isPlayerIdVip(playerId) && // TODO Consider implementing VIP
                this.players.length >= CONSTANTS.MIN_PLAYERS
            ) {
                this.cleanUpAndEndRound();
            }
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onMessageGame,
            endWhenPlayerAsks
        );
    }

    listenForNewPlayers() {
        const addNewPlayerOnJoin = (msgObj) => {
            const newPlayer = this.players.addPlayerFromServer(msgObj);

            if (newPlayer) {
                this.players.sendPlayerMessage(
                    newPlayer,
                    this.createStartRoundMessage()
                );
            }
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onOtherJoinGame,
            addNewPlayerOnJoin
        );
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

    createStartRoundMessage() {
        const startRoundMessage = new MessageObject();
        startRoundMessage.setRound(CONSTANTS.ROUNDS.LOBBY);
        startRoundMessage.setMessageType(CONSTANTS.MESSAGE_TYPE.START_ROUND);
        return startRoundMessage.getMessage();
    }

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.setRound(CONSTANTS.ROUNDS.LOBBY);
        endRoundMessage.setMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    getViewData() {
        return this.viewData;
    }
}
