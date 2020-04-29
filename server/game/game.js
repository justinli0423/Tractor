const constants = require('../constants')
const Round = require('./round');
const Deck = require('./deck');

class Game {
    constructor(players) {
        this._team1 = null;
        this._team2 = null;
        this._players = players;
        this._team1Level = '2';
        this._team2Level = '2';
        this._deck = new Deck();
        this._deck.populate();
        this._next_declarer = null;
        this._next_opponent = null;
        this._roundNumber = 0;
        this._round = null;
    }

    set team1([players]) {
        this._team1 = players;
        this._players[0] = players[0];
        this._players[2] = players[1];
    }

    set team2([players]) {
        this._team2 = players;
        this._players[1] = players[0];
        this._players[3] = players[1];
    }

    get team1_level() {
        return this._team1_level;
    }

    set team1_level(level) {
        this._team1_level = level;
    }

    get team2_level() {
        return this._team2_level;
    }
    set team2_level(level) {
        this._team2_level = level;
    }

    new_round(level = null) {
        // TODO: update to dynamic trumpValue
        const trumpValue = '2';
        constants.game.round = new Round(this._deck, this._players, trumpValue, this._roundNumber);
        this._round = constants.game.round;
        this._round.dealAndBid();
        // this._round.play();
        // this._round.end();
        this._deck = this._round.deck;
        // this._next_declarer = this._round._next_declarer;
    }
}

module.exports = Game;
