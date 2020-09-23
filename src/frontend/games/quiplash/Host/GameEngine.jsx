// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import CONSTANTS from '../Constants';
import prompts from './textPromts';

export default class gameEngine { // TODO The otherjoingame message is sent right away.
    // Could there be an issue where message is missed before event handlers are placed on client side?
    // Perhaps make player who joined request host data when joined.

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.players = [];
        this.playerNames = [];
        this.stateData = {};
        this.roundNum = -1;

        this.rounds = ['Lobby', 'Text', 'Text', 'Final'];

        this.goToNextRound();
    }

    goToNextRound() {
        this.roundNum = this.roundNum + 1;
        let next = this.rounds[this.roundNum];

        if (next == 'Lobby') {
            this.startLobby();
        }
        else if (next == 'Text') {
            this.startTextRound();
        }
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

        let onStart = (playerMsg) => {
            if (playerMsg.data && playerMsg.data.type == "start" && this.players.length >= CONSTANTS.MIN_PLAYERS) {
                this.ws.onMessageGame = [];
                this.ws.onOtherJoinGame = [];
                this.goToNextRound();
            }
        }

        this.ws.onOtherJoinGame.push(onAddNewPlayer);
        this.ws.onMessageGame.push(onStart);
    }

    // TODO make transition round.
    startTextRound() {
        // TODO play audio instructions here.
        // TODO FIX

        this.currentState = "Text Round";
        this.stateData = {};
        this.stateData.answers = [];

        let prompt = [];
        prompt.push(prompts[Math.floor(Math.random() * prompts.length)]);// TODO actually give out prompts


        let onDone = (msg) => {
            if (msg.data.type == 'answer' && this.answers.length == this.players.length) {
                this.ws.sendMessageToAll({ type: "next" });
            }
        }

        var onAnswer = (msg) => {
            if (msg.data.type == 'answer') {
                this.answers.push(msg);
            }
        }

        let startMsg = { type: "startRound", roundNum: this.roundNum, roundType: "text", roundData: prompt };
        this.ws.sendMessageToAll(startMsg);

        this.ws.onMessageGame.push(onAnswer);
        this.ws.onMessageGame.push(onDone);

    }

    //TODO create listener for starting game.
    getGameState() {
        this.stateData.roundNum = this.roundNum;
        let viewObj = { screen: this.currentState, players: this.playerNames, stateData: this.stateData };

        return viewObj;
    }
}
