const gameService = require("./currentGames");

/*
   End point for all websocket calls.
   @ws   Websocket of the caller
   @msg  Data sent in message.
  */
function giveMessage(ws, msg) {
  try {
    var messageObject = JSON.parse(msg);
  } catch (e) {
    console.debug(`Invalid JSON recieved: ${msg}`);
    return;
  } // Consider sending an error message?

  routeMessageType(ws, messageObject);
}

/*
 * @ws Websocket of a new player trying to join a game.
 * @msg Expected format {data:gameId} Contains what message to join.
 */
function joinGame(ws, msg) {
  // TODO add safety checks in switch statement.

  if (!validateJoinGameMessage(msg)) {
    return; // consider returning error?
  }

    var { gameId, name } = msg.data;
    console.log(gameId);
  gameId = gameId.toUpperCase();
    var newPlayer = gameService.addPlayerToGame(gameId, ws, name);

  if (newPlayer) {
    var host = gameService.getHostOfGame(newPlayer.gameId);
    var gameType = gameService.getGameType(gameId);
    if (host) {
      var hostId = host.id;
      var dataObj = {
        hostId: hostId,
        gameId: newPlayer.gameId,
          gameType: gameType,
          name: newPlayer.name
      };

      let msgObj = {
        type: "JOINGAME",
        data: dataObj,
        playerId: newPlayer.id,
        status: "SUCCESS",
      };
      console.log(msgObj);
      newPlayer.send(msgObj);

      msgObj.type = "OTHERJOINGAME";
      emitToOthersInGame(newPlayer, msgObj);
    } else {
      // TODO gameService.addPlayerToGame should delete if game has no host. Call leave game for all? And delete game?
      let msgObj = {
        type: "JOINGAME",
        data: gameId,
        playerId: -1,
        status: "FAILURE",
      };
      console.log(msgObj);
      console.debug(`Game:${gameId} exists but has no host.`);
      sendToRawWs(ws, msgObj); // can't use Player.send since failure.
    }
  } else {
    let msgObj = {
      type: "JOINGAME",
      data: gameId,
      playerId: -1,
      status: "FAILURE",
    };
    console.log(msgObj);
    sendToRawWs(ws, msgObj); // can't use Player.send since failure.
  }
}
// TODO consider renmaing msgObj to returnObj
function validateJoinGameMessage(msg) {
  if (msg && msg.data && msg.data.gameId && msg.data.name) {
    return true;
  } else {
    return false; // Conisder console.debug.
  }
}

function reconnectToGame(ws, msg) {
  if (!validateReconnectGameMessage(msg)) {
    // TODO standardize validate function names.
    return;
  }
  var playerId = msg.playerId;
  var player = gameService.getPlayer(playerId);

  var msgObj = { type: "RECONNECTGAME", playerId: playerId };

  if (player && player.gameId) {
    // if the player and game still exist
    var host = gameService.getHostOfGame(player.gameId);

    if (host) {
      msgObj.status = "SUCCESS";
      player.setWebSocket(ws);

      var hostId = host.id;
      var dataObj = { hostId: hostId, gameId: player.gameId };
      msgObj.data = dataObj;

      console.log(msgObj);
      player.send(msgObj);
      return;
    }
  }

  // Could not find player or game was done.
  msgObj.status = "FAILURE";
  msgObj.data = "Game or player does not exist.";
  sendToRawWs(ws, msgObj);
}

function validateReconnectGameMessage(msg) {
  if (msg && msg.playerId) {
    return true;
  } else {
    return false; // Consider adding console.debug.
  }
}

function createGame(ws, msg) {
  if (!validateCreateGameMessage(msg)) {
    console.log(msg.data);
    console.log(`Bad create game message: ${msg}`);
    return;
  }

  var newHost = gameService.createGame(ws, msg.data);
  var dataObj = { gameId: newHost.gameId, gameType: msg.data };
  var msgObj = {
    type: "CREATEGAME",
    data: dataObj,
    playerId: newHost.id,
    status: "SUCCESS",
  };
  console.log(msgObj);
  newHost.send(msgObj);
}

function validateCreateGameMessage(msg) {
  if (msg) {
    if (msg.data) {
      return true;
    }
  }
  return false;
}

function leaveGame(ws, msg) {
  if (!validateLeaveGameMessage(msg)) {
    return;
  }

  var playerId = msg.playerId;
  var playerToDelete = gameService.getPlayer(playerId);
  var msgObj = { type: "LEAVEGAME", playerId: playerId };

  if (playerToDelete) {
    var gameId = playerToDelete.gameId;
    var host = gameService.getHostOfGame(gameId);

    if (!host) {
      // No host! Uh oh! Make everyone leave the game.
      msgObj.status = "SUCCESS";
      msgObj.data = "Game has no host. Game most likely already deleted.";
      console.debug(
        `Player:${playerId} tried to delete a game without a host. player's gameId:${playerId}`
      );

      emitToGame(gameId, msgObj); // Let's clean up the game just in case.
      gameService.deleteGame(gameId);
    } else if (host == playerToDelete) {
      // Host is leaving? Let's make all others leave too then. Can't play a game without a host.
      msgObj.status = "SUCCESS";
      msgObj.data = `Host deleted the game: ${gameId}`;
      emitToGame(gameId, msgObj);

      gameService.deleteGame(gameId);
    } // A non-host player wants to leave.
    else {
      msgObj.status = "SUCCESS";
      playerToDelete.send(msgObj);
      gameService.deletePlayer(playerId); // Delete the player that left.

      // Notify everyone that someone left.
      msgObj.type = "OTHERLEAVEGAME";
      emitToGame(gameId, msgObj);
    }
  } // Consider sending a disconnect message back to the ws.
  else {
    console.debug(`A non-existent player:${playerId} tried to leave a game.`);

    msgObj.status = "FAILURE";
    msgObj.data = "You are not a player in any game.";

    sendToRawWs(ws, msgObj);
  }
}

function validateLeaveGameMessage(msg) {
  if (msg) {
    if (msg.playerId) {
      return true;
    }
  } else {
    return false; // Consider logging.
  }
}
/*
 * @msg A parsed message with format {playerId, data}
 *
 * Sends message to all players in playerId's game
 */
function messageAllPlayers(msg) {
  if (validateMessageAllPlayersMsg(msg)) {
    var { playerId: playerId, data: data } = msg;

    var sender = gameService.getPlayer(playerId);

    var msgObj = {
      type: "MESSAGEGAME",
      playerId: sender.id,
      status: "SUCCESS",
      data: data,
    };
    console.log(msgObj);

    emitToGame(sender.gameId, msgObj);
  } else {
    console.debug("Malformed message: " + msg);
  }
}

function validateMessageAllPlayersMsg(msg) {
  if (msg) {
    if (msg.playerId && msg.data) {
      return true;
    } else {
      return false;
    }
  }
}

/*
 * @gameId The game to emit the message to.
 * @msgObj A preformatted and parsed message.
 */
function emitToGame(gameId, msgObj) {
  var players = gameService.getPlayersInGame(gameId);
  players.forEach((player) => player.send(msgObj));
}

/*
 * @sender Player object that sent the message.
 * @msgObj Pre-formatted
 */
function emitToOthersInGame(sender, msgObj) {
  var players = gameService.getPlayersInGame(sender.gameId);
  players
    .filter((player) => player != sender)
    .forEach((player) => player.send(msgObj));
}

/*
 * @msg an addressed message.
 */
function messageOnePlayer(msg) {
  if (validateAddressedMessage(msg)) {
    var {
      playerId: senderId,
      data: { receiverId: receiverId, message: message },
    } = msg;
    var receiver = gameService.getPlayer(receiverId);

    if (receiver) {
      var msgObj = {
        type: "MESSAGEGAME",
        playerId: senderId,
        status: "SUCCESS",
        data: message,
      };
      console.log(msgObj);
      receiver.send(msgObj);
    } else {
      console.debug("Message sent to non-existant player. Msg:" + msg);
    }
  } else {
    // Consider sending error back to sender. Return to sender!
    console.debug("Incorrectly formatted msg: " + msg);
  }
}

// checks for format {playerId, data:{recievedId, message}}
function validateAddressedMessage(msgObj) {
  if (msgObj) {
    if (msgObj.playerId && msgObj.data) {
      if (msgObj.data.receiverId && msgObj.data.message) {
        return true;
      }
    }
  }
  return false;
}

/*
 * @msg a parsed msg from the caller
 *
 * Sends msg.data to the host of the game the caller is in.
 */
function messageHost(msg) {
  var sender = gameService.getPlayer(msg.playerId);

  if (sender) {
    var gameId = sender.gameId;
    var receiver = gameService.getHostOfGame(gameId);
    msg.data = { receiverId: receiver.id, message: msg.data };
    messageOnePlayer(msg);
  }
}

function sendToRawWs(ws, msgObj) {
  if (ws) {
    try {
      ws.send(JSON.stringify(msgObj));
    } catch (e) {
      // Socket is dead, or msgObj is poorly formatted.
      // Consider debug message.
    }
  }
}

/*
 * @ws  websocket of the caller
 * @msg parsed data sent by caller
 *
 * Routes message to the correct function based on msg.type
 */
function routeMessageType(ws, msg) {
  console.log("Entering switch with: " + msg.type);
  switch (msg.type) {
    case "JOINGAME": // Implemented. Needs msg verification. Consider not using destructuring, and verify in func.
      joinGame(ws, msg);
      break;

    case "LEAVEGAME": // Implemented.
      leaveGame(ws, msg);
      break;

    case "RECONNECTGAME": // Implemented.
      reconnectToGame(ws, msg);
      break;

    case "CREATEGAME": // Implemented.
      createGame(ws, msg);
      break;

    case "MESSAGEALLGAME": // Implemented. Consider not messaging original sender.
      messageAllPlayers(msg);
      break;
    // Consider a message others
    case "MESSAGEONEGAME": // Implemented.
      messageOnePlayer(msg);
      break;

    case "MESSAGEHOSTGAME": // Implemented.
      messageHost(msg);
      break;

    default:
      console.debug(`Invalid Message: ${message}`);
  }
}

module.exports = { giveMessage };
