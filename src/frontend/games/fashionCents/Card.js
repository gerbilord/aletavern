export default class Card {

    constructor(id, url) {
        this.id = id;
        this.url = url;
    }

    toString(){
        return "id: " + this.id + ", url: " + this.url;
    }

    equals(otherCard){
        return (
            this.id === otherCard.id &&
            this.url === otherCard.url
        );
    }

    static fromJson(jsonCard) {
        return new Card(jsonCard.id, jsonCard.url);
    }
}