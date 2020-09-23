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
        let startGameHandler = () => {
            let msgObj = { type: "start" }
            this.ws.sendMessageToHost(msgObj);
        };

        let updatePlayerCountListener = (msgObj) => {
            if (this.isMessageFromHost(msgObj) && msgObj.data.type == 'playerCount') { // TODO check if message is valid.
                this.stateData.numPlayers = msgObj.data.numPlayers;
                this.stateData.canStart = this.stateData.numPlayers >= CONSTANTS.MIN_PLAYERS;
            }
        };

        let endLobbyListener = (msgObj) => {
            if (msgObj.data && msgObj.data.type == "startRound") {
                this.ws.onMessageGame = [];
                this.goToNextRound(msgObj.data);
            }
        };

        this.currentState = "Lobby";
        this.stateData.numPlayers = 0;

        this.ws.onMessageGame.push(updatePlayerCountListener);
        this.ws.onMessageGame.push(endLobbyListener);

        this.stateData.startGameFunction = startGameHandler;
    }

    // TODO go to transition state instead.

    goToNextRound(msgData) {
        let { roundType, roundNum, roundData } = msgData;
        this.stateData = { roundNum: roundNum, roundData: roundData };

        if (roundType == 'text') {
            this.startTextRound();
        }
    }

    startTextRound() {

        // TODO FIX
        var currentPromptNum = 0;

        var sendAnswer = (answer) => {
            let msg = { type: "answer", answer: answer }
            // currentPromptNum = currentPromptNum + 1;
            this.ws.sendMessageToHost(msg);
        }

        var onRoundOver = (msgObj) => {
            if (msgObj.type == 'next')
                this.goToNextRound(msgObj)
        }

        this.stateData.currentPrompt = this.stateData.roundData[currentPromptNum];

        this.currentState = "Text Round";

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
