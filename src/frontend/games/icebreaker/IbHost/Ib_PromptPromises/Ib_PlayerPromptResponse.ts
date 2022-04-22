export default class Ib_PlayerPromptResponse<PromptDataClass> {

    playerId: string;
    promptType: string; // CONSTANTS.PROMPT_TYPE.promptType
    promptData: PromptDataClass;

    constructor() {
    }

}