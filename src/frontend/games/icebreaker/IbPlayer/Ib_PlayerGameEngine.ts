import CONSTANTS from '../IbConstants';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import * as ListUtils from 'Utils/listUtils';
import LobbyRound from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerLobbyRound/Ib_PlayerLobbyRoundEngine';
import AnswerPromptRound from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_AnswerPromptEngine';
import GameWebSocket, { onMessageGamePayload } from 'Frontend/GameWebSocket';
import icebreakerViewData from 'Icebreaker/IbShared/IbSharedViewData';

export default class gameEngine {
    ws: GameWebSocket;
    private currentRound: any;
    constructor(gameWebSocket: GameWebSocket) {
        this.ws = gameWebSocket;
        this.currentRound = null;

        this.listenForStartRound();
    }

    listenForStartRound(): void {
        const startRoundListener = (msgObj: onMessageGamePayload) => {
            const message = new MessageObject(msgObj);
            if (message.getSender() === this.ws.hostId
                && message.getMainMessageType() === CONSTANTS.MESSAGE_TYPE.START_ROUND) {
                ListUtils.removeItemFromList(this.ws.onMessageGame, startRoundListener);
                this.startRound(message);
            }
        };

        this.ws.onMessageGame.push(startRoundListener);
    }

    getRoundObject(message): any {
        switch (message.getMainRound()) {
            case CONSTANTS.ROUNDS.LOBBY:
                return new LobbyRound(this.ws, message);
            case CONSTANTS.ROUNDS.PROMPT:
                return new AnswerPromptRound(this.ws, message);
        }
    }

    async startRound(message): Promise<void> {
        this.currentRound = this.getRoundObject(message);
        await this.currentRound;
        this.currentRound = null;
        this.listenForStartRound();
    }

    getViewData(): icebreakerViewData {
        return this.currentRound?.getViewData();
    }
}
