export default class RankPrompt {
    private mainPrompt: string;
    private topText: string;
    private bottomText: string;
    private choices: string[];
    private answer: string[];

    constructor() {
        this.mainPrompt = "";
        this.topText = "";
        this.bottomText = "";
        this.choices = [];
        this.answer = []; // Choices in order of rank.
    }

    // Static method that creates a new RankPrompt object from a json object.
    public static fromJson(json: any): RankPrompt {
        let rankPrompt = new RankPrompt();
        rankPrompt.mainPrompt = json.mainPrompt;
        rankPrompt.topText = json.topText;
        rankPrompt.bottomText = json.bottomText;
        rankPrompt.choices = json.choices;
        rankPrompt.answer = json.answer;
        return rankPrompt;
    }

}