// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import CONSTANTS from '../Constants';
import prompts from './textPromts';
import 'babel-polyfill';

export default class gameEngine {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
    }
}
