// noinspection SpellCheckingInspection

import * as ListUtils from 'Utils/listUtils';
import ReconnectingWebSocket from 'reconnecting-websocket';
import moment from 'moment';

export default class GameWebSocket {
    // TODO make sure websocket is still alive!
    // TODO make sending messages a queue. That way if the websocket is temporarily disconnected, we can send the server message

    // TODO Make game websocket reset function.
    // TODO Make request server data function.

    // TODO add boolean to accept or reject failure messages.

    constructor(logging) {
        this.wsOpenedBefore = false; // Used to tell if open event is the inital open event or a reconnect.
        const wsPath = 'ws://' + window.location.host + '/game';
        this.ws = new ReconnectingWebSocket(wsPath);
        this.ws.addEventListener('open', this.openHandler.bind(this))
        this.ws.addEventListener('message', this.messageHandler.bind(this));
        this.ws.addEventListener('close', this.closeHandler.bind(this));
        this.logging = logging;

        this.clearAllHandlers();
    }

    clearAllHandlers() {
        this.onCreateGame = [];
        this.onJoinGame = [];
        this.onLeaveGame = [];
        this.defaultOnCreateGame = []; // Consider removing defaults from here
        this.defaultOnJoinGame = [];
        this.defaultOnReconnectGame = [];

        this.onOtherLeaveGame = [];
        this.onOtherJoinGame = [];
        this.onReconnectGame = [];
        this.onOtherReconnectGame = [];
        this.onMessageGame = [];
    }

    closeHandler(event){
        console.log("Websocket closing. Event below");
        console.log(event);
    }

    isHost() {
        return !!(
            this.playerId &&
            this.hostId &&
            this.playerId === this.hostId
        );
    }

    setLocalDataFromServer(msgObj) {
        if (msgObj) {
            this.gameId = msgObj.data.gameId;
            sessionStorage.setItem('gameId', this.gameId);

            this.playerId = msgObj.playerId;
            sessionStorage.setItem('playerId', this.playerId);

            this.hostId =
                msgObj.type === 'CREATEGAME'
                    ? this.playerId
                    : msgObj.data.hostId;
            sessionStorage.setItem('hostId', this.hostId); // TODO get info from server. (For reconnect)

            this.gameType = msgObj.data.gameType;
            sessionStorage.setItem('gameType', this.gameType);

            this.playerName = msgObj.data.playerName;
            sessionStorage.setItem('playerName', this.playerName);
        } else {
            console.log('Server sent null data.');
        }
    }

    messageHandler(event) {
        const msgObj = JSON.parse(event.data);

        if (this.logging && msgObj.type !== 'PONG') {
            console.log(msgObj);
            // console.log(performance.now() - event.timeStamp);
            // console.log(moment.now())
        }

        if(msgObj.type === 'PONG'){
            setTimeout(()=>this.sendPing(), 5000)
        }

        if (msgObj.type === 'CREATEGAME') {
            this.setLocalDataFromServer(msgObj);

            if (this.defaultOnCreateGame) {
                this.defaultOnCreateGame.forEach((func) => func(msgObj));
            }

            if (this.onCreateGame) {
                this.onCreateGame.forEach((func) => func(msgObj));
            }
        }
        if (msgObj.type === 'JOINGAME') {
            if (msgObj.status === 'SUCCESS') {
                // TODO make consistent

                this.setLocalDataFromServer(msgObj);

                if (this.defaultOnJoinGame) {
                    this.defaultOnJoinGame.forEach((func) => func(msgObj));
                }

                if (this.onJoinGame) {
                    this.onJoinGame.forEach((func) => func(msgObj));
                }
            }
        }

        if (msgObj.type === 'OTHERJOINGAME') {
            if (this.onOtherJoinGame) {
                this.onOtherJoinGame.forEach((func) => func(msgObj));
            }
        }

        if (msgObj.type === 'OTHERLEAVEGAME') {
            if (this.onOtherLeaveGame) {
                this.onOtherLeaveGame.forEach((func) => func(msgObj));
            }
        }

        if (msgObj.type === 'MESSAGEGAME') {
            if (this.onMessageGame) {
                this.onMessageGame.forEach((func) => func(msgObj));
            }
        }

        if (msgObj.type === 'LEAVEGAME') {
            this.clearData();
            if (this.onLeaveGame) {
                this.onLeaveGame.forEach((func) => func(msgObj));
            }
        }

        if (msgObj.type === 'RECONNECTGAME') {
            if (msgObj.status === 'SUCCESS') {
                this.setLocalDataFromServer(msgObj);
            } else {
                this.clearData();
            }

            if (this.defaultOnReconnectGame) {
                this.defaultOnReconnectGame.forEach((func) => func(msgObj));
            }

            if (this.onReconnectGame) {
                this.onReconnectGame.forEach((func) => func(msgObj));
            }
        }

        if (msgObj.type === 'OTHERRECONNECTGAME') {
            if (this.onOtherReconnectGame) {
                this.onOtherReconnectGame.forEach((func) => func(msgObj));
            }
        }
    }

    clearData() {
        this.gameId = undefined;
        this.playerId = undefined;
        this.playerName = undefined;
        this.hostId = undefined;
        this.gameType = undefined;

        sessionStorage.clear(); // just clear everything // TODO dont remove everything. Some games may use it.
    }

    loadData() {
        this.gameId = sessionStorage.getItem('gameId');
        this.playerId = sessionStorage.getItem('playerId');
        this.playerName = sessionStorage.getItem('playerName');
        this.hostId = sessionStorage.getItem('hostId');
        this.gameType = sessionStorage.getItem('gameType');
    }

    createGame(gameType, name) {
        const dataObj = { gameType: gameType, playerName: name };
        const createMessageObj = { type: 'CREATEGAME', data: dataObj };

        let promise = new Promise((resolve) => {
            let createListener = (msgObj) => {
                ListUtils.removeItemFromList(
                    this.defaultOnCreateGame,
                    createListener
                );
                resolve(msgObj);
            };

            this.defaultOnCreateGame.push(createListener);
        });

        this.ws.send(JSON.stringify(createMessageObj));

        return promise;
    }

    // Returns a promise that resolves when websocket joins a game.
    // As an alternative, you can add your own listener to this.onJoinGame[]
    joinGame(gameId, name) {
        const dataObj = { gameId: gameId, playerName: name };
        const joinMessageObj = { type: 'JOINGAME', data: dataObj };

        let promise = new Promise((resolve) => {
            let joinListener = (msgObj) => {
                ListUtils.removeItemFromList(
                    this.defaultOnJoinGame,
                    joinListener
                );
                resolve(msgObj);
            };

            this.defaultOnJoinGame.push(joinListener);
        });

        this.ws.send(JSON.stringify(joinMessageObj));

        return promise;
    }

    openHandler(){
        if(this.wsOpenedBefore){ // If the websocket was opened before
            // it is a reconnect event.
            console.log("Reconnected.");
            this.reconnectGame(false);
        } else {
            // otherwise it is the first open event!
            console.log("Opening!");
            this.wsOpenedBefore = true;
        }

        this.sendPing();
    }

    sendPing(){
        const pingMessageObj = {
            type: 'PING',
            playerId: sessionStorage.getItem('playerId')
        }
        this.ws.send(JSON.stringify(pingMessageObj));
    }

    sendMessageToAll(msg) {
        const sendMessageObj = {
            type: 'MESSAGEALLGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: msg,
        };
        this.ws.send(JSON.stringify(sendMessageObj));
    }

    sendMessageToAllOthers(msg) {
        const sendMessageObj = {
            type: 'MESSAGEALLOTHERSGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: msg,
        };
        this.ws.send(JSON.stringify(sendMessageObj));
    }

    sendMessageToHost(msg) {
        const sendMessageObj = {
            type: 'MESSAGEHOSTGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: msg,
        };
        this.ws.send(JSON.stringify(sendMessageObj));
    }

    sendMessageToOne(receiverId, msg) {
        const addressedMessage = { receiverId: receiverId, message: msg };
        const sendMessageObj = {
            type: 'MESSAGEONEGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: addressedMessage,
        };
        this.ws.send(JSON.stringify(sendMessageObj)); // Add try catch. Reconnect on catch
    }

    reconnectGame(shouldLoadData = true) {

        if(shouldLoadData){
            this.loadData();
        }

        // Resolve server response when
        let promise = new Promise((resolve) => {
            let reconnectListener = (msgObj) => {
                ListUtils.removeItemFromList(
                    this.defaultOnReconnectGame,
                    reconnectListener
                );
                resolve(msgObj);
            };

            this.defaultOnReconnectGame.push(reconnectListener);
        });

        const sendMessageObj = {
            type: 'RECONNECTGAME',
            playerId: this.playerId,
        };
        this.ws.send(JSON.stringify(sendMessageObj)); // TODO refactor stringify

        return promise;
    }

    leaveGame() {
        const sendMessageObj = {
            type: 'LEAVEGAME',
            playerId: sessionStorage.getItem('playerId'),
        };
        this.ws.send(JSON.stringify(sendMessageObj)); // TODO refactor stringify
    }

    sendToServer(msg) {
        let msgObj;
        try {
            msgObj = JSON.stringify(msg);
        } catch (e) {
            console.log('Invalid message for JSON.stringify');
        }

        try {
            this.ws.send(msgObj);
        } catch (e) {
            console.log('Websocket closed. Trying to reconncect.');
            this.reconnectGame();
            // TODO keep trying to reconnect.
        }
    }
}
