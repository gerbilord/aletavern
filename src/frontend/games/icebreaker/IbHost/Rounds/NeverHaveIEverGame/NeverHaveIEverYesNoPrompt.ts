import MultipleChoicePrompt from 'Icebreaker/IbHost/Rounds/HostAsksMultipleChoicePromptToAllRound/MultipleChoicePrompt';

export class NeverHaveIEverYesNoPrompt extends MultipleChoicePrompt {
    public playerId: string;

    constructor() {
        super();
        this.playerId = "";
    }

    // create NeverHaveIEverYesNoPrompt from Json and call super with it
    public static fromJson(json: any): NeverHaveIEverYesNoPrompt {
        let prompt = new NeverHaveIEverYesNoPrompt();
        prompt.playerId = json.playerId;
        return super.fromJsonChild(json, prompt);
    }
}