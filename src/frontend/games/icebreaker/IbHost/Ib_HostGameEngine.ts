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
import NeverHaveIEverGame from 'Icebreaker/IbHost/Rounds/NeverHaveIEverGame/NeverHaveIEverGame';
import GameWebSocket from 'Frontend/GameWebSocket';
import icebreakerViewData from 'Icebreaker/IbShared/IbSharedViewData';

export default class GameEngine {
    ws: GameWebSocket;
    private players: Players;
    private rounds: any[]; // TODO Make interface playRound, fix then statements?
    private currentRound: any; // TODO Make interface playRound

    constructor(gameWebSocket) {
        this.ws = gameWebSocket;
        this.players = new Players(this.ws);
        this.rounds = [
            new LobbyRound(this.ws, this.players),
            // new HostSendsReadOnlyTextToAll(this.ws, t his.players),
            // new HostAsksMatchingPromptToAll(this.ws, this.players),
            // new HostAsksMultipleChoicePromptToAll(this.ws, this.players),
            // new HostAsksRankPromptToAll(this.ws, this.players),
            // new HostAsksTextPromptToAll(this.ws, this.players)
            new NeverHaveIEverGame(this.ws, this.players)
        ];

        this.currentRound = null;

        this.runGameLoop();
    }

    async runGameLoop():Promise<void> {
        for (let i = 0; i < this.rounds.length; i++) {
            this.currentRound = this.rounds[i];
            console.log('STARTING');
            await this.currentRound;
            console.log('ENDING');
            this.currentRound = null;
        }
    }

    getViewData():icebreakerViewData {
        return this.currentRound?.getViewData();
    }
}
