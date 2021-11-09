import Players from './IbPlayers';
import LobbyRound from './IbHostLobbyRoundEngine';
import HostAsksTextPromptToAll from './Rounds/HostAsksTextPromptToAll'
import SelfAnswerOtherGuessRound from './IbHostSelfAnswerOtherGuessRoundEngine'

export default class GameEngine { // TODO consider abstracting to multi-round engine that takes in rounds
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.players = new Players(this.ws);
        this.rounds = [
            new LobbyRound(this.ws, this.players),
            new HostAsksTextPromptToAll(this.ws, this.players),
            // new SelfAnswerOtherGuessRound(
            //     this.ws,
            //     this.players,
            //     ['PROMPT 1', 'PROMPT 2'], // TODO calculate prompts randomly
            // ),
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
