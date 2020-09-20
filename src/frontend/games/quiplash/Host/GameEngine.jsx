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
        this.players = [];

        this.ws.onOtherJoinGame.push(
            (serverResponse) => {
                this.players.push(serverResponse.data.name);
            }
        );
    }

    getGameState() {
        let viewObj = { screen:this.currentState, players: this.players};

        return viewObj;
    }
}
