import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbSharedGameLogic/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViews/IbSharedViewData';



// noinspection JSUnusedGlobalSymbols

export default class AskPlayerQuizQuestionRound {
    constructor(hostWs, players, playerPromptAnswers, timeToAnswer) {
        this.hostWs = hostWs;
        this.players = players;
        this.playersYetToAnswer = [...players.players];
        this.playerQuizAnswers = [];

        this.timeToAnswer = timeToAnswer;
        this.timeLeft = timeToAnswer;

        this.cleanUpFunctions = []; // run before ending round.
    }

    // play round
    async then(endRound) {
        this.endRound = endRound;
        // for each group of answers, await ask quiz question, update score // TODO Implement this

    }

    async cleanUpAndEndRound() {
        this.cleanUpFunctions.forEach((func) => func()); // Remove all listeners created in this round.
        this.endRound(); // End the round. (resolve promise)
    }

    getViewData() {
        return this.currentRound?.getViewData();
    }
}
