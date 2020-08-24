class GameWebSocket {
  // TODO make sure websocket is still alive!

  constructor(logging) {
    var wsPath = "ws://" + window.location.host + "/game";
    this.ws = new WebSocket(wsPath);
    this.ws.addEventListener("message", this.messageHandler.bind(this));
    this.logging = logging;
  }

  messageHandler(event) {
    var msgObj = JSON.parse(event.data);

    if (this.logging) {
      console.log(msgObj);
    }

    // TODO Add all other types. OTHERJOINGAME etc.
    if (msgObj.type == "CREATEGAME") {
      // TODO probably make a switch...
      this.gameId = msgObj.data.gameId;
      this.playerId = msgObj.playerId;
      this.hostId = this.playerId;
      this.gameType = msgObj.data.gameType;

      sessionStorage.setItem("gameId", this.gameId);
      sessionStorage.setItem("playerId", msgObj.playerId);
      sessionStorage.setItem("hostId", msgObj.playerId);
      sessionStorage.setItem("gameType", msgObj.data.gameType);

      if (this.onCreateGame) {
        this.onCreateGame(msgObj);
      }
    }
    if (msgObj.type == "JOINGAME") {
      if (msgObj.status == "SUCCESS") {
        this.gameId = msgObj.data.gameId;
        this.playerId = msgObj.playerId;
        this.hostId = msgObj.hostId;
        this.gameType = msgObj.data.gameType;

        sessionStorage.setItem("gameId", this.gameId);
        sessionStorage.setItem("playerId", msgObj.playerId);
        sessionStorage.setItem("hostId", msgObj.data.hostId);
        sessionStorage.setItem("gameType", msgObj.data.gameType);

        if (this.onJoinGame) {
          this.onJoinGame(msgObj);
        }
      }
    }

    if (msgObj.type == "OTHERJOINGAME") {
      if (this.onOtherJoinGame) {
        this.onOtherJoinGame(msgObj);
      }
    }

    if (msgObj.type == "OTHERLEAVEGAME") {
      if (this.onOtherLeaveGame) {
        this.onOtherLeaveGame(msgObj);
      }
    }

    if (msgObj.type == "MESSAGEGAME") {
      if (this.onMessageGame) {
        this.onMessageGame(msgObj);
      }
    }

    if (msgObj.type == "LEAVEGAME") {
      this.clearData();
      if (this.onLeaveGame) {
        this.onJoinGame(msgObj);
      }
    }

    if (msgObj.type == "RECONNECTGAME") {
      this.gameId = msgObj.data.gameId;
      this.playerId = msgObj.playerId;
      this.hostId = msgObj.hostId;
      this.gameType = gameType;

      sessionStorage.setItem("gameId", this.gameId);
      sessionStorage.setItem("playerId", msgObj.playerId);
      sessionStorage.setItem("hostId", msgObj.hostId);
      sessionStorage.setItem("gameType", msgObj.gameType);

      if (this.onReconnectGame) {
        this.onJoinGame(msgObj);
      }
    }
  }

  clearData() {
    this.gameId = undefined;
    this.playerId = undefined;
    this.hostId = undefined;
    this.gameType = undefined;

    sessionStorage.clear(); // just clear everything
  }

  loadData() {
    this.gameId = sessionStorage.getItem("gameId");
    this.playerId = sessionStorage.getItem("playerId");
    this.hostId = sessionStorage.getItem("hostId");

    sessionStorage.clear(); // just clear everything
  }

  createGame(gameType) {
    var createMessageObj = { type: "CREATEGAME", data: gameType };
    this.ws.send(JSON.stringify(createMessageObj));
  }

  joinGame(gameId) {
    var joinMessageObj = { type: "JOINGAME", data: gameId };
    this.ws.send(JSON.stringify(joinMessageObj));
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

  reconnectGame() { // TODO reconncect doesn't reconnect if ws closed. Only if a refresh happend
    this.loadData();

    if (this.playerId) {
      // always use session storage or load data?
      var sendMessageObj = { type: "RECONNECTGAME", playerId: this.playerId };
      this.ws.send(JSON.stringify(sendMessageObj)); // TODO refactor stringify
    }
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
