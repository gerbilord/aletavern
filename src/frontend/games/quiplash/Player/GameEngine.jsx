// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import CONSTANTS from '../Constants';

export default class gameEngine {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.handlers = {};
        this.stateData = {};
        this.hostId = this.ws.hostId;

        this.startLobby();
    }

    startLobby() {
        this.currentState = "Lobby";

        this.stateData.numPlayers = 0;

        let startGameHandler = () => {
            this.ws.sendMessageToHost("startRoundOne");
        };

        let updatePlayerCountListener = (msgObj) => {
            if (this.isMessageFromHost(msgObj) && msgObj.data.type == 'playerCount') { // TODO check if message is valid.
                let minPlayers = 2; // TODO Factor out into constant file, perhaps even constant between both engines.
                this.stateData.numPlayers = msgObj.data.numPlayers;
                this.stateData.canStart = this.stateData.numPlayers >= CONSTANTS.MIN_PLAYERS;
            }
        };

        let endLobbyListener = (msgObj) => {
            if (msgObj.data == "startRoundOne") {
                this.ws.onMessageGame = this.ws.onMessageGame.filter(func => func != endLobbyListener && func != updatePlayerCountListener);
                this.startRoundOne();
            }
        };

        this.ws.onMessageGame.push(updatePlayerCountListener);
        this.ws.onMessageGame.push(endLobbyListener);

        this.stateData.startGameFunction = startGameHandler;
    }

    startRoundOne() {
        this.currentState = "RoundOne";
        this.stateData = {};
    }


    // TODO create handler/button to start game.
    // TODO create listener to listen for game start.
    getGameState() {
        return { screen: this.currentState, stateData: this.stateData };
    }


    isMessageFromHost(msgObj) {

        if (msgObj) {
            return this.hostId == msgObj.playerId;
        }

        return false;
    }


}
