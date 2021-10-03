import Card from 'Games/fashionCents/Card';

export default class Stack {

    constructor() {
        this.name = "";
        this.cards = [];
    }

    isCardInStack(cardToSearchFor) {
       return this.cards.some(card=>card.equals(cardToSearchFor));
    }

    isAnyCardInStack(cardsToSearchFor){
        for (const cardToSearchFor of cardsToSearchFor){
            if(this.isCardInStack(cardToSearchFor)){
                return true;
            }
        }
        return false;
    }

    static fromJson(jsonStack) {
        const newStack = new Stack();
        newStack.name = jsonStack.name;
        newStack.cards = jsonStack?.cards.map(card=>Card.fromJson(card));
        return newStack;
    }
}