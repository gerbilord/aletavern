import Players from './IbPlayers';
import LobbyRound from './IbHostRoundLogic/IbHostLobbyRoundEngine';
import PromptPlayerRound from './IbHostRoundLogic/IbHostAskPlayerQuestionRoundEngine'; // TODO remove after testing

export default class GameEngine {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.players = new Players(this.ws);
        this.rounds = [
            new LobbyRound(this.ws, this.players),
            new PromptPlayerRound(
                this.ws,
                this.players,
                ['PROMPT 1', 'PROMPT 2'],
                1,
                20000
            ),
        ]; //, 'selfAnswerOtherGuess', 'leaderboard'];

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
