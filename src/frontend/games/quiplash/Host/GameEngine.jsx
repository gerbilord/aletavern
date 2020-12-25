// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import CONSTANTS from '../Constants';
import prompts from './textPromts';
import 'babel-polyfill';

export default class gameEngine { // TODO The otherjoingame message is sent right away.
    // Could there be an issue where message is missed before event handlers are placed on client side?
    // Perhaps make player who joined request host data when joined.

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.players = [];
        this.playerNames = [];
        this.stateData = {};
        this.roundNum = -1;

        this.rounds = ['Lobby', 'Text', 'Final'];

        this.goToNextRound();
    }

    goToNextRound() {
        this.roundNum = this.roundNum + 1;
        let next = this.rounds[this.roundNum];

        this.ws.sendMessageToAll({ type: "please wait" });

        if (next == 'Lobby') {
            this.startLobby();
        }
        else if (next == 'Text') {
            this.startTextRound();
        }
        else if (next == 'Final') {
            this.currentState = "Final";
        }
    }

    startLobby() {
        this.currentState = "Lobby";

        var onAddNewPlayer = (serverResponse) => {
            // Add player to game list
            this.players.push(serverResponse);
            this.playerNames.push(serverResponse.data.playerName);
            this.stateData.players = this.playerNames;

            // Tell other players, amount of people in lobby
            let msgData = { type: "playerCount", numPlayers: this.players.length };
            this.ws.sendMessageToAll(msgData);
        }

        var onStart = (playerMsg) => {
            if (playerMsg.data && playerMsg.data.type == "start" && this.players.length >= CONSTANTS.MIN_PLAYERS) {
                this.ws.onMessageGame = [];
                this.ws.onOtherJoinGame = [];
                this.goToNextRound();
            }
        }

        this.stateData.players = [];
        this.ws.onOtherJoinGame.push(onAddNewPlayer);
        this.ws.onMessageGame.push(onStart);
    }

    // TODO make transition round.
    startTextRound() {
        this.currentState = "Instructions";
        this.playInstructions().then(this.sendPrompts.bind(this)); // Is playing instructions a UI thing?
    }

    playInstructions() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Perhaps we can factor this out?
    sendPrompts() {
        this.currentState = "Waiting";
        this.stateData = { roundNum: this.roundNum, numOfAnswersNeeded: this.players.length };
        this.answers = [];

        var prompt = [];
        prompt.push(prompts[Math.floor(Math.random() * prompts.length)]);// TODO actually give out prompts


        var onDone = (msg) => {
            if (msg.data.type == 'answer' && this.answers.length >= this.players.length) {
                this.ws.sendMessageToAll({ type: "please wait" });
                this.ws.onMessageGame = [];
                this.startVotingRound();
            }
        }

        var onAnswer = (msg) => {
            if (msg.data.type == 'answer') {
                this.answers.push(msg);
                this.ws.sendMessageToOne(msg.playerId, { type: "please wait" });
                this.stateData.numOfAnswersNeeded = this.stateData.numOfAnswersNeeded - 1;
                console.log("Answer!");
            }
        }

        let startMsg = { type: "please answer", prompts: [prompt] };
        this.ws.sendMessageToAll(startMsg);

        this.ws.onMessageGame.push(onAnswer);
        this.ws.onMessageGame.push(onDone);
    }

    startVotingRound() {
        this.currentState = "Instructions";
        this.playInstructions().then(this.sendAllBallots.bind(this));
    }

    async sendAllBallots() {
        console.log("WE MADE IT");
        this.stateData.text = {};
        this.stateData.text.answers = this.answers; // TODO factor out to sendBallot()
        this.currentState = "Voting"; // TODO

        for (var i; i < this.answers.length; i = i + 2) { // TODO make variable
            await this.sendBallot(this.answers.slice(i, i + 1)); // TODO makes this varaible
        }

    }

    sendBallot(listOfAnswersToVoteOn) { // TODO, include id's of players who prompt it is?
        // Players don't vote on their own answers/questions
        var numPlayersYetToVote = this.players.length - listOfAnswersToVoteOn.length;
        var playersWhoVoted = [];

        var promise = new Promise(
            (resolve, reject) => {

                let voteListener = (msgObj) => { // TODO only let each player vote once;

                    resolve(msgObj);
                };

            }
        );

        return promise;
    }

    //TODO create listener for starting game.
    getGameState() {
        let viewObj = { screen: this.currentState, stateData: this.stateData };

        return viewObj;
    }
}
