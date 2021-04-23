import CONSTANTS from '../../IbConstants';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import * as ListUtils from 'Utils/listUtils';
import LobbyRound from 'Icebreaker/IbPlayer/IbPlayerGameLogic/IbPlayerRoundLogic/IbPlayerLobbyRoundEngine';

export default class gameEngine {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.currentRound = null;

        this.listenForStartRound();
    }

    listenForStartRound() {
        const startRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSender() === this.ws.hostId &&
                message.getMessageType() === CONSTANTS.MESSAGE_TYPE.START_ROUND
            ) {
                ListUtils.removeItemFromList(
                    this.ws.onMessageGame,
                    startRoundListener
                );
                this.startRound(message.getRound());
            }
        };

        this.ws.onMessageGame.push(startRoundListener);
    }

    getRoundObject(roundName) {
        switch (roundName) {
            case CONSTANTS.ROUNDS.LOBBY:
                return new LobbyRound(this.ws);
        }
    }

    async startRound(roundName) {
        this.currentRound = this.getRoundObject(roundName);
        await this.currentRound;
        this.currentRound = null;
        this.listenForStartRound();
    }

    getViewData() {
        return this.currentRound?.getViewData();
    }
}
