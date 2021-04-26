import CONSTANTS from '../../IbConstants';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import * as ListUtils from 'Utils/listUtils';
import LobbyRound from 'Icebreaker/IbPlayer/IbPlayerGameLogic/IbPlayerRoundLogic/IbPlayerLobbyRoundEngine';
import AnswerPromptRound from 'Icebreaker/IbPlayer/IbPlayerGameLogic/IbPlayerRoundLogic/IbPlayerSubRoundLogic/IbPlayerAnswerPromptRoundEngine';

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
                this.startRound(message.getMainRound(), message.getData());
            }
        };

        this.ws.onMessageGame.push(startRoundListener);
    }

    getRoundObject(roundName, roundData) {
        switch (roundName) {
            case CONSTANTS.ROUNDS.LOBBY:
                return new LobbyRound(this.ws, roundData);
            case CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION:
                return new AnswerPromptRound(this.ws, roundData);
        }
    }

    async startRound(roundName, roundData) {
        this.currentRound = this.getRoundObject(roundName, roundData);
        await this.currentRound;
        this.currentRound = null;
        this.listenForStartRound();
    }

    getViewData() {
        return this.currentRound?.getViewData();
    }
}
