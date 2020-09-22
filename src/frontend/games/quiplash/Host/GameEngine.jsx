// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import CONSTANTS from '../Constants';

export default class gameEngine { // TODO The otherjoingame message is sent right away.
    // Could there be an issue where message is missed before event handlers are placed on client side?
    // Perhaps make player who joined request host data when joined.

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.players = [];
        this.playerNames = [];
        this.stateData = {};

        this.startLobby();
    }

    startLobby() {
        this.currentState = "Lobby";

        let onAddNewPlayer = (serverResponse) => {
            // Add player to game list
            this.players.push(serverResponse);
            this.playerNames.push(serverResponse.data.name);

            // Tell other players, amount of people in lobby
            let msgData = { type: "playerCount", numPlayers: this.players.length };
            this.ws.sendMessageToAll(msgData);
        }

        let onStartRoundOne = (playerMsg) => {
            if (playerMsg.data == "startRoundOne" && this.players.length >= CONSTANTS.MIN_PLAYERS) {
                this.ws.onMessageGame = this.ws.onMessageGame.filter((func) => {
                    return (func != onStartRoundOne && func != onAddNewPlayer)
                }); // TODO consider factoring out to function
                this.startRoundOne();
            }
        }

        this.ws.onOtherJoinGame.push(onAddNewPlayer);
        this.ws.onMessageGame.push(onStartRoundOne);
    }

    startRoundOne() {
        this.currentState = "RoundOne";
        this.stateData = "none";

        this.ws.sendMessageToAll("startRoundOne");
    }

    //TODO create listener for starting game.
    getGameState() {
        let viewObj = { screen: this.currentState, players: this.playerNames, stateData: this.stateData };

        return viewObj;
    }
}
