export default class MultipleChoicePrompt {
    public prompt: string;
    public choices: string[];
    public answer: string;

    constructor() {
        this.prompt = "";
        this.choices = [];
        this.answer = ""; // String matching the choice selected.
    }

    public fromJson(jsonPrompt): MultipleChoicePrompt {
        let mcP = new MultipleChoicePrompt();
        mcP.prompt = jsonPrompt.prompt;
        mcP.choices = jsonPrompt.choices;
        mcP.answer = jsonPrompt.answer;
        return mcP;
    }

}
