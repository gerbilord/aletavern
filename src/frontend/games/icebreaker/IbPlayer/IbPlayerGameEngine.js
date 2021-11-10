import CONSTANTS from '../IbConstants';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import * as ListUtils from 'Utils/listUtils';
import LobbyRound from 'Icebreaker/IbPlayer/IbPlayerLobbyRoundEngine';
import AnswerPromptRound from 'Icebreaker/IbPlayer/IbAnswerPromptEngine';

export default class gameEngine {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.currentRound = null;

        this.listenForStartRound();
    }

    listenForStartRound() {
        const startRoundListener = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (message.getSender() === this.ws.hostId
                && message.getMainMessageType() === CONSTANTS.MESSAGE_TYPE.START_ROUND) {
                ListUtils.removeItemFromList(this.ws.onMessageGame, startRoundListener);
                this.startRound(message);
            }
        };

        this.ws.onMessageGame.push(startRoundListener);
    }

    getRoundObject(message) {
        switch (message.getMainRound()) {
            case CONSTANTS.ROUNDS.LOBBY:
                return new LobbyRound(this.ws, message);
            case CONSTANTS.ROUNDS.PROMPT:
                return new AnswerPromptRound(this.ws, message);
        }
    }

    async startRound(message) {
        this.currentRound = this.getRoundObject(message);
        await this.currentRound;
        this.currentRound = null;
        this.listenForStartRound();
    }

    getViewData() {
        return this.currentRound?.getViewData();
    }
}
