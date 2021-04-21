import CONSTANTS from '../../Constants';
import prompts from './textPromts';
import 'babel-polyfill';
import Players from './Players';
import LobbyRound from './Rounds/LobbyRound';

export default class GameEngine {

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.players = new Players(this.ws);
        this.rounds = [new LobbyRound(this.ws, this.players)]; //, 'selfAnswerOtherGuess', 'leaderboard'];

        this.runGameLoop();
    }

    async runGameLoop() {
        for (let i = 0; i < this.rounds.length; i++) {
            const currentRound = this.rounds[i];
            console.log("STARTING");
            await currentRound;
            console.log("ENDING");
        }
    }
}
