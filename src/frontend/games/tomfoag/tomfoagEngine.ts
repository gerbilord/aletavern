import GameWebSocket from "Frontend/GameWebSocket";

export type BoardState = {
    board: Graph,
    glacier: { [key: string]: number; },
    players: [IPlayer, IPlayer],
    validMoves: any,
    turn: any,
    canMove: boolean,
    winner: number,
};

export type IPlayer = [number, number, number];

export type IMoveType = "take" | "place" | "move";

export type IValidMove = [IMoveType, [number, number]];


const dirMap = {
    0: [0, -1],
    1: [1, -1],
    2: [1,  0],
    3: [0,  1],
    4: [-1, 1],
    5: [-1, 0]
};

export const dirList = [
    [0, -1],
    [1, -1],
    [1,  0],
    [0,  1],
    [-1, 1],
    [-1, 0]
];

var game1 = [
    "T6m1",
    "T2m4",
    "P4m4",
    "T3m4",
    "T3m4",
    "T3m1"
];

var game2 = [
    "T1m6",
    "T2m3",
    "T6m5",
    "T4m2",
    "P6m6",
    "P4m3",
    "T5m3",
    "T5m6",
    "P5m2",
    "P6m2",
    "P6m6",
    "P6m6",
    "T3m6",
    "T4m6",
    "T5m6",
    "T4m3",
    "T1m1",
    "P4m4",
    "T2m4",
    "P5m1",
    "T1m3",
    "P4m3",
    "T6m3",
    "T5m6",
    "T6m2",
    "P5m5",
    "T6m5",
    "P1m2",
    "P3m2",
    "P2m2",
    "P6m6",
    "P3m3",
    "T1m3",
    "P6m6",
    "T1m6",
    "T3m6",
    "T3m6",
    "P5m6",
    "P2m2",
    "P5m5",
    "T6m5",
    "T4m2",
    "T6m2",
    "P2m2",
    "T1m6",
    "P3m3",
    "T3m1",
    "T4m4",
    "T2m3"
];

// Graph representation of hexagon grid
class Graph {
    private size: number;
    neighbors: any;

    constructor() {
        this.size = 0;
        this.neighbors = {};
    }

    // v: vertex
    addVertex(v) {
        if (!(this.neighbors.hasOwnProperty(v))) {
            // @ts-ignore
            this.neighbors[[v]] = [];
            this.size++;
        }
    }

    // v: vertex 1
    // w: vertex 2
    addEdge(v, w) {
        // Forwards
        if (this.neighbors.hasOwnProperty(v)) {
            // @ts-ignore
            this.neighbors[[v]].push(w);
            // @ts-ignore
            this.neighbors[[v]] = Object.values(this.neighbors[[v]].reduce((p,c) => (p[JSON.stringify(c)] = c,p),{}));
        }

        // Backwards
        if (this.neighbors.hasOwnProperty(w)) {
            // @ts-ignore
            this.neighbors[[w]].push(v);
            // @ts-ignore
            this.neighbors[[w]] = Object.values(this.neighbors[[w]].reduce((p,c) => (p[JSON.stringify(c)] = c,p),{}));
        }
    }

    printGraph() {
        console.log(this.size);

        for (const property in this.neighbors) {
            // @ts-ignore
            console.log(`${property} ==> ${JSON.stringify(this.neighbors[[property]])}`);
        }
    }
}

export default class TomfoagEngine {
    private ws: GameWebSocket;
    private boardLevel: number;
    private gridLevel: number;
    private hexNumbers: number[];
    private playerWhite: IPlayer;
    private playerBlack: IPlayer;
    private players: [IPlayer, IPlayer];
    private winner: number;
    private validMoves: any[];
    private turn: 0 | 1;
    private board: Graph;
    private glacier: { [key: string]: number; };
    private canMove: boolean;

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;

        this.boardLevel = 4;
        this.gridLevel = this.boardLevel + 1;
        this.hexNumbers = [0, 1];

        for (let i = 1; i < this.gridLevel; i++) {
            this.hexNumbers.push(this.hexNumbers[this.hexNumbers.length - 1] + i * 6);
        }

        // player containes hex coordinates of location and number of ice collected
        this.playerWhite = [0, this.boardLevel - 2, 0];
        this.playerBlack = [0, -1 * (this.boardLevel - 2), 0];
        this.players = [this.playerWhite, this.playerBlack];
        this.winner = -1;
        this.validMoves = [];

        this.turn = 0;  // 0 = white's turn, 1 = black's turn

        this.board = new Graph();
        this.setupBoard(this.gridLevel);

        this.glacier = {};
        this.setupGlacier(this.boardLevel);

        // have to take or place first, then move
        this.canMove = false;

        // this.playGameFromFile(game1);

        console.log(this.glacier);
    }

    setupBoard(level) {
        // clear board graph
        this.board = new Graph();
        let vertices = [[0, 0]];

        // Vertices are denoted by [q, r]; q and r are the hexagon coordinates
        let i = 0;
        while (vertices.length != this.hexNumbers[level]) {
            vertices.push([vertices[i][0], vertices[i][1] - 1]);
            vertices.push([vertices[i][0] + 1, vertices[i][1] - 1]);
            vertices.push([vertices[i][0] + 1, vertices[i][1]]);
            vertices.push([vertices[i][0], vertices[i][1] + 1]);
            vertices.push([vertices[i][0] - 1, vertices[i][1] + 1]);
            vertices.push([vertices[i][0] - 1, vertices[i][1]]);

            // Remove duplicates from vertices array
            // https://stackoverflow.com/questions/57562611/how-to-get-distinct-values-from-an-array-of-arrays-in-javascript-using-the-filte/57562822#57562822
            // @ts-ignore
            vertices = Object.values(vertices.reduce((p,c) => (p[JSON.stringify(c)] = c,p),{}));
            i++;
        }

        // Add vertices to graph
        for (let i = 0; i < vertices.length; i++) {
            this.board.addVertex(vertices[i]);
        }

        // Add edges to graph
        for (let i = 0; i < vertices.length; i++) {
            // this.board.addEdge(coord1, coord2); coord1 = this.vertices[i], coord2 = [this.vertices[i][0] + x, this.vertices[i][1] + y]
            this.board.addEdge(vertices[i], [vertices[i][0], vertices[i][1] - 1]);
            this.board.addEdge(vertices[i], [vertices[i][0] + 1, vertices[i][1] - 1]);
            this.board.addEdge(vertices[i], [vertices[i][0] + 1, vertices[i][1]]);
            this.board.addEdge(vertices[i], [vertices[i][0], vertices[i][1] + 1]);
            this.board.addEdge(vertices[i], [vertices[i][0] - 1, vertices[i][1] + 1]);
            this.board.addEdge(vertices[i], [vertices[i][0] - 1, vertices[i][1]]);
        }
    }

    setupGlacier(level) {
        let i = 0;
        // @ts-ignore
        for (const [key, value] of Object.entries(this.board.neighbors)) {
            if (!(this.glacier.hasOwnProperty(key))) {
                if (i >= this.hexNumbers[level]) {
                    // @ts-ignore
                    this.glacier[[key]] = 0;
                }
                else {
                    // @ts-ignore
                    this.glacier[[key]] = 1;
                }
            }
            i++;
        }
    }

    // check if hex (ordered pair [q, r]) is in array of hexes
    includesHex(arr, hex) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] === hex[0] && arr[i][1] === hex[1]) {
                return true;
            }
        }
        return false
    }

    indexOfHex(arr, hex) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] === hex[0] && arr[i][1] === hex[1]) {
                return i;
            }
        }
        return -1;
    }

    strToArr(str) {
        let arr = str.split(',');
        let ret = [];
        for (let i = 0; i < arr.length; i++) {
            // @ts-ignore
            ret.push(parseInt(arr[i]));
        }
        return ret;
    }

    addLayer() {
        this.gridLevel++;
        this.hexNumbers.push(this.hexNumbers[this.gridLevel - 1] + (this.gridLevel - 1) * 6);

        this.setupBoard(this.gridLevel);
        this.setupGlacier(this.boardLevel);
    }

    // player: list of hex coords and ice collected ==> [q, r]
    // moveType: take, place, or move
    getValidMoves(player: IPlayer, moveType: IMoveType) {
        let playerPos = [player[0], player[1]];

        // @ts-ignore
        let neighbors = this.board.neighbors[[playerPos]];

        if (!this.canMove) {
            if (moveType === 'take') {
                // take ice in a direction that has ice already
                for (let nbr of neighbors) {
                    // @ts-ignore
                    if (JSON.stringify(nbr) !== JSON.stringify([this.players[this.turn ^ 1][0], this.players[this.turn ^ 1][1]]) && this.glacier[[nbr]] > 0) {
                        this.validMoves.push(nbr);
                    }
                }
            }

            else if (moveType === 'place') {
                // player has to have ice to place
                if (player[2] > 0) {
                    // check if location has at least 2 neighboring ice pieces for a valid place
                    for (let nbr of neighbors) {
                        let neighboringIce = 0;
                        if (JSON.stringify(nbr) !== JSON.stringify([this.players[this.turn ^ 1][0], this.players[this.turn ^ 1][1]])) {
                            // @ts-ignore
                            let nbrs2 = this.board.neighbors[[nbr]];
                            if (nbrs2 != undefined) {
                                for (let nbr2 of nbrs2) {
                                    // @ts-ignore
                                    if (this.glacier.hasOwnProperty(nbr2) && this.glacier[[nbr2]] > 0) {
                                        neighboringIce++;
                                    }
                                }
                            }

                            if (neighboringIce > 1) {
                                this.validMoves.push(nbr);
                            }
                        }
                    }
                }
            }
        }

        else {
            // move in a direction that has ice, but no more than 1 more than the stack you are on
            for (let nbr of neighbors) {
                // @ts-ignore
                if (JSON.stringify(nbr) !== JSON.stringify([this.players[this.turn ^ 1][0], this.players[this.turn ^ 1][1]]) && this.glacier.hasOwnProperty(nbr) && this.glacier[[nbr]] > 0 && this.glacier[[nbr]] < this.glacier[[playerPos]] + 2) {
                    this.validMoves.push(nbr);
                }
            }
        }
    }

    // player: list of hex coords and ice collected
    // moveType: take, place, or move
    // dir: direction or index that the player clicked on
    // return if move was valid.
    playMove(player:IPlayer, moveType:IMoveType, dir:[number, number]): [boolean, string] {
        let didSuccess = false;
        let delta = [dir[0] - player[0], dir[1] - player[1]];

        if(delta[0] > 1 || delta[0]<-1 || delta[1] > 1 || delta[1] < -1 ){
            return [false, "hex not adjacent to player"]; // move was too far
        }

        if (!this.canMove) {
            this.getValidMoves(player, moveType);


            if (moveType === 'take') {
                while (this.includesHex(this.validMoves, dir)) {
                    // @ts-ignore
                    this.glacier[[dir]]--;
/* // TODO consider fixing performance, here and graph.
                    // @ts-ignore
                    if(this.glacier[[dir]] < 1){
                        // @ts-ignore
                        delete this.glacier[[dir]];
                    }
*/

                    this.players[this.turn][2]++;
                    this.getValidMoves([dir[0], dir[1], this.players[this.turn][2]], moveType);
                    dir = [dir[0] + delta[0], dir[1] + delta[1]];
                    didSuccess = true;
                }

                if(!didSuccess){
                    return [false, "nothing to take"];
                }

                this.findSeparatedGlaciers(player);
                this.canMove = true;
            }

            else if (moveType === 'place') {
                while (this.includesHex(this.validMoves, dir)) {
                    // @ts-ignore
                    this.glacier[[dir]]++;
                    this.players[this.turn][2]--;
                    this.getValidMoves([dir[0], dir[1], this.players[this.turn][2]], moveType);
                    dir = [dir[0] + delta[0], dir[1] + delta[1]];
                    if (dir[0] + dir[1] > this.gridLevel) {
                        this.addLayer();
                    }
                    didSuccess = true;
                }

                if(!didSuccess){
                    return [false, "Could not place any tiles there"];
                }

                this.canMove = true;
            }
        }
        else {
            // @ts-ignore
            if (this.indexOfHex(this.board.neighbors[[[player[0], player[1]]]], dir) > -1) {

                if((dir[0] == this.players[0][0] && dir[1] == this.players[0][1]) || (dir[0] == this.players[1][0] && dir[1] == this.players[1][1])){
                    return [false, "cannot move into tile with other player."]
                }

                // @ts-ignore
                if(this.glacier[dir] == null || this.glacier[dir] < 1){
                    return [false, "cannot move into tile with no ice."]
                }

                this.players[this.turn][0] = dir[0];
                this.players[this.turn][1] = dir[1];
                this.turn ^= 1;
                this.canMove = false;
            }
        }
        this.validMoves = [];
        return [true, "success"];
    }

    dfs(hex, visited, glacier) {
        visited.push(hex);
        glacier.push(hex);
        // console.log(visited);

        let end = false;

        // @ts-ignore
        for (let nbr of this.board.neighbors[[hex]]) {
            // @ts-ignore
            if (this.indexOfHex(visited, nbr) !== -1 && this.glacier[[nbr]] === 0) {
                end = true;
            }
            else {
                end = false;
            }
        }

        if (end) {
            return glacier;
        }

        // @ts-ignore
        for (let nbr of this.board.neighbors[[hex]]) {
            // @ts-ignore
            if (this.indexOfHex(visited, nbr) === -1 && this.glacier[[nbr]] > 0) {
                this.dfs(nbr, visited, glacier);
            }
        }
    }

    findSeparatedGlaciers(player) {
        let visited = [];
        let glacier_1 = [];
        let glacier_2 = [];

        // DFS from player positions to find what glaciers they are on
        this.dfs([player[0], player[1]], visited, glacier_1);
        for (let key in this.glacier) {
            // @ts-ignore
            key = this.strToArr(key);
            // @ts-ignore
            if (this.indexOfHex(glacier_1, key) === -1 && this.glacier[[key]] > 0) {
                // @ts-ignore
                glacier_2.push(key);
            }
        }

        let playerIndex = this.indexOfHex(this.players, player);

        // check if current player wins by surface area
        if (this.indexOfHex(glacier_2, [this.players[playerIndex ^ 1][0], this.players[playerIndex ^ 1][1]]) > -1 && glacier_1.length > glacier_2.length) {
            this.winner = playerIndex;

            if (this.winner === 0) {
                console.log("White wins [surface area]! " + glacier_1.length + " to " + glacier_2.length);
            }
            else if (this.winner === 1){
                console.log("Black wins [surface area]! " + glacier_1.length + " to " + glacier_2.length);
            }
        }

        // check if opponent wins by surface area
        else if (this.indexOfHex(glacier_2, [this.players[playerIndex ^ 1][0], this.players[playerIndex ^ 1][1]]) > -1 && glacier_1.length < glacier_2.length) {
            this.winner = playerIndex ^ 1;

            if (this.winner === 0) {
                console.log("White wins [surface area]! " + glacier_1.length + " to " + glacier_2.length);
            }
            else if (this.winner === 1){
                console.log("Black wins [surface area]! " + glacier_1.length + " to " + glacier_2.length);
            }
        }

        // equal surface area glaciers
        else if (this.indexOfHex(glacier_2, [this.players[playerIndex ^ 1][0], this.players[playerIndex ^ 1][1]]) > -1 && glacier_1.length === glacier_2.length) {
            let volume_1 = 0;
            let volume_2 = 0;
            for (let ice of glacier_1) {
                // @ts-ignore
                volume_1 += this.glacier[[ice]];
            }
            for (let ice of glacier_2) {
                // @ts-ignore
                volume_2 += this.glacier[[ice]];
            }

            // check if current player wins by volume
            if (volume_1 > volume_2) {
                this.winner = playerIndex;

                if (this.winner === 0) {
                    console.log("White wins [volume]! " + volume_1 + " to " + volume_2);
                }
                else if (this.winner === 1){
                    console.log("Black wins [volume]! " + volume_1 + " to " + volume_2);
                }
            }

            // check if opponent wins by volume
            else if (volume_2 > volume_1) {
                this.winner = playerIndex ^ 1;

                if (this.winner === 0) {
                    console.log("White wins [volume]! " + volume_1 + " to " + volume_2);
                }
                else if (this.winner === 1){
                    console.log("Black wins [volume]! " + volume_1 + " to " + volume_2);
                }
            }

            // equal volume glaciers
            else {
                // check if current player wins by ice collection
                if (this.players[playerIndex][2] > this.players[playerIndex ^ 1][2]) {
                    this.winner = playerIndex;

                    if (this.winner === 0) {
                        console.log("White wins [ice collection]! " + this.players[0][2] + " to " + this.players[1][2]);
                    }
                    else if (this.winner === 1){
                        console.log("Black wins [ice collection]! " + this.players[1][2] + " to " + this.players[0][2]);
                    }
                }
                else if (this.players[playerIndex][2] < this.players[playerIndex ^ 1][2]) {
                    this.winner = playerIndex ^ 1;

                    if (this.winner === 0) {
                        console.log("White wins [ice collection]! " + this.players[0][2] + " to " + this.players[1][2]);
                    }
                    else if (this.winner === 1){
                        console.log("Black wins [ice collection]! " + this.players[1][2] + " to " + this.players[0][2]);
                    }
                }
            }
        }

        // if both players are on the same final glacier, give the lost part to the current player
        else {
            for (let ice of glacier_2) {
                // @ts-ignore
                player[2] += this.glacier[[ice]];
                // @ts-ignore
                this.glacier[[ice]] = 0;
            }
        }

        // return {
        //     glacier_1: glacier_1,
        //     glacier_2: glacier_2
        // };
    }

    playGameFromFile(moves) {
        for (let move of moves) {
            let tpm = move.split('m');
            let dir = parseInt(tpm[0][1]) % 6;

            if (tpm[0][0] === 'T') {
                this.playMove(this.players[this.turn], 'take', [this.players[this.turn][0] + dirMap[dir][0], this.players[this.turn][1] + dirMap[dir][1]]);
            }
            else if (tpm[0][0] === 'P') {
                this.playMove(this.players[this.turn], 'place', [this.players[this.turn][0] + dirMap[dir][0], this.players[this.turn][1] + dirMap[dir][1]]);
            }

            let mov = parseInt(tpm[1][0]) % 6;
            this.playMove(this.players[this.turn], 'move', [this.players[this.turn][0] + dirMap[mov][0], this.players[this.turn][1] + dirMap[mov][1]]);
        }
    }

    getBoardState() : BoardState {
        return {
            board: this.board,
            glacier: this.glacier,
            players: this.players,
            validMoves: this.validMoves,
            turn: this.turn,
            canMove: this.canMove,
            winner: this.winner,
        };
    }
}
