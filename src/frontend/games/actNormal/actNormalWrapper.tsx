import GameWebSocket from 'Frontend/GameWebSocket';

import HostView from './anHost/anhView';
import HostGameEngine from './anHost/anhEngine';

import PlayerView from './anPlayer/anpView';
import PlayerGameEngine from './anPlayer/anpEngine';

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
