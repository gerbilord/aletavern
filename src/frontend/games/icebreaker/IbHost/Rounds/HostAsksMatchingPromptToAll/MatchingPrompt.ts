export default class MatchingPrompt {
    public mainPrompt: string
    public categories: string[];
    public matchables: string[];
    public answer: {};

    constructor() {
        this.mainPrompt = "";
        this.categories = [];
        this.matchables = [];
        this.answer = {}; // Map of category -> matchable
    }

    public static fromJson(jsonPrompt): MatchingPrompt{
        let mP = new MatchingPrompt();

        mP.mainPrompt = jsonPrompt.mainPrompt;
        mP.categories = jsonPrompt.categories;
        mP.matchables = jsonPrompt.matchables;
        mP.answer = jsonPrompt.answer;

        return mP;
    }
}
