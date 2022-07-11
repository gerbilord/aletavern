import GameWebSocket from 'Frontend/GameWebSocket';

import HostView from './anHost/anH_View';
import HostGameEngine from './anHost/anH_Engine';

import PlayerView from './anPlayer/anP_View';
import PlayerGameEngine from './anPlayer/anP_Engine';

export default class actNormalWrapper {
    // REQUIRED
    private ws: GameWebSocket;
    private gameEngineType: any;
    private gameEngine: any;

    constructor(gameWebSocket: GameWebSocket , otherArgs) {
        this.ws = gameWebSocket;

        this.gameEngineType = this.ws.isHost()
            ? HostGameEngine
            : PlayerGameEngine;
        this.gameEngine = new this.gameEngineType(this.ws);
    }

    // REQUIRED
    getGlobalGameView() {
        return this.ws.isHost() ? HostView : PlayerView;
    }
}
