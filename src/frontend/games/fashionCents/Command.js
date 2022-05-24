import Card from 'Games/fashionCents/Card';

export default class Command {
    constructor() {
        this.type = "";
        this.fromStack = "";
        this.toStack = "";
        this.extraData = {};
        this.selectedCards  = [];
    }

    toString(){
        return this.type + " " + this.cardsToString() + "from: " + this.fromStack +", to: " + this.toStack;
    }

    cardsToString(){
        let cardList = "";
        this.selectedCards.forEach(card=>cardList = cardList + card.toString() + ", ")
        return cardList;
    }

    static fromJson(jsonCommand) {
        const newCommand = new Command();
        newCommand.type = jsonCommand?.type;
        newCommand.fromStack = jsonCommand?.fromStack;
        newCommand.toStack = jsonCommand?.toStack;
        newCommand.extraData = jsonCommand?.extraData;
        newCommand.selectedCards  = jsonCommand?.selectedCards == null ? []: jsonCommand.selectedCards.map(jsonCard=>Card.fromJson(jsonCard));
        return newCommand;
    }
}