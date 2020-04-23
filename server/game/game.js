const Round = require('./round');
const Deck = require('./deck');

class Game {
    constructor(players = null) {
        this._players = players
        this._team1_level = '2'
        this._team2_level = '2'
        this._deck = new Deck()
        this._deck.populate()
        this._next_declarer = null
        this._next_opponent = null
        this._round = null
    }

    get players() {
        return this._players
    }

    get team1_level() {
        return this._team1_level
    }

    set team1_level(level) {
        this._team1_level = level
    }

    get team2_level() {
        return this._team2_level
    }
    set team2_level(level) {
        this._team2_level = level
    }

    next_round(level) {
        var level =
        this._round = new Round(this._deck, this._next_declarer, this._next_opponent, level)
    }
}

module.exports = Game;