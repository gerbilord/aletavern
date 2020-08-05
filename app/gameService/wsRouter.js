const gameService = require('./currentGames');

function giveMessage(ws, msg)
{
    try
    { var messageObject = JSON.parse(msg); }
    catch(e)
    { console.debug(`Invalid JSON recieved: ${msg}`); return; }

    routeMessageType(ws, messageObject);
}


function joinGame(ws, {data:gameId}){ // TODO add safety checks in switch statement.

    gameId = gameId.toUpperCase();
    var newPlayer = gameService.addPlayerToGame(gameId, ws);

    if (newPlayer)
    {
        var host = gameService.getHostOfGame(newPlayer.gameId);
        if(host)
        {
            var hostId = host.id;
            var dataObj = {hostId:hostId, gameId:newPlayer.gameId};

            let msgObj = {type:"JOINGAME", data: dataObj, playerId:newPlayer.id, status:"SUCCESS"};
            console.log(msgObj);
            newPlayer.send(msgObj);

            msgObj.type = "OTHERJOINGAME";
            emitToOthersInGame(newPlayer, msgObj);
        }
        else
        { // TODO gameService.addPlayerToGame should delete if game has no host.
            let msgObj = {type:"JOINGAME", data:gameId, playerId:-1, status:"FAILURE"};
            console.log(msgObj);
            console.debug("Game:${gameId} exists but has no host.");
            ws.send(msgObj); // can't use Player.send since failure.
        }
    }
    else
    {
        let msgObj = {type:"JOINGAME", data:gameId, playerId:-1, status:"FAILURE"};
        console.log(msgObj);
        ws.send(JSON.stringify(msgObj)); // can't use Player.send since failure.
    }

}

function leaveGame(msg) // TODO Tell others (host) that people left.
{
    var playerToDelete = gameService.getPlayer(msg.playerId);

    if(playerToDelete)
    {
        var host = gameService.getHostOfGame(playerToDelete.gameId);

        if(host && host == playerToDelete)
        {
            deleteGame(msg);
        }
        else
        {
            oneLeaveGame(msg);
        }
    }

}

function oneLeaveGame(msg)
{
    var playerToDelete = gameService.getPlayer(msg.playerId);

    if(playerToDelete)
    {
        var msgObj = {type:"LEAVEGAME"}; // TODO does not show originators id. Breaks API standard.
        playerToDelete.send(msgObj);
        gameService.deletePlayer(msg.playerId);
    }
}

function reconnectToGame(ws, msg){
    var playerId = msg.playerId;
    var player = gameService.getPlayer(playerId);

    var msgObj = {type: "RECONNECTGAME", playerId:playerId};

    if(player && player.gameId) // if the player and game still exist
    {
        var host = gameService.getHostOfGame(player.gameId);

        if(host)
        {
            msgObj.status = "SUCCESS";
            player.setWebSocket(ws);

            var hostId = host.id;
            var dataObj = {hostId:hostId, gameId:player.gameId};
            msgObj.data = dataObj;

            console.log(msgObj);
            player.send(msgObj);
            return;
        }
    }

    // Could not find player or game was done.
    msgObj.status = "FAILURE";
    msgObj.data = "Game or player does not exist.";
    ws.send(JSON.stringify(msgObj));
}

function createGame(ws)
{
    var newHost = gameService.createGame(ws);
    var msgObj = {type: "CREATEGAME", data:newHost.gameId, playerId:newHost.id, status:"SUCCESS"};
    console.log(msgObj);
    newHost.send(msgObj);
}

// Delete game if host initiated request.
function deleteGame({playerId:playerId}) // TODO delete player that left game.
{
    var caller = gameService.getPlayer(playerId);
    var msgObj = {type:"DELETEGAME", playerId:playerId};

    if (caller)
    {
        var gameHost = gameService.getHostOfGame(caller.gameId);

        if(gameHost) // should currentGames.js support isHost(playerId)?
        {
            if(gameHost.gameId == caller.gameId)
            {
                msgObj.status = "SUCCESS";
                msgObj.data = `Host deleted ${caller.gameId}`;
                emitToGame(caller.gameId,msgObj);
                var players = gameService.getPlayersInGame(caller.gameId);
                players.forEach( player =>{let msg = {playerId:player.id}; oneLeaveGame(msg);});
                gameService.deleteGame(caller.gameId);
                return;
            }
            else
            {
                msgObj.status = "FAILURE";
                msgObj.data = "Must be host to delete a game";
                caller.send(msgObj);
            }
        }
        else
        {
            msgObj.status = "FAILURE";
            msgObj.data = "Game has no host. Game most likely already deleted.";
            caller.send(msgObj);
            console.debug(`Player:${playerId} tried to delete a game without a host. player's gameId:${playerId}`);
        }
    }
    else
    {
        console.debug(`A non-existent player:${playerId} tried to delete a game.`);
    }
}

function messageAllPlayers({playerId:playerId, data:data}){

    var sender = gameService.getPlayer(playerId);

    var msgObj = {type:"MESSAGEGAME", playerId:sender.id, status:"SUCCESS", data:data};
    console.log(msgObj);

    emitToGame(sender.gameId, msgObj);
}

function emitToGame(gameId, msgObj){
    var players = gameService.getPlayersInGame(gameId);
    players.forEach(player => player.send(msgObj));
}

function emitToOthersInGame(newPlayer, msgObj)
{
    var players = gameService.getPlayersInGame(newPlayer.gameId);
    players.filter((player)=>player != newPlayer).forEach(player => player.send(msgObj));
}

function messageOnePlayer({playerId:senderId, data:{receiverId:receiverId, message:message}}){

    var receiver = gameService.getPlayer(receiverId);

    var msgObj = {type:"MESSAGEGAME", playerId:senderId, status:"SUCCESS", data:message};
    console.log(msgObj);
    receiver.send(msgObj);
}

function messageHost(msg){

    var sender = gameService.getPlayer(msg.playerId);

    if(sender)
    {
        var gameId = sender.gameId;
        var receiver = gameService.getHostOfGame(gameId);
        msg.data = {receiverId: receiver.id, message:msg.data};
        messageOnePlayer(msg);
    }
}

function routeMessageType(ws, msg)
{
    console.log("Entering switch with: " + msg.type);
    switch(msg.type)
    {
        case "JOINGAME": // Implemented. Needs msg verification. Consider not using destructuring, and verify in func.
        joinGame(ws, msg);
        break;

        case "LEAVEGAME": // Implemented.
        leaveGame(msg);
        break;

        case "RECONNECTGAME": // Implemented.
        reconnectToGame(ws, msg);
        break;

        case "CREATEGAME": // Implemented.
        createGame(ws);
        break;

        case "DELETEGAME": // Implemented. Consider using ws instead of data.
        deleteGame(msg);
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

module.exports = {giveMessage};
