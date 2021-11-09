import CONSTANTS from 'Icebreaker/IbConstants';
import * as ListUtils from 'Utils/listUtils';
import MessageObject from 'Icebreaker/IbShared/IbMessage';
import ViewData from 'Icebreaker/IbShared/IbSharedViewData';
import PlayerPromptResponse from 'Icebreaker/IbHost/Prompts/PlayerPromptResponse';
import GetPlayerPromptPromise from 'Icebreaker/IbHost/Prompts/GetPlayerPromptPromise';

// noinspection JSUnusedGlobalSymbols

export default class GetSamePromptAllPlayers {
    constructor(hostWs, players, promptType, promptData, timeLimit) {
        this.hostWs = hostWs;
        this.players = players;
        this.playerAnswers = [];
        this.promptType = promptType;
        this.promptData = promptData;
        this.timeLimit = timeLimit;
    }

    ask() {
        let playerPromptPromises = this.players.players.map((player)=> new GetPlayerPromptPromise(this.hostWs, player.id, this.promptType, this.promptData, this.timeLimit));
        return Promise.all(playerPromptPromises);
    }
}
