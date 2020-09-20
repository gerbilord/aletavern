// GUI
import React from 'react';
import ReactDOM from 'react-dom';

export default class gameEngine {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.handlers = {};

        this.startLobby();
    }

    startLobby() {
        this.currentState = "lobby";
    }

    // TODO create handler/button to start game.
    // TODO create listener to listen for game start.
    getGameState() {
        return {screen:this.currentState, handlers: this.handlers};
    }
}
