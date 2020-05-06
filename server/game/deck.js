const _ = require('underscore');
const Card = require('./cards');

// const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const values = ['2', '5', '10', 'K'];
// const suits = ['S', 'D', 'C', 'H'];
const suits = ['S', 'D'];
const jokers = [new Card('S', 'J'), new Card('B', 'J')];

class Deck {
    constructor() {
        this._numCards = 0
        this._cards = [];
    }

    get numCards() {
        return this._numCards;
    }

    get cards() {
        return this._cards;
    }

    populate(num_decks = 2) {
        for (let i = 0; i < num_decks; i++) {
            for (let v = 0; v < values.length; v++) {
                for (let s = 0; s < suits.length; s++) {
                    this._numCards++;
                    this._cards.push(new Card(values[v], suits[s]));
                }
            }
            this._cards.push(jokers[0]);
            this._numCards++;
            this._cards.push(jokers[1]);
            this._numCards++;
        }
    }

    pushCard(card) {
        this._numCards++;
        this._cards.push(card);
    }

    shuffle() {
        this._cards = _.shuffle(this._cards);
    }

    isEmpty() {
        return this._cards.length === 0;
    }

    deal() {
        this._numCards--;
        return this._cards.pop();
    }
}

module.exports = Deck;
