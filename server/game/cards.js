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
    'B': 250,
    'S': 500
}

const points = {'5': 5, '10': 10, 'K': 10}

class Card {
    constructor(value, suit, trump_value = null, trump_suit = null) {
        this._suit = suit;
        this._value = value;
        this._rank = default_ranks[this._value] +
            (this._value === trump_value ? 52 : 0) +
            (this._suit === trump_suit ? 26 : 0);
    }

    get suit() {
        return this._suit;
    }

    get value() {
        return this._value;
    }

    get rank() {
        return this._rank;
    }

    get points() {
        return points[this._value] ? points[this._value] : 0;
    }
}

module.exports = Card
