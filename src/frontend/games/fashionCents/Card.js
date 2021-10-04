export default class Card {

    constructor(id, url, cardBackUrl) {
        this.id = id;
        this.url = url;
        this.cardBackUrl = cardBackUrl;
    }

    toString(){
        return "id: " + this.id + ", url: " + this.url + ", cardBackUrl: " + this.cardBackUrl;
    }

    equals(otherCard){
        return (
            this.id === otherCard.id &&
            this.url === otherCard.url &&
            this.cardBackUrl === otherCard.cardBackUrl
        );
    }

    static fromJson(jsonCard) {
        return new Card(jsonCard.id, jsonCard.url, jsonCard.cardBackUrl);
    }
}