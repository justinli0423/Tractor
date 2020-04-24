const Round = require('./round');
const Deck = require('./deck');

class Game {
    constructor() {
        this._team1 = null
        this._team2 = null
        this._order = [null, null, null, null]
        // this._team1_level = '2'
        // this._team2_level = '2'
        this._deck = new Deck()
        this._deck.populate()
        // this._next_declarer = null
        // this._next_opponent = null
        this._round = null
    }

    set team1([players]) {
        this._team1 = players
        this._order[0] = players[0]
        this._order[2] = players[1]
    }

    set team2([players]) {
        this._team2 = players
        this._order[1] = players[0]
        this._order[3] = players[1]
    }

    // get team1_level() {
    //     return this._team1_level
    // }
    //
    // set team1_level(level) {
    //     this._team1_level = level
    // }
    //
    // get team2_level() {
    //     return this._team2_level
    // }
    // set team2_level(level) {
    //     this._team2_level = level
    // }

    next_round(level = null) {
        // var level =
        this._round = new Round(this._deck, this._order, 2)
        this._round.deal()
        // this._round.play()
        // this._round.end()
        // this._next_declarer = this._round._next_declarer
    }
}

module.exports = Game;