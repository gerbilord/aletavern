import Players from './IbPlayers';
import LobbyRound from './IbHostRoundLogic/IbHostLobbyRoundEngine';

export default class GameEngine {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.players = new Players(this.ws);
        this.rounds = [new LobbyRound(this.ws, this.players)]; //, 'selfAnswerOtherGuess', 'leaderboard'];

        this.currentRound = null;

        this.runGameLoop();
    }

    async runGameLoop() {
        for (let i = 0; i < this.rounds.length; i++) {
            this.currentRound = this.rounds[i];
            console.log('STARTING');
            await this.currentRound;
            console.log('ENDING');
            this.currentRound = null;
        }
    }

    getViewData() {
        return this.currentRound?.getViewData();
    }
}
