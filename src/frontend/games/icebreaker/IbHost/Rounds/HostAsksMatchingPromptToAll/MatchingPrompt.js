export default class MatchingPrompt {
    constructor() {
        this.mainPrompt = "";
        this.categories = [];
        this.matchables = [];
        this.answer = {}; // Map of category -> matchable
    }
}
