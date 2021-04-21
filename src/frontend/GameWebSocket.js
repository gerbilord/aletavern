export default class GameWebSocket {
  // TODO make sure websocket is still alive!
  // TODO make sending messages a queue. That way if the websocket is temporarily disconnected, we can send the server message

  // TODO Make game websocket reset function.
  // TODO Make request server data function.

  // TODO add boolean to accept or reject failure messages.

  constructor(logging) {
    var wsPath = "ws://" + window.location.host + "/game";
    this.ws = new WebSocket(wsPath);
    this.ws.addEventListener("message", this.messageHandler.bind(this));
    this.logging = logging;

    this.clearAllHandlers();
  }

  clearAllHandlers() {
    this.onCreateGame = [];
    this.onJoinGame = [];
      this.defaultOnCreateGame = []; // Consider removing defaults from here
      this.defaultOnJoinGame = [];
      this.defaultOnReconnectGame = [];

    this.onLeaveGame = [];
    this.onOtherJoinGame = [];
      this.onReconnectGame = [];
      this.onOtherReconnectGame = [];
    this.onMessageGame = [];
  }

  isHost() {
    if (this.playerId && this.hostId && this.playerId == this.hostId) {
      return true;
    }
    return false;
  }

  setLocalDataFromServer(msgObj) {
    if (msgObj) {
      this.gameId = msgObj.data.gameId;
      sessionStorage.setItem("gameId", this.gameId);

      this.playerId = msgObj.playerId;
      sessionStorage.setItem("playerId", this.playerId);

      this.hostId = msgObj.type == "CREATEGAME" ? this.playerId : msgObj.data.hostId;
      sessionStorage.setItem("hostId", this.hostId); // TODO get info from server. (For reconnect)

      this.gameType = msgObj.data.gameType;
      sessionStorage.setItem("gameType", this.gameType);

      this.playerName = msgObj.data.playerName;
      sessionStorage.setItem("playerName", this.playerName);
    }
    else {
      console.log("Server sent null data.");
    }
  }

  messageHandler(event) {
    var msgObj = JSON.parse(event.data);

    if (this.logging) {
      console.log(msgObj);
    }

    if (msgObj.type == "CREATEGAME") {
      this.setLocalDataFromServer(msgObj);

      if (this.defaultOnCreateGame) {
        this.defaultOnCreateGame.forEach(func => func(msgObj));
      }

      if (this.onCreateGame) {
        this.onCreateGame.forEach(func => func(msgObj));
      }
    }
    if (msgObj.type == "JOINGAME") {
      if (msgObj.status == "SUCCESS") { // TODO make consistent

        this.setLocalDataFromServer(msgObj);

        if (this.defaultOnJoinGame) {
          this.defaultOnJoinGame.forEach(func => func(msgObj));
        }

        if (this.onJoinGame) {
          this.onJoinGame.forEach(func => func(msgObj));
        }
      }
    }

    if (msgObj.type == "OTHERJOINGAME") {
      if (this.onOtherJoinGame) {
        this.onOtherJoinGame.forEach(func => func(msgObj));
      }
    }

    if (msgObj.type == "OTHERLEAVEGAME") {
      if (this.onOtherLeaveGame) {
        this.onOtherLeaveGame.forEach(func => func(msgObj));
      }
    }

    if (msgObj.type == "MESSAGEGAME") {
      if (this.onMessageGame) {
        this.onMessageGame.forEach(func => func(msgObj));
      }
    }

    if (msgObj.type == "LEAVEGAME") {
      this.clearData();
      if (this.onLeaveGame) {
        this.onLeaveGame.forEach(func => func(msgObj));
      }
    }

      if (msgObj.type == "RECONNECTGAME") {
          if(msgObj.status === "SUCCESS") {
              this.setLocalDataFromServer(msgObj);
          }
          else {
              this.clearData();
          }

        if (this.defaultOnReconnectGame) {
            this.defaultOnReconnectGame.forEach(func => func(msgObj));
        }

      if (this.onReconnectGame) {
        this.onReconnectGame.forEach(func => func(msgObj));
      }
    }

      if (msgObj.type == "OTHERRECONNECTGAME") {
          if (this.onOtherReconnectGame) {
              this.onOtherReconnectGame.forEach(func => func(msgObj));
          }
      }
  }

  clearData() {
    this.gameId = undefined;
    this.playerId = undefined;
    this.playerName = undefined;
    this.hostId = undefined;
    this.gameType = undefined;

    sessionStorage.clear(); // just clear everything
  }

  loadData() {
    this.gameId = sessionStorage.getItem("gameId");
    this.playerId = sessionStorage.getItem("playerId");
    this.playerName = sessionStorage.getItem("playerName");
    this.hostId = sessionStorage.getItem("hostId");
    this.gameType = sessionStorage.getItem("gameType");
  }

  createGame(gameType, name) {
    var dataObj = { gameType: gameType, playerName: name };
    var createMessageObj = { type: "CREATEGAME", data: dataObj };

    let promise = new Promise(
      (resolve, reject) => {
        let createListener = (msgObj) => {
          this.defaultOnCreateGame = this.defaultOnCreateGame.filter(func => func !== createListener);
          resolve(msgObj);
        };

        this.defaultOnCreateGame.push(createListener);

      });

    this.ws.send(JSON.stringify(createMessageObj));

    return promise;
  }

  joinGame(gameId, name) {
    var dataObj = { gameId: gameId, playerName: name };
    var joinMessageObj = { type: "JOINGAME", data: dataObj };

    let promise = new Promise(
      (resolve, reject) => {
          let joinListener = (msgObj) => {
          this.defaultOnJoinGame = this.defaultOnJoinGame.filter(func => func !== joinListener);
          resolve(msgObj);
       };

        this.defaultOnJoinGame.push(joinListener);

      });

    this.ws.send(JSON.stringify(joinMessageObj));

    return promise;
  }

  sendMessageToAll(msg) {
    var sendMessageObj = {
      type: "MESSAGEALLGAME",
      playerId: sessionStorage.getItem("playerId"),
      data: msg,
    };
    this.ws.send(JSON.stringify(sendMessageObj));
  }

  sendMessageToHost(msg) {
    var sendMessageObj = {
      type: "MESSAGEHOSTGAME",
      playerId: sessionStorage.getItem("playerId"),
      data: msg,
    };
    this.ws.send(JSON.stringify(sendMessageObj));
  }

  sendMessageToOne(receiverId, msg) {
    var addressedMessage = { receiverId: receiverId, data: msg };
    var sendMessageObj = {
      type: "MESSAGEONEGAME",
      playerId: sessionStorage.getItem("playerId"),
      data: addressedMessage,
    };
    this.ws.send(JSON.stringify(sendMessageObj)); // Add try catch. Reconnect on catch
  }

  reconnectGame() { // TODO reconnect doesn't reconnect if ws closed. Only if a refresh happend
    this.loadData();

        let promise = new Promise(
            (resolve, reject) => {
                let createListener = (msgObj) => {
                    this.defaultOnReconnectGame = this.defaultOnReconnectGame.filter(func => func !== createListener);
                    resolve(msgObj);
                };

                this.defaultOnReconnectGame.push(createListener);

            });

        var sendMessageObj = { type: "RECONNECTGAME", playerId: this.playerId };
        this.ws.send(JSON.stringify(sendMessageObj)); // TODO refactor stringify

        return promise;
  }

  leaveGame() {
    var sendMessageObj = {
      type: "LEAVEGAME",
      playerId: sessionStorage.getItem("playerId"),
    };
    this.ws.send(JSON.stringify(sendMessageObj)); // TODO refactor stringify
  }

  sendToServer(msg) {
    try {
      var msgObj = JSON.stringify(msg);
    } catch (e) {
      console.log("Invalid message for JSON.stringify");
    }

    try {
      this.ws.send(msgObj);
    } catch (e) {
      console.log("Websocket closed. Trying to reconncect.");
      this.reconncectGame();
      // TODO keep trying to reconnect.
    }
  }
}
