import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';

// noinspection JSUnusedGlobalSymbols

export default class LobbyRound {
    constructor(playerWs) {
        this.playerWs = playerWs;
        this.cleanUpFunctions = []; // run before ending round.

        this.viewData = new ViewData();
        this.viewData.addViewType(CONSTANTS.ROUNDS.LOBBY);
        this.viewData.setExtraData(this.messageHostToEnd.bind(this));
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        this.listenForRoundEnding();
    }

    listenForRoundEnding() {
        const endRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSender() === this.playerWs.hostId &&
                message.getMessageType() === CONSTANTS.MESSAGE_TYPE.END_ROUND
            ) {
                this.cleanUpAndEndRound();
            }
        };

        this.addObjectToListAndCleanUp(
            this.playerWs.onMessageGame,
            endRoundListener
        );
        this.playerWs.onMessageGame.push(endRoundListener);
    }

    // TODO consider refactoring to a util.
    addObjectToListAndCleanUp(objectList, object) {
        this.cleanUpFunctions.push(
            ListUtils.createRemoveItemCallback(objectList, object)
        );
        objectList.push(object);
    }

    cleanUpAndEndRound() {
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    messageHostToEnd() {
        this.playerWs.sendMessageToHost(this.createEndRoundMessage());
    }

    createEndRoundMessage() {
        const startRoundMessage = new MessageObject();
        startRoundMessage.setRound(CONSTANTS.ROUNDS.LOBBY);
        startRoundMessage.setMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return startRoundMessage.getMessage();
    }

    getViewData() {
        return this.viewData;
    }
}
