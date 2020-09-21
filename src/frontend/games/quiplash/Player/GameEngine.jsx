// GUI
import React from 'react';
import ReactDOM from 'react-dom';

export default class gameEngine {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.handlers = {};
        this.stateData = {};
        this.hostId = this.ws.hostId;

        this.startLobby();
    }

    startLobby() {
        this.currentState = "lobby";

        this.stateData.numPlayers = 0;

        let startGameHandler = () => {
        };

        let updatePlayerCountListener = (msgObj) => {
            if(this.isMessageFromHost(msgObj)) {
                this.stateData.numPlayers = msgObj.data.numPlayers;
            }
        };

        // updatePlayerCountListener = updatePlayerCountListener.bind(this);

        let endLobbyListener = () => {
        };

        this.ws.onMessageGame.push(updatePlayerCountListener);
    }


    // TODO create handler/button to start game.
    // TODO create listener to listen for game start.
    getGameState() {
        return {screen:this.currentState, stateData:this.stateData};
    }


    isMessageFromHost(msgObj) {

        if( msgObj ) {
            return this.hostId == msgObj.playerId;
        }

        return false;
    }


}
