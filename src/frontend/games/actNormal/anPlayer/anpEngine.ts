import anpViewData from "./anpViewData";
import GameWebSocket from "Frontend/GameWebSocket";

export default class anhEngine {

    ws: GameWebSocket;
    constructor(gameWebSocket:GameWebSocket) {
        this.ws = gameWebSocket;

        document.addEventListener("touchstart", function(e){
            e.preventDefault();
        },{passive: false});

    }


    getViewData():anpViewData {
        return {};
    }
}