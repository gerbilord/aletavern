import React from 'react';

import HostView from './IbHost/IbHostViews/IbHostParentView';
import HostGameEngine from './IbHost/IbHostGameLogic/IbHostGameEngine';

import PlayerView from './IbPlayer/IbPlayerViews/IbPlayerParentView';
import PlayerGameEngine from './IbPlayer/IbPlayerGameLogic/IbPlayerGameEngine';

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
