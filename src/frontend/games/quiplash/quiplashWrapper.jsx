// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import HostView from './Host/View';
import HostGameEngine from './Host/GameEngine'

import PlayerView from './Player/View';
import PlayerGameEngine from './Player/GameEngine'


export default class quiplashWrapper {

    // REQUIRED
    constructor(gameWebSocket, otherArgs) {
        this.ws = gameWebSocket;

        this.gameEngine = this.ws.isHost() ? HostGameEngine : PlayerGameEngine;
        this.gameEngine = new this.gameEngine(this.ws);
    }

    // REQUIRED
    getGlobalGameView() {
        return this.ws.isHost() ? HostView : PlayerView;
    }

}
