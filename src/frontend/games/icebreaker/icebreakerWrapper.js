import HostView from './IbHost/IbHostParentView';
import HostGameEngine from './IbHost/IbHostGameEngine';

import PlayerView from './IbPlayer/IbPlayerParentView';
import PlayerGameEngine from './IbPlayer/IbPlayerGameEngine';

export default class icebreakerWrapper {
    // REQUIRED
    constructor(gameWebSocket, otherArgs) {
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
