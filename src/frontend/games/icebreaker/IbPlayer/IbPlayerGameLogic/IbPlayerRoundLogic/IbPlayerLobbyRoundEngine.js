import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';

export default class LobbyRound {
    constructor(playerWs) {
        this.playerWs = playerWs;
        this.cleanUpFunctions = []; // run before ending round.

        this.viewData = new ViewData();
        this.viewData.addViewType(CONSTANTS.ROUNDS.LOBBY);
        const extraViewData = {
            startRoundFunction: this.messageHostToEnd.bind(this),
            canStartRound: false,
        };
        this.viewData.setExtraData(extraViewData);
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        this.listenForRoundEnding();
        this.listenForRoundUpdates();
    }

    listenForRoundEnding() {
        const endRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSender() === this.playerWs.hostId &&
                message.getMainMessageType() ===
                    CONSTANTS.MESSAGE_TYPE.END_ROUND
            ) {
                this.cleanUpAndEndRound();
            }
        };

        ListUtils.addObjectToListAndAddCleanUp(this.playerWs.onMessageGame, endRoundListener, this.cleanUpFunctions);
    }

    listenForRoundUpdates() {
        const updateRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSender() === this.playerWs.hostId &&
                message.getMainMessageType() ===
                    CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS
            ) {
                if (message.getData() >= CONSTANTS.MIN_PLAYERS) {
                    this.viewData.extraViewData.canStartRound = true;
                }
            }
        };

        ListUtils.addObjectToListAndAddCleanUp(this.playerWs.onMessageGame, updateRoundListener, this.cleanUpFunctions);
    }

    cleanUpAndEndRound() {
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    messageHostToEnd() {
        this.playerWs.sendMessageToHost(this.createEndRoundMessage());
    }

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.LOBBY);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    getViewData() {
        return this.viewData;
    }
}
