import CONSTANTS from '../../Constants';

export default class icebreakerMessage {
    // Accepts serverMessage and serverMessage.data
    constructor(messageData) {
        this.messageObject = {};
        this.sender = null; // We are sending message, sender will be populated by GameWebSocket.

        if (messageData) {
            if (messageData.data) {
                this.messageObject = messageData.data;
                this.sender = messageData.playerId;
            } else {
                this.messageObject = messageData;
            }
        }
    }

    setMessageType(newType) {
        this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY] = newType;
    }

    getMessageType() {
        return this.messageObject[CONSTANTS.MESSAGE_TYPE_KEY];
    }

    setRound(newRound) {
        this.messageObject[CONSTANTS.ROUND_KEY] = newRound;
    }

    getRound() {
        return this.messageObject[CONSTANTS.ROUND_KEY];
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
