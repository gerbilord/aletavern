import Player from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Player';

export default class Players {
    constructor(ws) {
        this.hostWs = ws;
        this.players = [];
        this.vip = null;
    }

    // Adds player if it doesn't already exist. Returns player added to list. Null if not added.
    addPlayerFromServer(serverPayload) {
        const { playerId } = serverPayload;

        if (this.findPlayerFromId(playerId) === undefined) {
            const newPlayer = new Player(serverPayload);
            this.players.push(newPlayer);
            if (this.players.length === 1) {
                this.vip = newPlayer;
            }
            return newPlayer;
        }
        return null;
    }

    findPlayerFromId(idToFind) {
        return this.players.find(({ id }) => {
            return id === idToFind;
        });
    }

    isPlayerIdVip(id) {
        return this.vip?.id === id;
    }

    // TODO Should this validate that player is in list?
    sendPlayerMessage(player, msg) {
        const { id } = player;
        this.hostWs.sendMessageToOne(id, msg);
    }

    // TODO Consider refactoring to GameWebSocket
    // Array of players
    sendGroupMessage(group, msg) {
        group.forEach((player) => {
            this.sendPlayerMessage(player, msg);
        });
    }

    sendMessageToAll(msg) {
        this.hostWs.sendMessageToAll(msg);
    }

    // TODO Consider only sending message to players in list. In case of spectators later.
    sendMessageToAllPlayers(msg) {
        this.hostWs.sendMessageToAllOthers(msg);
    }

    get length() {
        return this.players.length;
    }
}
