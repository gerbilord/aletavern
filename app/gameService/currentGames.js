/*
  * This module keeps track of current games in play, as well as provides an API to modify and get players/games.
  */

var moment = require('moment'); // require


// This is esentailly the database of the app ;D
var currentGames = [];


// ********************************* Public API ****************************************
function addPlayerToGame(gameId, playerWs)
{
    var game = currentGames[gameId];

    if(game != null && !game.hasPlayer(playerWs))
    {
        game.addPlayer(new Player(playerWs));
    }
    else
    {
        console.debug(`Cannot add PlayerWS: ${playerWs} to Game: ${game}`);
    }
}

function removePlayerFromGame(gameId, playerWs)
{
    var game = currentGames[gameId];

    if(game != null)
    {
        game.removePlayer(playerWs);
    }
}

function getPlayersInGame(gameId)
{
    var game = currentGames[gameId];

    if (game != null)
    {
        return game.players;
    }
    console.log("Game is null");
}

function createGame(hostWs, hostName) // TODO error handeling. Collison detection.
{
    // create ID thats not taken.
    var gameId = makeGameId();
    currentGames[gameId] = new Game(gameId, new Player(hostWs));

    return gameId;
}

function deleteGame(gameId)
{
    delete currentGames[gameId];
}

function startGame(gameId)
{
    var game = currentGames[gameId];

    if(!game.hasStartData)
    {
        game.setStartData();
    }
}

function idInUse(gameId)
{
    return currentGames[gameId] != undefined;
}

// PRIVATE HELPER FUNCTIONS
function makeGameId() {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    var length = 4;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// ************************** Classes for module use only **************************
class Player
{
    // A player's ws also acts like their id.
    constructor(ws)
    {
        this.ws = ws;
    }
}

class Game
{

    // By convention this.players[0] is the host.
    constructor(id, host, name)
    {
        this.id = id;           // String
        this.players = [host];  // Array of Players
    }

    setStartData()
    {
        this.startTime = moment();
        this.startPlayerSize = this.players.length;
    }

    hasStartData()
    {
        return this.startTime != undefined;
    }

    addPlayer(player)
    {
        this.players.push(player);
    }

    removePlayer(ws)
    {
        this.players = this.players.filter(function notSameWs(players){return player.ws != ws;});
    }

    getPlayersByWs(ws)
    {
        var matching_players = this.players.filter(function sameWs(player){ return player.ws == ws; });

        if( matching_players.length > 1)
        {
            console.debug(`Duplicate ws:${ws} in game ${this.id}`);
        }

        return matching_players;
    }

    hasPlayer(ws)
    {
        return this.getPlayersByWs(ws).length > 0;
    }

    replacePlayerWs(oldWs, newWs)
    {
        this.getPlayersByWs(oldWs).forEach(function replacePlayerWs(player){player.ws = newWs;});
    }

}


module.exports = { addPlayerToGame, removePlayerFromGame, getPlayersInGame, startGame, deleteGame, idInUse, createGame };
