import Card from './cards'

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const suits = ['S', 'D', 'C', 'H']
const jokers = [new Card('J', 'S'), new Card('J', 'B')]

export default class Deck {
    constructor() {
        self._cards = []
    }

    populate(num_decks = 2) {
        for (let i = 0; i < num_decks; i++) {
            for (let v = 0; v < values.length; this.v++) {
                for (let s = 0; s < suits.length; s++) {
                    self._cards.push(new Card(values[v], suits[s]))
                }
            }
            self._cards.push(jokers[1])
            self._cards.push(jokers[2])
        }
    }

    push_card(card) {
        self._cards.push(card)
    }

    shuffle() {
        for (let i = 0; i < self._cards.length; i++) {
            let j = Math.floor(Math.random() * (self._cards.length - i)) + i;
            self._cards[i] = self._cards[j];
            self._cards[j] = self._cards[i];
        }
    }

    deal() {
        return self._cards.length && self._cards.pop()
    }
}