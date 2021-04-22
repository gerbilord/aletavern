import CONSTANTS from 'Icebreaker/Constants';

export default class LobbyRound {
    constructor(hostWs, players) {
        this.hostWs = hostWs;
        this.players = players;
        this.cleanUpFunctions = []; // run before ending round.
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        this.listenForVipEndingLobby();
        this.listenForNewPlayers();
    }

    listenForVipEndingLobby() {
        const endWhenVipAsks = (msgObj) => {
            const { playerId, data } = msgObj;
            if (
                data.msgType === 'endLobby' &&
                this.players.isPlayerIdVip(playerId) &&
                this.players.length >= CONSTANTS.MIN_PLAYERS
            ) {
                this.cleanUpFunctions.forEach((func) => func());
                this.endRound();
            }
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onMessageGame,
            endWhenVipAsks
        );

        setTimeout(() => {
            this.cleanUpFunctions.forEach((func) => func());
            this.endRound();
        }, 5000);
    }

    listenForNewPlayers() {
        const addNewPlayerOnJoin = (msgObj) => {
            this.players.addPlayerFromServer(msgObj);
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onOtherJoinGame,
            addNewPlayerOnJoin
        );
    }

    addObjectToListAndCleanUp(objectList, object) {
        this.addListCleanUpFunction(objectList, object);
        objectList.push(object);
    }

    addListCleanUpFunction(objectList, objectToRemove) {
        // filter in place.
        this.cleanUpFunctions.push(() => {
            objectList.splice(
                0,
                objectList.length,
                ...objectList.filter((object) => object !== objectToRemove)
            );
        });
    }
}
