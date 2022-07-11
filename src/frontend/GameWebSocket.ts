// noinspection SpellCheckingInspection

import * as ListUtils from 'Utils/listUtils';
import ReconnectingWebSocket from 'reconnecting-websocket';

export type onCreateGamePayload = {
    data: {
        gameId: string; // 4 Letter game code to join game
        gameType: string; // Which game you are playing
        playerId: string; // This player's websocket id for others to send messages to (also the host id)
        playerName: string; // Player display name
    };
    playerId: string; // In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "CREATEGAME";
};

export type onJoinGamePayload = {
    data: {
        gameId: string; // 4 Letter game code to join game
        gameType: string; // Which game you are playing
        hostId: string; // Host websocket id to send messages
        playerName: string; // Player display name
    };
    playerId: string; // Other player's websocket id for others to send messages to // In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "JOINGAME";
};

export type onOtherJoinGamePayload = {
    data: {
        gameId: string; // 4 Letter game code to join game
        gameType: string; // Which game you are playing
        hostId: string; // Host websocket id to send messages
        playerName: string; // Player display name
    };
    playerId: string; // Player who just joined websocket's id for others to send messages to // In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "OTHERJOINGAME";
};

export type onReconnectGamePayload = {
    data: {
        gameId: string; // 4 Letter game code to join game
        gameType: string; // Which game you are playing
        hostId: string; // Host websocket id to send messages
        playerName: string; // Player display name
    };
    playerId: string; // The websocket id of the player who reconnected. Should be same as before. // In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "RECONNECTGAME";
}

export type onOtherReconnectGamePayload = {
    data: {
        gameId: string; // 4 Letter game code to join game
        gameType: string; // Which game you are playing
        hostId: string; // Host websocket id to send messages
        playerName: string; // Player display name
    };
    playerId: string; // The websocket id of the player who reconnected. Should be same as before. // In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "OTHERRECONNECTGAME";
}

export type onMessageGamePayload<DataType=any> = {
    data: DataType; // This is the data that was sent (by other GameWebSocket, not by the server)
    playerId: string; // The websocket id of the player who sent this message
    status: "SUCCESS";
    type: "MESSAGEGAME";
};

export type onLeaveGamePayload = {
    playerId: string; // Id of this websocket that is no longer in the game or being used.// In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "LEAVEGAME";
};

export type onOtherLeaveGamePayload = {
    playerId: string; // Id of player who left the game. // In general this is the SENDER's websocket id
    status: "SUCCESS";
    type: "OTHERLEAVEGAME";
};

export type onAnyFailurePayload = {
    status: "FAILURE";
    type: "CREATEGAME" | "JOINGAME" | "RECONNECTGAME" | "LEAVEGAME" | "MESSAGEGAME";
};

type onPong = {
    type: "PONG";
};

export default class GameWebSocket {
    // TODO make sure websocket is still alive!
    // TODO make sending messages a queue. That way if the websocket is temporarily disconnected, we can send the server message

    // TODO Make game websocket reset function.
    // TODO Make request server data function.

    private wsOpenedBefore: boolean;
    private ws: ReconnectingWebSocket;
    private readonly logging: boolean;

    public gameId: string | null | undefined;
    public playerId: string | null | undefined;
    public playerName: string | null | undefined;
    public hostId:  string | null | undefined;
    public gameType:  string | null | undefined;

    public onCreateGame: { (payload: onCreateGamePayload): void; }[];
    public onJoinGame: { (payload: onJoinGamePayload): void; }[];
    public onLeaveGame: { (payload: onLeaveGamePayload): void; }[];
    public defaultOnCreateGame: { (payload: onCreateGamePayload): void; }[];
    public defaultOnJoinGame: { (payload: onJoinGamePayload): void; }[];
    public defaultOnReconnectGame: { (payload: onReconnectGamePayload): void; }[];
    public onOtherLeaveGame: { (payload: onOtherLeaveGamePayload): void; }[];
    public onOtherJoinGame: { (payload: onOtherJoinGamePayload): void; }[];
    public onReconnectGame: { (payload: onReconnectGamePayload): void; }[];
    public onOtherReconnectGame: { (payload: onOtherReconnectGamePayload): void; }[];
    public onMessageGame: { (payload: onMessageGamePayload): void; }[];
    public onAnyFailure: { (payload: onAnyFailurePayload): void; }[];

    constructor(logging:boolean = false) {
        this.wsOpenedBefore = false; // Used to tell if open event is the inital open event or a reconnect.
        const wsPath = 'ws://' + window.location.host + '/game';
        this.ws = new ReconnectingWebSocket(wsPath);
        this.ws.addEventListener('open', this.openHandler.bind(this))
        this.ws.addEventListener('message', this.messageHandler.bind(this));
        this.ws.addEventListener('close', this.closeHandler.bind(this));
        this.logging = logging;

        this.clearAllHandlers();
    }

    clearAllHandlers():void {
        this.onCreateGame = [];
        this.onJoinGame = [];
        this.onLeaveGame = [];
        this.onAnyFailure = [];
        this.defaultOnCreateGame = []; // Consider removing defaults from here
        this.defaultOnJoinGame = [];
        this.defaultOnReconnectGame = [];

        this.onOtherLeaveGame = [];
        this.onOtherJoinGame = [];
        this.onReconnectGame = [];
        this.onOtherReconnectGame = [];
        this.onMessageGame = [];
    }

    closeHandler(event):void {
        console.log("Websocket closing. Event below");
        console.log(event);
    }

    isHost():boolean {
        return !!(
            this.playerId &&
            this.hostId &&
            this.playerId === this.hostId
        );
    }

    setLocalDataFromServer(msgObj: onCreateGamePayload | onJoinGamePayload | onReconnectGamePayload):void {
        if (msgObj) {
            this.gameId = msgObj.data.gameId;
            sessionStorage.setItem('gameId', this.gameId);

            this.playerId = msgObj.playerId;
            sessionStorage.setItem('playerId', this.playerId);

            this.hostId =
                msgObj.type === 'CREATEGAME'
                    ? this.playerId
                    : msgObj.data.hostId;

            sessionStorage.setItem('hostId', this.hostId);

            this.gameType = msgObj.data.gameType;
            sessionStorage.setItem('gameType', this.gameType);

            this.playerName = msgObj.data.playerName;
            sessionStorage.setItem('playerName', this.playerName);
        } else {
            console.log('Server sent null data.');
        }
    }

    messageHandler(event:any):void {
        const msgObj:onCreateGamePayload | onJoinGamePayload | onMessageGamePayload | onReconnectGamePayload | onLeaveGamePayload
            | onOtherReconnectGamePayload | onOtherJoinGamePayload | onOtherLeaveGamePayload | onPong | onAnyFailurePayload= JSON.parse(event.data);

        if (this.logging && msgObj.type !== 'PONG') {
            console.log(msgObj);
            // console.log(performance.now() - event.timeStamp);
            // console.log(moment.now())
        }

        if(msgObj.type === 'PONG'){
            setTimeout(()=>this.sendPing(), 5000)
        }

        else if(msgObj.status === 'FAILURE'){
            this.onAnyFailure.forEach(func => func(msgObj));

            if(msgObj.type === "RECONNECTGAME"){
                this.clearData();
            }
        return;
        }

        else if (msgObj.type === 'CREATEGAME') {
            this.setLocalDataFromServer(msgObj);

            if (this.defaultOnCreateGame) {
                this.defaultOnCreateGame.forEach((func) => func(msgObj));
            }

            if (this.onCreateGame) {
                this.onCreateGame.forEach((func) => func(msgObj));
            }
        }
        else if (msgObj.type === 'JOINGAME') {

            this.setLocalDataFromServer(msgObj);

            if (this.defaultOnJoinGame) {
                this.defaultOnJoinGame.forEach((func) => func(msgObj));
            }

            if (this.onJoinGame) {
                this.onJoinGame.forEach((func) => func(msgObj));
            }

        }
        else if (msgObj.type === 'OTHERJOINGAME') {
            if (this.onOtherJoinGame) {
                this.onOtherJoinGame.forEach((func) => func(msgObj));
            }
        }
        else if (msgObj.type === 'OTHERLEAVEGAME') {
            if (this.onOtherLeaveGame) {
                this.onOtherLeaveGame.forEach((func) => func(msgObj));
            }
        }
        else if (msgObj.type === 'MESSAGEGAME') {
            if (this.onMessageGame) {
                this.onMessageGame.forEach((func) => func(msgObj));
            }
        }
        else if (msgObj.type === 'LEAVEGAME') {
            this.clearData();
            if (this.onLeaveGame) {
                this.onLeaveGame.forEach((func) => func(msgObj));
            }
        }
        else if (msgObj.type === 'RECONNECTGAME') {
                this.setLocalDataFromServer(msgObj);

            if (this.defaultOnReconnectGame) {
                this.defaultOnReconnectGame.forEach((func) => func(msgObj));
            }

            if (this.onReconnectGame) {
                this.onReconnectGame.forEach((func) => func(msgObj));
            }
        }

        else if (msgObj.type === 'OTHERRECONNECTGAME') {
            if (this.onOtherReconnectGame) {
                this.onOtherReconnectGame.forEach((func) => func(msgObj));
            }
        }
        else {
            console.log('unknown message: ' + msgObj);
        }
    }

    clearData():void {
        this.gameId = undefined;
        this.playerId = undefined;
        this.playerName = undefined;
        this.hostId = undefined;
        this.gameType = undefined;

        sessionStorage.clear(); // just clear everything
    }

    loadData():void {
        this.gameId = sessionStorage.getItem('gameId');
        this.playerId = sessionStorage.getItem('playerId');
        this.playerName = sessionStorage.getItem('playerName');
        this.hostId = sessionStorage.getItem('hostId');
        this.gameType = sessionStorage.getItem('gameType');
    }

    createGame(gameType:string, name:string): Promise<any> {
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
    joinGame(gameId:string, name:string): Promise<any> {
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

    openHandler():void {
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

    sendPing():void {
        const pingMessageObj = {
            type: 'PING',
            playerId: sessionStorage.getItem('playerId')
        }
        this.ws.send(JSON.stringify(pingMessageObj));
    }

    sendMessageToAll(msg:any):void {
        const sendMessageObj = {
            type: 'MESSAGEALLGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: msg,
        };
        this.ws.send(JSON.stringify(sendMessageObj));
    }

    sendMessageToAllOthers(msg:any):void {
        const sendMessageObj = {
            type: 'MESSAGEALLOTHERSGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: msg,
        };
        this.ws.send(JSON.stringify(sendMessageObj));
    }

    sendMessageToHost(msg:any):void {
        const sendMessageObj = {
            type: 'MESSAGEHOSTGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: msg,
        };
        this.ws.send(JSON.stringify(sendMessageObj));
    }

    sendMessageToOne(receiverId:string, msg:any):void {
        const addressedMessage = { receiverId: receiverId, message: msg };
        const sendMessageObj = {
            type: 'MESSAGEONEGAME',
            playerId: sessionStorage.getItem('playerId'),
            data: addressedMessage,
        };
        this.ws.send(JSON.stringify(sendMessageObj)); // Add try catch. Reconnect on catch
    }

    reconnectGame(shouldLoadData = true):Promise<any> {

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

    leaveGame():void {
        const sendMessageObj = {
            type: 'LEAVEGAME',
            playerId: sessionStorage.getItem('playerId'),
        };
        this.ws.send(JSON.stringify(sendMessageObj)); // TODO refactor stringify
    }

    sendToServer(msg:any):void {
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
