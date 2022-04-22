import CONSTANTS from 'Icebreaker/IbConstants';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import Ib_GetSamePromptAllPlayers from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetSamePromptAllPlayers';
import ReadOnlyTextPrompt from 'Icebreaker/IbHost/Rounds/HostSendsReadOnlyTextToAllRound/ReadOnlyTextPrompt';
import GameWebSocket from 'Frontend/GameWebSocket';
import Players from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Players';

// noinspection JSUnusedGlobalSymbols

export default class HostSendsReadOnlyTextToAllRound {
    private hostWs: GameWebSocket;
    private players: Players;
    private promptData: ReadOnlyTextPrompt;
    private timeLimit: number;
    private isRoundActive: boolean;
    private endRound: () => void;
    private promptPromise: Ib_GetSamePromptAllPlayers;

    constructor(hostWs: GameWebSocket, players: Players) {
        this.hostWs = hostWs;
        this.players = players;

        this.promptData = new ReadOnlyTextPrompt();
        this.timeLimit  = 0;
        this.isRoundActive = false;
        this.getViewData = this.getViewData.bind(this);
    }

    // play round
    async then(endRound): Promise<void> {
        this.endRound = endRound;
    }

    setPrompt(newPrompt:string): void {
        this.promptData.prompt = newPrompt;
    }

    async sendPrompt():Promise<void> {
        if(!this.isRoundActive){
            this.isRoundActive = true;
            let timeout;
            if(this.timeLimit) { timeout = setTimeout(this.sendEndRound.bind(this), this.timeLimit);}
            this.promptPromise = new Ib_GetSamePromptAllPlayers(this.hostWs, this.players,
                CONSTANTS.PROMPT_TYPE.READ_ONLY_TEXT, this.promptData, this.timeLimit ? this.timeLimit + 1500 : 0,
                []);
            await Promise.all([this.promptPromise]); // TODO change to get() or play() instead of inferred awaitable
            if(this.timeLimit){clearTimeout(timeout);}
            this.sendEndRound();
        }
    }

    sendEndRound(): void {
        if(this.isRoundActive){
            this.players.sendMessageToAllPlayers(this.createEndRoundMessage());
            this.isRoundActive = false;
        }
    }

    forceEnd(): void {
        this.sendEndRound();
        setTimeout(()=>this.promptPromise.forceEnd(), 1500);
    }

    createEndRoundMessage(): {[CONSTANTS.MESSAGE_TYPE_KEY]: string[], [CONSTANTS.ROUND_KEY]: string[], data: any} {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    setTimeLimit(newTimeLimit : any): void {

        let intLimit: number = 0;

        try {
            intLimit = parseInt(newTimeLimit, 10);
        } catch (e){
            console.log("Time limit is not a number");
        }

        this.timeLimit = (intLimit * 1000);

    }

    getViewData():ViewData {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.HOST_SENDS_READ_ONLY_TEXT_TO_ALL);
        viewData.setExtraData(this);
        return viewData;
    }
}
