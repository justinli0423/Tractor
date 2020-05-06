const _ = require('underscore');
const constants = require('../constants');
const Round = require('./round');
const Deck = require('./deck');

// const levels = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const levels = ['2', '5', '10', 'K'];
const switchPoints = 80;
const levelPoints = 40;

class Game {
    constructor(players) {
        this._teams = [[players[0], players[2]], [players[1], players[3]]];
        this._players = players;
        this._levels = [0, 0];
        this._deck = new Deck();
        this._deck.populate();
        this._roundNumber = 0;
        this._round = null;
        this._declarer = null;
    }

    newRound() {

        if (this._round) {
            this._roundNumber++;
            let opponentPoints = this._round.opponentPoints;
            console.log(`game.newRound - Opponent Points: ${opponentPoints}`);
            this._declarer = opponentPoints >= switchPoints ? this._players[1] : this._players[2];
            console.log(`game.newRound - Next declarer is ${constants.su.sockets[this._declarer]}`);
            const team = _.contains(this._teams[0], this._declarer) ? 0 : 1;
            console.log(`game.newRound - declarers' original level: ${levels[this._levels[team]]}`);
            let levelIncrease = 0;
            if (opponentPoints === switchPoints + levelPoints * 3 || opponentPoints === 0) {
                levelIncrease = 3;
            } else if (opponentPoints >= switchPoints + levelPoints * 2  ||
                opponentPoints <= switchPoints - levelPoints) {
                levelIncrease = 2;
            } else if (opponentPoints >= switchPoints + levelPoints || opponentPoints <= switchPoints) {
                levelIncrease = 1;
            }
            this._levels[team] = (this._levels[team] + levelIncrease) % levels.length;
            console.log(`game.newRound - declarers' new level: ${levels[this._levels[team]]}`);
            this.rotatePlayers();
            console.log('game.newRound - deck', this._deck.numCards)
            this._round = new Round(this._deck, this._players, levels[this._levels[team]], this._roundNumber);
            // this._round = constants.game.round;
            this._round.dealAndBid.call(this._round);
        } else {
            const trumpValue = '2';
            this._round = new Round(this._deck, this._players, trumpValue, this._roundNumber);
            // this._round = constants.game.round;
            this._round.dealAndBid();
            this._deck = this._round.deck;
        }
    }

    rotatePlayers() {
        const i = _.indexOf(this._players, this._declarer);
        let temp = [];
        for (let j = 0; j < this._players.length; j++) {
            temp[j] = this._players[(j + i) % this._players.length];
        }
        for (let j = 0; j < this._players.length; j++) {
            this._players[j] = temp[j];
        }
    }

    get round() {
        return this._round;
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

    get players() {
        return this._players;
    }

}

module.exports = Game;
