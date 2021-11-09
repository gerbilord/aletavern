import CONSTANTS from 'Icebreaker/IbConstants';
import PromptPlayerRound from 'Icebreaker/IbHost/IbHostAskPlayerQuestionRoundEngine';
import QuizPlayerRound from 'Icebreaker/IbHost/IbHostQuizPlayersRoundEngine';

export default class SelfAnswerOtherGuessEngine { // TODO consider abstracting to multi-round engine that takes in rounds
    constructor(gameWebSocket, players, prompts) {
        this.hostWs = gameWebSocket;
        this.players = players;
        this.prompts = prompts;
    }

    async then(endRound) {

        const promptRound = new PromptPlayerRound(this.hostWs, this.players, this.prompts, 1, CONSTANTS.TIME.TO_ANSWER_PROMPT); // TODO calculate group size
        this.currentRound = promptRound;
        const playerAnswers = await promptRound;

        console.log(playerAnswers);

        const quizRound = new QuizPlayerRound(this.hostWs, this.players, playerAnswers, CONSTANTS.TIME.TO_ANSWER_QUIZ);
        this.currentRound = quizRound;
        await quizRound;

        endRound();
    }

    getViewData() {
        return this.currentRound?.getViewData();
    }
}
