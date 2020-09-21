// GUI
import React from 'react';
import ReactDOM from 'react-dom';

export default class gameEngine { // TODO The otherjoingame message is sent right away.
    // Could there be an issue where message is missed before event handlers are placed on client side?
    // Perhaps make player who joined request host data when joined.

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.players = [];
        this.stateData = {};

        this.startLobby();
    }

    startLobby() {
        this.currentState = "lobby";

        let addnewPlayer = (serverResponse) => {
            // Add player to game list
            this.players.push(serverResponse.data.name);

            // Tell other players, amount of people in lobby
            let msgData = {numPlayers: this.players.length};
            this.ws.sendMessageToAll(msgData);
        }

        this.ws.onOtherJoinGame.push( addnewPlayer );
    }

    //TODO create listener for starting game.
    getGameState() {
        let viewObj = { screen:this.currentState, players: this.players, stateData: this.stateData};

        return viewObj;
    }
}
