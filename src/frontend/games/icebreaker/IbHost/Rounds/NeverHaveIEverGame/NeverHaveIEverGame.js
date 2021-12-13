import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import GetPlayerPromptPromise from 'Icebreaker/IbHost/Ib_PromptPromises/Ib_GetPlayerPromptPromise';
import TextPrompt from 'Icebreaker/IbHost/Rounds/HostAsksTextPromptToAllRound/TextPrompt';
import MultipleChoicePrompt from 'Icebreaker/IbHost/Rounds/HostAsksMultipleChoicePromptToAllRound/MultipleChoicePrompt';
import ReadOnlyTextPrompt from 'Icebreaker/IbHost/Rounds/HostSendsReadOnlyTextToAllRound/ReadOnlyTextPrompt';

// noinspection JSUnusedGlobalSymbols

export default class NeverHaveIEverGame {
    constructor(hostWs, players) {
        this.hostWs = hostWs;
        this.playersData = players;

        this.timeLimit  = null;
        this.playerAnswers = [];
        this.getViewData = this.getViewData.bind(this);

        this.cleanUpFunctions = []; // run before ending round.
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;

        await this.sendPromptsToAll();
        this.sendEndRound();
        await this.sendScoresToAll();
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

        const playerScorePromises = [];

        for(let i = 0; i < this.playersData.length; i++){
            const playerId = this.playersData.players[i].id;
            const playerScore = playerScores[playerId];

            const scoreMessage = "You scored " + playerScore + "/" + maxScore + " points.";
            const scorePrompt = new ReadOnlyTextPrompt();
            scorePrompt.prompt = scoreMessage;

            playerScorePromises.push(new GetPlayerPromptPromise(this.hostWs, playerId,
                CONSTANTS.PROMPT_TYPE.READ_ONLY_TEXT, scorePrompt, this.timeLimit ? this.timeLimit + 1500 : null,
                []));
        }

        await Promise.all(playerScorePromises);
    }
    async sendPromptsToAll() {

        const createNeverHaveIEverPrompt = (playerName, playerId)=>{
            const newPrompt = new MultipleChoicePrompt();
            if(playerName === "you"){
                newPrompt.prompt = "Have " + playerName + " ever had a crush on someone in the workplace?";
            } else {
                newPrompt.prompt = "Has " + playerName + " ever had a crush on someone in the workplace?";
            }
            newPrompt.choices = ["Yes", "No"];
            newPrompt.playerId = playerId;

            return newPrompt;
        }

        const allPlayerAnswerPromises = [];

        for(let i = 0; i < this.playersData.players.length; i++) {
            const player = this.playersData.players[i];
            const playerId = player.id;
            const playerName = player.name;
            const playerWs = player.ws;

            const promptsForPlayer = [];
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

    async sendPrompt(playerPromptData, playerIdToSendTo) {
        return new GetPlayerPromptPromise(this.hostWs, playerIdToSendTo,
            CONSTANTS.PROMPT_TYPE.MULTIPLE_CHOICE, playerPromptData, this.timeLimit ? this.timeLimit + 1500 : null,
            []);
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
