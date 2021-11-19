import Players from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Players';
import LobbyRound from 'Icebreaker/IbHost/Rounds/LobbyRound/IbHostLobbyRoundEngine';
import HostAsksTextPromptToAll from 'Icebreaker/IbHost/Rounds/HostAsksTextPromptToAllRound/HostAsksTextPromptToAll'
import HostAsksRankPromptToAll from 'Icebreaker/IbHost/Rounds/HostAsksRankPromptToAllRound/HostAsksRankPromptToAll';
import HostAsksMultipleChoicePromptToAll
    from 'Icebreaker/IbHost/Rounds/HostAsksMultipleChoicePromptToAllRound/HostAsksMultipleChoicePromptToAll';
import HostAsksMatchingPromptToAll
    from 'Icebreaker/IbHost/Rounds/HostAsksMatchingPromptToAll/HostAsksMatchingPromptToAll';
import HostSendsReadOnlyTextToAll
    from 'Icebreaker/IbHost/Rounds/HostSendsReadOnlyTextToAllRound/HostSendsReadOnlyTextToAll';

export default class GameEngine {
    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.players = new Players(this.ws);
        this.rounds = [
            new LobbyRound(this.ws, this.players),
            // new HostSendsReadOnlyTextToAll(this.ws, this.players),
            // new HostAsksMatchingPromptToAll(this.ws, this.players),
            // new HostAsksMultipleChoicePromptToAll(this.ws, this.players),
            // new HostAsksRankPromptToAll(this.ws, this.players),
            new HostAsksTextPromptToAll(this.ws, this.players),
        ];

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
