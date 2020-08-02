const gameService = require('./currentGames');

function giveMessage(ws, msg)
{

    try
    { var messageObject = JSON.parse(msg); }
    catch(e)
    { console.debug(`Invalid JSON recieved: ${msg}`); return; }

    routeMessageType(ws, messageObject);
}


function joinGame(ws, msg){
    // TODO add safety checks
    gameService.addPlayerToGame( msg.gameId, ws);

    var msgObj = {type:"JOINGAME"};
    ws.send(JSON.stringify(msgObj));
}

function leaveGame(ws, msg){} // TODO

function reconnectToGame(ws, msg){} // TODO

function createGame(ws, msg)
{
    var gameId = gameService.createGame(ws, msg.name);
    var msgObj = {type: "CREATEGAME", gameId:gameId};
    ws.send(JSON.stringify(msgObj)); // TODO format
}

function deleteGame(ws,msg){} // TODO

function messageAllPlayers(ws, msg){
    console.log("Messaging all players in " + msg.gameId);
    var players = gameService.getPlayersInGame(msg.gameId);

    msgObj = {type:"MESSAGE", msg:msg.msg};
    players.forEach(player => player.ws.send(JSON.stringify(msgObj))); //TODO don't send to self?
}

function messageOnePlayer(ws, msg){}

function messageHost(ws, msg){}

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
        createGame(ws, msg);
        break;

        case "DELETEGAME":
        deleteGame(ws,msg);
        break;

        case "MESSAGEALLGAME":
        messageAllPlayers(ws, msg);
        break;

        case "MESSAGEONEGAME":
        messageOnePlayer(ws, msg);
        break;

        case "MESSAGEHOSTGAME":
        messageHost(ws, msg);
        break;

        default:
        console.debug(`Invalid Message: ${message}`);
    }

}




module.exports = {giveMessage};
