export default class RankPrompt {
    constructor() {
        this.mainPrompt = "";
        this.topText = "";
        this.bottomText = "";
        this.choices = [];
        this.answer = []; // Choices in order of rank.
    }
}