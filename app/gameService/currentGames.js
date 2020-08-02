/*
  * This module keeps track of current games in play, as well as provides an API to modify and get players/games.
  */

const moment = require('moment');
const { v4: uuid } = require('uuid');
const assert = require('assert'); // TODO either use or delete.


// This is esentailly the database of the app ;D
var currentGames = [];   // Maps 4 character gameId to game object.
var currentPlayers = []; // Maps a uuid playerId to player object.

// ********************************* Public API ****************************************
function addPlayerToGame(gameId, playerWs)
{
    var game = currentGames[gameId];

    if(game != null && !game.hasPlayer(playerWs)) // TODO change to check for Id. Change function name to hasPlayerWs
    {
        var newPlayer = new Player(playerWs, uuid(), gameId);
        game.addPlayer(newPlayer);
        currentPlayers[newPlayer.id] = newPlayer;
        return newPlayer;
    }
    else
    {
        console.debug(`Cannot add PlayerWS: ${playerWs} to Game: ${game}`);
    }
}

function removePlayerFromGame(gameId, playerWs) // Doesn't actually remove a player from the game?
{                                               // Actually... it should. How to handle lobbies?
    var game = currentGames[gameId];            // Jackbox.tv doesn't remove you if you disconnet.
                                                // Perhaps this function is not needed at all?
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
    else
    {
        console.debug("Requested players from invalid game. Bad game id: " + gameId);
        return [];
    }
}

function getHostOfGame(gameId){
    var game = currentGames[gameId];

    if (game != null)
    {
        return game.players[0];
    }
    else
    {
        console.debug("Requested host from invalid game. Bad game id: " + gameId);
        return null; // Consider returning a fake host.
    }
}

// Can return undefined. Maybe make mock player?
function getPlayer(playerId)
{
    var player = currentPlayers[playerId];

    if(!player){ console.log("Player does not exist: " + playerId); }

    return player;
}

function createGame(hostWs)
{
    var gameId = makeGameId();
    var newHost = new Player(hostWs, uuid(), gameId);
    currentPlayers[newHost.id] = newHost;
    currentGames[gameId] = new Game(gameId, newHost);

    return newHost;
}

function deleteGame(gameId)          // Delete game if host calls.
{                                    // Make a get host/getHostId
    delete currentGames[gameId];     // Let's do check at caller. Not really a database check.
}

// PRIVATE HELPER FUNCTIONS
function makeGameId() { // TODO if game is old just replace it

    var result = generateRandomId();

    while(currentGames[result] != null)
    {
        result = generateRandomId();
    }

    return result;
}

function generateRandomId(){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    var length = 4;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function idInUse(gameId)
{
    return currentGames[gameId] != undefined;
}
// ************************** Classes for module use only **************************
class Player
{
    // TODO
    // We probably need an id... we can't store ws in local data.
    // Create Player.send(); That way no null ptr if ws is dead.
    // create a list of websockets? maybe not needed with the id!
    // We will want to keep the game the player is in as well. 

    // A player's ws also acts like their id.
    constructor(ws, id, gameId)
    {
        this.ws = ws;
        this.id = id;
        this.gameId = gameId;
    }

    // Sends an preformatted Javascript object.
    send(msgObj)
    {
        if (this.ws)
        {
            this.ws.send(JSON.stringify(msgObj));
        }
    }
}

class Game
{

    // By convention this.players[0] is the host.
    constructor(id, host, name)
    {
        this.id = id;           // String
        this.players = [host];  // Array of Players
        this.createTime = moment();
    }

    addPlayer(player)
    {
        this.players.push(player);
    }

    removePlayer(ws)  // TODO change to Id
    {
        this.players = this.players.filter(function notSameWs(players){return player.ws != ws;});
    }

    getPlayersByWs(ws) // TODO change to Id
    {
        var matching_players = this.players.filter(function sameWs(player){ return player.ws == ws; });

        if( matching_players.length > 1)
        {
            console.debug(`Duplicate ws:${ws} in game ${this.id}`);
        }

        return matching_players;
    }

    hasPlayer(ws)  // TODO change to Id
    {
        return this.getPlayersByWs(ws).length > 0;
    }

    replacePlayerWs(oldWs, newWs)
    {
        this.getPlayersByWs(oldWs).forEach(function replacePlayerWs(player){player.ws = newWs;});
    }

}


module.exports = { addPlayerToGame, removePlayerFromGame, getPlayersInGame, deleteGame, createGame, getPlayer, getHostOfGame };
