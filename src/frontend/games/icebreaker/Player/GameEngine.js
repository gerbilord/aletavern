// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import CONSTANTS from '../Constants';

export default class gameEngine {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
    }
}
