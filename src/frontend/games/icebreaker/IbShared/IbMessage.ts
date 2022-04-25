import CONSTANTS from '../IbConstants';
import { onMessageGamePayload } from 'Frontend/GameWebSocket';

export type messageObject = {[CONSTANTS.MESSAGE_TYPE_KEY]: string[], [CONSTANTS.ROUND_KEY]: string[], data: any};

export default class icebreakerMessage {
    private messageObject: messageObject;
    private sender: string | null;

    constructor(messageData:onMessageGamePayload | null = null) {
        if (messageData) {
                this.messageObject = messageData.data;
                this.sender = messageData.playerId;
        } else {
            this.messageObject = {[CONSTANTS.MESSAGE_TYPE_KEY]: [], [CONSTANTS.ROUND_KEY]: [], data: {}};
        }
    }

    addMessageType(newType:string): void {
        this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY].push(newType);
    }

    getMessageTypes(): string[] {
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY];
    }

    getMainMessageType(): string {
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY][0];
    }

    getSpecificMessageType(): string {
        const lastIndex = this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY].length - 1;
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY][lastIndex];
    }

    addRound(newRound:string): void {
        this.messageObject[CONSTANTS.ROUND_KEY].push(newRound);
    }

    getRounds(): string[] {
        return this.messageObject[CONSTANTS.ROUND_KEY];
    }

    getMainRound(): string {
        return this.messageObject[CONSTANTS.ROUND_KEY][0];
    }

    getSpecificRound(): string {
        const lastIndex = this.messageObject[CONSTANTS.ROUND_KEY].length - 1;
        return this.messageObject[CONSTANTS.ROUND_KEY][lastIndex];
    }

    setData(newData:any): void {
        this.messageObject[CONSTANTS.DATA_KEY] = newData;
    }

    getData(): any {
        return this.messageObject[CONSTANTS.DATA_KEY];
    }

    getMessage(): messageObject {
        return this.messageObject;
    }

    getSender() {
        return this.sender;
    }
}
