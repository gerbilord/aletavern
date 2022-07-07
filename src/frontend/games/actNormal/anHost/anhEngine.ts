import anhViewData from "./anhViewData";
import GameWebSocket from "Frontend/GameWebSocket";

export default class anhEngine {
    ws: GameWebSocket;
    constructor(gameWebSocket:GameWebSocket) {
        this.ws = gameWebSocket;
    }

    getViewData():anhViewData {
        return {};
    }
}