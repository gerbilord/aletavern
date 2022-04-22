import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import PlayerPromptResponse from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_PlayerPromptResponse';
import Ib_PlayerPromptResponse from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_PlayerPromptResponse';
import GameWebSocket from 'Frontend/GameWebSocket';

export default class Ib_GetPlayerPromptPromise {
    private hostWs: GameWebSocket;
    playerId: string;
    private promptType: string;
    promptData: any;
    private timeLimit: number;
    private playerPromptResponse: Ib_PlayerPromptResponse<any>;
    private isResolved: boolean;
    private functionsToRunOnResolve: { (payload: {}): void; }[];
    private cleanUpFunctions: { (): void; }[];
    private resolve: { (payload: {}): void; };

    constructor(hostWs: GameWebSocket, playerId: string, promptType: string, promptData:any, timeLimit:number, functionsToRunOnResolve:{ (payload: {}): void; }[]) {
        this.hostWs = hostWs;
        this.playerId = playerId;
        this.promptType = promptType;
        this.promptData = promptData;
        this.timeLimit = timeLimit;
        this.playerPromptResponse = new PlayerPromptResponse();
        this.playerPromptResponse.playerId = playerId;
        this.playerPromptResponse.promptType = promptType;
        this.isResolved = false;
        this.functionsToRunOnResolve = functionsToRunOnResolve || [];

        this.forceEnd = this.forceEnd.bind(this);

        this.cleanUpFunctions = []; // run before ending promise
        this.cleanUpFunctions.push(()=>{this.isResolved = true});
    }

    // Resolves into a Ib_PlayerPromptResponse.js
    async then(resolve: { (resolveValue: {}): void; }): Promise<void> {
        this.resolve = resolve;

        this.listenForPlayerAnswer();
        this.sendPlayerPrompt();
        this.startEndTimer();
    }

    startEndTimer(): void {
        if(this.timeLimit){
            const timeOut = setTimeout(()=>{this.cleanUpAndEndRound()}, this.timeLimit);
            this.cleanUpFunctions.push(()=>{clearTimeout(timeOut)});
        }
    }

    listenForPlayerAnswer(): void {
        const updatePlayerAnswer = (msgObj) => {
            const message = new MessageObject(msgObj);
            if (
                message.getSpecificRound() ===
                CONSTANTS.ROUNDS.PROMPT &&
                message.getMainMessageType() ===
                CONSTANTS.MESSAGE_TYPE.ROUND_INSTRUCTIONS &&
                message.getSender() === this.playerId
            ) {
                this.playerPromptResponse.promptData = message.getData(); // Update player response.
                this.cleanUpAndEndRound();
            }
        };

        this.addObjectToListAndCleanUp(
            this.hostWs.onMessageGame,
            updatePlayerAnswer
        );
    }

    sendPlayerPrompt(): void {
        const promptMessage = this.createStartRoundMessage(this.promptData);
        this.hostWs.sendMessageToOne(this.playerId, promptMessage);
    }

    addObjectToListAndCleanUp(objectList, object): void {
        this.cleanUpFunctions.push(
            ListUtils.createRemoveItemCallback(objectList, object)
        );
        objectList.push(object);
    }

    cleanUpAndEndRound(): void {
        if(!this.isResolved){
            this.cleanUpFunctions.forEach((func) => func());
            this.functionsToRunOnResolve.forEach((func) => func(this.playerPromptResponse));
            this.resolve(this.playerPromptResponse); // (resolve promise)
        }
    }

    createStartRoundMessage(question): {[CONSTANTS.MESSAGE_TYPE_KEY]: string[], [CONSTANTS.ROUND_KEY]: string[], data: any} {
        const promptMessage = new MessageObject();
        promptMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        promptMessage.addRound(this.promptType);
        promptMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.START_ROUND);
        promptMessage.setData(question);
        return promptMessage.getMessage();
    }

    forceEnd(): void {
        this.cleanUpAndEndRound();
    }

}
