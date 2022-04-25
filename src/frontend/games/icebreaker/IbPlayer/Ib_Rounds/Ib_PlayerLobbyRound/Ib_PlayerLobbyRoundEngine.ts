import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import IbMessage from 'Icebreaker/IbShared/IbMessage';
import {messageObject} from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import icebreakerViewData from 'Icebreaker/IbShared/IbSharedViewData';
import GameWebSocket, { onMessageGamePayload } from 'Frontend/GameWebSocket';

export default class LobbyRound {
    private playerWs: GameWebSocket;
    private cleanUpFunctions: {():void}[];
    private viewData: icebreakerViewData;
    private endRound: {():void};

    constructor(playerWs, message) {
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
    async then(endRound):Promise<void> {
        this.endRound = endRound;

        this.listenForRoundEnding();
        this.listenForRoundUpdates();
    }

    listenForRoundEnding():void {
        const endRoundListener = (msgObj:onMessageGamePayload) => {
            const message = new IbMessage(msgObj);
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

    listenForRoundUpdates():void {
        const updateRoundListener = (msgObj) => {
            const message = new IbMessage(msgObj);
            if (
                message.getSender() === this.playerWs.hostId &&
                message.getMainMessageType() ===
                    CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS
            ) {
                if (message.getData() >= CONSTANTS.MIN_PLAYERS) {
                    this.viewData.getExtraData().canStartRound = true;
                }
            }
        };

        ListUtils.addObjectToListAndAddCleanUp(this.playerWs.onMessageGame, updateRoundListener, this.cleanUpFunctions);
    }

    cleanUpAndEndRound():void {
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    messageHostToEnd():void {
        this.playerWs.sendMessageToHost(this.createEndRoundMessage());
    }

    createEndRoundMessage():messageObject {
        const endRoundMessage = new IbMessage();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.LOBBY);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    getViewData():icebreakerViewData {
        return this.viewData;
    }
}
