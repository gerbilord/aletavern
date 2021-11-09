import CONSTANTS from '../IbConstants';

export default class icebreakerMessage {
    // Accepts serverMessage and serverMessage.data
    constructor(messageData) {
        this.messageObject = {};
        this.sender = null; // We are sending message, sender will be populated by GameWebSocket.

        this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY] = [];
        this.messageObject[CONSTANTS.ROUND_KEY] = [];

        if (messageData) {
            if (messageData.data) {
                // If gameWebSocketMessage
                this.messageObject = messageData.data;
                this.sender = messageData.playerId;
            } else {
                // Else assume icebreakerMessage
                this.messageObject = messageData;
            }
        }
    }

    addMessageType(newType) {
        this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY].push(newType);
    }

    getMessageTypes() {
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY];
    }

    getMainMessageType() {
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY][0];
    }

    getSpecificMessageType() {
        const lastIndex = this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY].length - 1;
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY][lastIndex];
    }

    addRound(newRound) {
        this.messageObject[CONSTANTS.ROUND_KEY].push(newRound);
    }

    getRounds() {
        return this.messageObject[CONSTANTS.ROUND_KEY];
    }

    getMainRound() {
        return this.messageObject[CONSTANTS.ROUND_KEY][0];
    }

    getSpecificRound() {
        const lastIndex = this.messageObject[CONSTANTS.ROUND_KEY].length - 1;
        return this.messageObject[CONSTANTS.ROUND_KEY][lastIndex];
    }

    setData(newData) {
        this.messageObject[CONSTANTS.DATA_KEY] = newData;
    }

    getData() {
        return this.messageObject[CONSTANTS.DATA_KEY];
    }

    getMessage() {
        return this.messageObject;
    }

    getSender() {
        return this.sender;
    }
}
