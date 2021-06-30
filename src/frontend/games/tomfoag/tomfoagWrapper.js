import React from 'react';

import TomfoagView from './tomfoagView';
import TomfoagEngine from './tomfoagEngine'

export default class TomfoagWrapper {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.gameEngine = TomfoagEngine;
        this.gameEngine = new this.gameEngine(this.ws);
    }

    getGlobalGameView() {
        return TomfoagView;
    }
}
