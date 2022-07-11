import anP_ViewData from "./anP_ViewData";
import GameWebSocket from "Frontend/GameWebSocket";

export default class anhEngine {

    ws: GameWebSocket;
    constructor(gameWebSocket:GameWebSocket) {
        this.ws = gameWebSocket;

    }


    getViewData():anP_ViewData {
        return {};
    }
}