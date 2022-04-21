export default class TextPrompt {
    private prompt: string;
    private answer: string;

    constructor() {
        this.prompt = "";
        this.answer = "";
    }

    // Static method that creates a new TextPrompt object from a json object.
    static fromJson(json: any): TextPrompt {
        let textPrompt = new TextPrompt();
        textPrompt.prompt = json.prompt;
        textPrompt.answer = json.answer;
        return textPrompt;
    }
}