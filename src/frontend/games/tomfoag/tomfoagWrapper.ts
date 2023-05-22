import TomfoagView from './tomfoagView';
import TomfoagEngine from './tomfoagEngine'
import GameWebSocket from "Frontend/GameWebSocket";

export default class TomfoagWrapper {
    private readonly ws: GameWebSocket;
    gameEngine: TomfoagEngine;

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.gameEngine = new TomfoagEngine(this.ws);
    }

    getGlobalGameView() {
        return TomfoagView;
    }
}
