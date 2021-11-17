import HostView from './IbHost/Ib_HostParentView';
import HostGameEngine from './IbHost/Ib_HostGameEngine';

import PlayerView from './IbPlayer/Ib_PlayerParentView';
import PlayerGameEngine from './IbPlayer/Ib_PlayerGameEngine';

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
