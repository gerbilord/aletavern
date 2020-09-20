// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import SantoriniView from './santoriniView';

export default class SantoriniWrapper {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
    }

    getGlobalGameView() {
        return SantoriniView;
    }
}
