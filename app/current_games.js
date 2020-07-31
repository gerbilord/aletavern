/*
  * This module keeps track of current games in play, as well as provides an API to modify and get players/games.
  */

var moment = require('moment'); // require


// This is esentailly the database of the app ;D
var current_games = [];


// ********************************* Public API ****************************************
function addPlayerToGame(gameId, playerName, playerWs)
{
    var game = current_games[gameId];

    if(game != null && !game.hasPlayer(playerWs))
    {
        game.addPlayer(new Player(playerName, playerWs));
    }
    else
    {
        console.debug(`Cannot add Player {${playerName}, ${playerWs}} to Game ${game}`);
    }
}

function removePlayerFromGame(gameId, playerWs)
{
    var game = current_games[gameId];

    if(game != null)
    {
        game.removePlayer(playerWs);
    }
}

function getPlayersInGame(gameId)
{
    var game = current_games[gameId];

    if (game != null)
    {
        return game.players;
    }
}

function startGame(gameId)
{
    var game = current_games[gameId];

    if(!game.hasStartData)
    {
        game.setStartData();
    }
}

function deleteGame(gameId)
{
    delete current_games[gameId];
}

function idInUse(gameId)
{
    return current_games[gameId] != undefined;
}

// ************************** Classes for module use only **************************
class Player
{
    // A player's ws also acts like their id.
    constructor(name, ws)
    {
        this.name = name;
        this.ws = ws;
    }
}

class Game
{

    // By convention this.players[0] is the host.
    constructor(host, id, name)
    {
        this.id = id;           // String
        this.name = name;       // String
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
