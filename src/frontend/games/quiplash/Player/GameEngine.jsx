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
            if (msgObj.data && msgObj.data.type == "please wait") {
                this.ws.onMessageGame = [];
                this.wait();
            }
        };

        this.currentState = "Lobby";
        this.stateData.numPlayers = 0;

        this.ws.onMessageGame.push(updatePlayerCountListener);
        this.ws.onMessageGame.push(endLobbyListener);

        this.stateData.startGameFunction = startGameHandler;
    }

    wait() {
        var onInstructions = (msg) => {

            if (msg && msg.data && msg.data.type == "instructions" && this.isMessageFromHost(msg)) {
                this.ws.onMessageGame = [];

                let instructions = msg.data;
                let command = instructions.command;

                if (command == "please answer") {
                    this.ws.onMessageGame = [];
                    this.answerPropmts(instructions.prompts);
                }
                else if (command == "please vote") {
                    this.ws.onMessageGame = [];
                    this.voteOnAnswers(instructions.answers)
                }
                else if (command == "please leave") {
                    this.ws.onMessageGame = [];
                }
            }
        }

        this.ws.onMessageGame(onInstructions);
        this.currentState = "Wait";
        this.stateData = {};
    }

    answerPropmts(prompts) {

        var currPromptNum = 0;
        var currPrompt = prompts[currPromptNum];

        var sendAnswer = (answer) => {
            let msg = { type: "answer", answer: answer }
            this.ws.sendMessageToHost(msg);

            currPromptNum = currPromptNum + 1;

            if (currPromptNum < prompts.length) {
                currPrompt = prompts[currPromptNum];
            }
            else {
                this.ws.onMessageGame = [];
                this.wait();
            }
        }

        var onTimesUp = (msgObj) => {
            if (msgObj.data && msgObj.data.type == "please wait") {
                this.ws.onMessageGame = [];
                this.wait();
            }
        }

        this.ws.onMessageGame.push(onTimesUp);
        this.stateData.answerFunc = sendAnswer;
        this.currentState = "Answer";
    }

    // Change to one answer set at a time...
    voteOnAnswers(answerSet) {

        var createVoteOnSet = () => {
            return answerSet.map((answer) => {
                return () => {
                    sendVote(answer);
                }
            });
        };

        var sendVote = (answer) => {
            let msg = { type: "vote", answer: answer }
            this.ws.sendMessageToHost(msg);
        }

        var onTimesUp = (msgObj) => {
            if (msgObj.data && msgObj.data.type == "please wait") {
                this.ws.onMessageGame = [];
                this.wait();
            }
        }

        this.ws.onMessageGame.push(onTimesUp);
        this.stateData.voteOnSet = createVoteOnSet();
        this.stateData.answerSet = answerSet;
        this.currentState = "Vote";
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
