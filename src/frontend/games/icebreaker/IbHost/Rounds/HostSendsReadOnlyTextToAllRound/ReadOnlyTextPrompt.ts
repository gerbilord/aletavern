export default class ReadOnlyTextPrompt {
    private prompt: string;

    constructor() {
        this.prompt = "";
    }

    // Static method that creates a new ReadOnlyTextPrompt object from a json object.
    static fromJson(json: any): ReadOnlyTextPrompt {
        let readOnlyTextPrompt = new ReadOnlyTextPrompt();
        readOnlyTextPrompt.prompt = json.prompt;
        return readOnlyTextPrompt;
    }
}