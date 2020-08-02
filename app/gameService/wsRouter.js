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
    var newPlayer = gameService.addPlayerToGame(gameId, ws);

    if (newPlayer)
    {
        let msgObj = {type:"JOINGAME", gameId: newPlayer.gameId, playerId:newPlayer.id, status:"SUCCESS"};
        console.log(msgObj);
        emitToGame(newPlayer.gameId, msgObj);
    }
    else
    {
        let msgObj = {type:"JOINGAME", gameId:msg.gameId, playerId:-1, status:"FAILURE"};
        console.log(msgObj);
        ws.send(msgObj); // can't use Player.send since failure.
    }

}

function leaveGame(ws, msg){} // TODO is this even needed?

function reconnectToGame(ws, msg){} // TODO

function createGame(ws)
{
    var newHost = gameService.createGame(ws);
    var msgObj = {type: "CREATEGAME", gameId:newHost.gameId, playerId:newHost.id, status:"SUCCESS"};
    console.log(msgObj);
    newHost.send(msgObj);
}

function deleteGame(ws,msg){} // TODO

function messageAllPlayers({playerId:playerId, data:data}){

    var sender = gameService.getPlayer(playerId);

    var msgObj = {type:"MESSAGE", playerId:sender.id, status:"SUCCESS", data:data};
    console.log(msgObj);

    emitToGame(sender.gameId, msgObj);
}

function emitToGame(gameId, msgObj){
    var players = gameService.getPlayersInGame(gameId);
    players.forEach(player => player.send(msgObj));
}

function messageOnePlayer({playerId:senderId, data:{receiverId:receiverId, message:message}}){

    var receiver = gameService.getPlayer(receiverId);

    var msgObj = {type:"MESSAGE", playerId:senderId, status:"SUCCESS", data:message};
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
        case "JOINGAME":
        joinGame(ws, msg);
        break;

        case "LEAVEGAME":
        leaveGame(ws, msg);
        break;

        case "RECONNECTGAME":
        reconnectToGame(ws, msg);
        break;

        case "CREATEGAME":
        createGame(ws);
        break;

        case "DELETEGAME":
        deleteGame(ws,msg);
        break;

        case "MESSAGEALLGAME":
        messageAllPlayers(msg);
        break;

        case "MESSAGEONEGAME":
        messageOnePlayer(ws, msg);
        break;

        case "MESSAGEHOSTGAME":
        messageHost(msg);
        break;

        default:
        console.debug(`Invalid Message: ${message}`);
    }

}




module.exports = {giveMessage};
