import 'babel-polyfill';
import Player from './Player';

export default class Players {

    constructor(ws) {
        this.hostWs = ws;
        this.players = [];
        this.vip = null;
    }

    addPlayerFromServer(serverPayload) {
        const {
            playerId
        } = serverPayload;

        if (this.findPlayerFromId(playerId) === undefined) {
            this.players.push(new Player(serverPayload));
            if (this.players.length === 1) {
                this.vip = this.players[0];
            }
        }
    }

    findPlayerFromId(id) {
        return this.players.find(player => { player.id === id });
    }

    isPlayerIdVip(id) {
        return this.vip?.id === id;
    }
}
