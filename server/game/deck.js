const Card = require('./cards');

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const suits = ['S', 'D', 'C', 'H']
const jokers = [new Card('S', 'J'), new Card('B', 'J')]

class Deck {
    constructor() {
        this._cards = []
    }

    populate(num_decks = 2) {
        for (let i = 0; i < num_decks; i++) {
            for (let v = 0; v < values.length; v++) {
                for (let s = 0; s < suits.length; s++) {
                    this._cards.push(new Card(values[v], suits[s]))
                }
            }
            this._cards.push(jokers[0])
            this._cards.push(jokers[1])
        }
    }

    push_card(card) {
        this._cards.push(card)
    }

    shuffle() {
        for (let n = 0; n < 3; n++)
        {
            for (let i = 0; i < this._cards.length; i++) {
                let j = Math.floor(Math.random() * (this._cards.length - i)) + i;
                this._cards[i], this._cards[j] = this._cards[j], this._cards[i];
            }
        }
    }

    isEmpty() {
        return this._cards.length === 0
    }

    deal() {
        return this._cards.pop()
    }
}

module.exports = Deck