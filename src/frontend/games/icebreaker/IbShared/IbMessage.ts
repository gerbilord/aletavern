import CONSTANTS from '../IbConstants';

export default class icebreakerMessage {
    // Accepts serverMessage and serverMessage.data
    private messageObject: {[CONSTANTS.MESSAGE_TYPE_KEY]: string[], [CONSTANTS.ROUND_KEY]: string[], data: any};
    private sender: string | null;

    constructor(messageData=null) {

        if (messageData) {
            if (messageData.data) {
                // If gameWebSocketMessage
                this.messageObject = {[CONSTANTS.MESSAGE_TYPE_KEY]: [], [CONSTANTS.ROUND_KEY]: [], data: messageData.data};
                this.sender = messageData.playerId;
            } else {
                // Else assume icebreakerMessage
                this.messageObject = messageData;
                this.sender = null;
            }
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

    getMessage(): {[CONSTANTS.MESSAGE_TYPE_KEY]: string[], [CONSTANTS.ROUND_KEY]: string[], data: any} {
        return this.messageObject;
    }

    getSender() {
        return this.sender;
    }
}
