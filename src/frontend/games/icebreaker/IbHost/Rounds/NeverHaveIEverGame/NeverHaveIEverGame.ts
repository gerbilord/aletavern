import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import GetPlayerPromptPromise from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetPlayerPromptPromise';
import TextPrompt from 'Icebreaker/IbHost/Rounds/HostAsksTextPromptToAllRound/TextPrompt';
import MultipleChoicePrompt from 'Icebreaker/IbHost/Rounds/HostAsksMultipleChoicePromptToAllRound/MultipleChoicePrompt';
import ReadOnlyTextPrompt from 'Icebreaker/IbHost/Rounds/HostSendsReadOnlyTextToAllRound/ReadOnlyTextPrompt';
import GameWebSocket from 'Frontend/GameWebSocket';
import Players from 'Icebreaker/IbHost/Ib_HelperClasses/Ib_Players';
import Ib_GetPlayerPromptPromise from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetPlayerPromptPromise';
import { NeverHaveIEverYesNoPrompt } from 'Icebreaker/IbHost/Rounds/NeverHaveIEverGame/NeverHaveIEverYesNoPrompt';

// noinspection JSUnusedGlobalSymbols

export default class NeverHaveIEverGame {
    private hostWs: GameWebSocket;
    playersData: Players;
    private timeLimit: number;
    private playerAnswers: any[];
    private endRound: { ():void };

    constructor(hostWs: GameWebSocket, players: Players) {
        this.hostWs = hostWs;
        this.playersData = players;

        this.timeLimit  = 0;
        this.playerAnswers = [];
        this.getViewData = this.getViewData.bind(this);
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        await this.sendPromptsToAll();
        this.sendEndRound();
        await this.sendScoresToAll();

        this.endRound();
    }

    async sendScoresToAll(){
        const answerKey = {};

        for (let i = 0; i < this.playerAnswers.length; i++) {
            const playerId = this.playerAnswers[i].playerId;
            const playerSelfAnswerData = this.playerAnswers.filter(answer => answer.playerId === playerId)[0].promptData[0];

            answerKey[playerId] = playerSelfAnswerData.answer;
        }

        const maxScore = this.playersData.length - 1;
        const playerScores = {};

        for (let i = 0; i < this.playersData.length; i++) {
            const playerId = this.playersData.players[i].id;

            let currentScore = 0;

            const playerAnswers = this.playerAnswers.filter(answer => answer.playerId === playerId)[0];
            const answersOnOtherPlayers = playerAnswers.promptData.filter(promptData => promptData.playerId !== playerId);


            for (let j = 0; j < answersOnOtherPlayers.length; j++) {
                const specificPlayerAnswer = answersOnOtherPlayers[j];
                const answer = specificPlayerAnswer.answer;

                if (answer === answerKey[specificPlayerAnswer.playerId]) {
                    currentScore++;
                }
            }
            playerScores[playerId] = currentScore;
        }

        const playerScorePromises: Ib_GetPlayerPromptPromise[] = [];

        for(let i = 0; i < this.playersData.length; i++){
            const playerId = this.playersData.players[i].id;
            const playerScore = playerScores[playerId];

            const scoreMessage = "You scored " + playerScore + "/" + maxScore + " points.";
            const scorePrompt = new ReadOnlyTextPrompt();
            scorePrompt.prompt = scoreMessage;

            playerScorePromises.push(new GetPlayerPromptPromise(this.hostWs, playerId,
                CONSTANTS.PROMPT_TYPE.READ_ONLY_TEXT, scorePrompt, this.timeLimit ? this.timeLimit + 1500 : 0,
                []));
        }

        await Promise.all(playerScorePromises);
    }
    async sendPromptsToAll() {

        const createNeverHaveIEverPrompt = (playerName, playerId)=>{
            const newPrompt = new NeverHaveIEverYesNoPrompt();
            if(playerName === "you"){
                newPrompt.prompt = "Have " + playerName + " ever had a crush on someone in the workplace?";
            } else {
                newPrompt.prompt = "Has " + playerName + " ever had a crush on someone in the workplace?";
            }
            newPrompt.choices = ["Yes", "No"];
            newPrompt.playerId = playerId;

            return newPrompt;
        }

        const allPlayerAnswerPromises: Promise<GetPlayerPromptPromise>[] = [];

        for(let i = 0; i < this.playersData.players.length; i++) {
            const player = this.playersData.players[i];
            const playerId = player.id;

            const promptsForPlayer: NeverHaveIEverYesNoPrompt[] = [];
            promptsForPlayer.push(createNeverHaveIEverPrompt("you", playerId));

            for(let j = 0; j < this.playersData.players.length; j++) {
                if(i !== j) {
                    const otherPlayer = this.playersData.players[j];
                    const otherPlayerId = otherPlayer.id;
                    const otherPlayerName = otherPlayer.name;
                    promptsForPlayer.push(createNeverHaveIEverPrompt(otherPlayerName, otherPlayerId));
                }
            }
            allPlayerAnswerPromises.push(this.sendPrompt(promptsForPlayer, playerId))
        }

        const allPlayerAnswers = await Promise.all(allPlayerAnswerPromises);

        console.log(allPlayerAnswers)
        this.playerAnswers = allPlayerAnswers;
    }

    async sendPrompt(playerPromptData, playerIdToSendTo): Promise<GetPlayerPromptPromise> {
        const getPlayerPromptPromise = new GetPlayerPromptPromise(this.hostWs, playerIdToSendTo,
            CONSTANTS.PROMPT_TYPE.MULTIPLE_CHOICE, playerPromptData, this.timeLimit ? this.timeLimit + 1500 : 0,
            []);
        return getPlayerPromptPromise;
    }

    sendEndRound() {
        this.playersData.sendMessageToAllPlayers(this.createEndRoundMessage());
    }

    createEndRoundMessage() {
        const endRoundMessage = new MessageObject();
        endRoundMessage.addRound(CONSTANTS.ROUNDS.PROMPT);
        endRoundMessage.addMessageType(CONSTANTS.MESSAGE_TYPE.END_ROUND);
        return endRoundMessage.getMessage();
    }

    getViewData() {
        const viewData = new ViewData();
        viewData.addViewType(CONSTANTS.ROUNDS.HOST_NEVER_HAVE_I_EVER_GAME);
        viewData.setExtraData(this);
        return viewData;
    }
}
