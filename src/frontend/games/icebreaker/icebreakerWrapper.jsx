import React from 'react';

import HostView from './Host/Views/ParentView';
import HostGameEngine from './Host/GameLogic/GameEngine';

import PlayerView from './Player/Views/ParentView';
import PlayerGameEngine from './Player/GameLogic/GameEngine';

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
