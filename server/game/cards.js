const default_ranks = {
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    '10': 9,
    'J': 10,
    'Q': 11,
    'K': 12,
    'A': 13,
    'S': 250,
    'B': 500
}
const points = {'5': 5, '10': 10, 'K': 10}

class Card {
    constructor(value, suit) {
        this._value = value;
        this._suit = suit;
    }

    get suit() {
        return this._suit;
    }

    get value() {
        return this._value;
    }

    isEqual(card){
        return this._value === card.value && this._suit === card.suit;
    }

    getRank(trumpValue, trumpSuit) {
        // console.log(this)
        // console.log(default_ranks[this._value])
        // console.log('is trump value', this._value === trumpValue)
        // console.log('is trump suit', this._suit === trumpSuit)
        return default_ranks[this._value] + (this._value === trumpValue ? 52 : 0) + (this._suit === trumpSuit ? 26 : 0);
    }

    getPoints() {
        return points[this._value] ? points[this._value] : 0;
    }
}

module.exports = Card
