// GUI
import React from 'react';
import ReactDOM from 'react-dom';

export default class gameEngine {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.startLobby();
    }

    startLobby() {
        this.currentState = "lobby";
    }
    
    getGameState() {
        return {screen:this.currentState};
    }
}
