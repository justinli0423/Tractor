const _ = require('underscore');
const constants = require('../constants');
const Hand = require('./hand');
const Deck = require('./deck');
const Card = require('./cards');

class BidRound {
    constructor(deck, players, trumpValue, roundNumber) {
        this._roundNumber = roundNumber;
        this._deck = deck;
        this._players = players;
        this._hands = {};
        for (let i = 0; i < this._players.length; i ++) {
            this._hands[this._players[i]] = new Hand(trumpValue);
        }
        this._trumpValue = trumpValue;
        this._trumpSuit = null;
        this._declarer = this._players[0];
        this._bottom = new Deck();
        this._ready = 0;
    }

    deal() {
        this._deck.shuffle();
        console.log(this._deck.numCards)
        let i = 0;
        constants.interval = setInterval(() => {
            let card = this._deck.deal();
            // TODO: CHANGE mod back to 4, i === 100
            constants.su.emitDealCard(this._players[i % constants.numPlayers], [card.value, card.suit]);
            this._hands[this._players[i % constants.numPlayers]].pushCard(card);
            i++;
            if (this._deck.numCards === constants.numBottom) {
                clearInterval(constants.interval);
            }
        }, 1);
        // 150 seems to be a good dealing speed? could be slower
    }

    receiveBid(bid, socketId) {
        this._trumpSuit = bid[1] === 'J' ? 'NT' : bid[1];
        this._declarer = this._roundNumber === 0 ? socketId : this._players[0];
    }

    doneBid() {
        this._ready += 1;
        if (this._ready === this._players.length) {
            if (!this._trumpSuit) {
              let suits = ['S', 'H', 'C', 'D'];
              // TODO: make index * 4 
              let index = Math.floor(Math.random() * 2);
              this._trumpSuit = suits[index];
              this._declarer = this._players[index];
              constants.su.emitGeneratedTrump(this._declarer, [1, this._trumpSuit]);
            }
            for (let i = 0; i < this._players.length; i ++) {
                this._hands[this._players[i]].trumpSuit = this._trumpSuit;
            }
            this.sendBottom();
            if (this._roundNumber === 0) {
                this.rotatePlayers();
            }
        }
    }

    sendBottom() {
        let bottom = [];
        for (let i = 0; i < constants.numBottom; i++) {
            let card = this._deck.deal();
            bottom.push([card.value, card.suit]);
            this._hands[this._declarer].pushCard(card);
        }
        constants.su.emitBottom(this._declarer, bottom);
        constants.su.subNewBottom(this._declarer, this);
        this.sortHands();
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

    set bottom(cards) {
        for (let i = 0; i < cards.length; i++) {
            // let card = new Card(cards[i][0], cards[i][1]);
            this._hands[this._declarer].removeCard(new Card(cards[i][0], cards[i][1]));
            this._bottom.pushCard(new Card(cards[i][0], cards[i][1]));
        }
    }

    sortHands() {
        for (let i = 0; i < this._players.length; i ++) {
            this._hands[this._players[i]].sortHand();
            // console.log('Highest trump single:', this._hands[this._players[i]].highestSingle('T'));
            // console.log('Highest trump double:', this._hands[this._players[i]].highestDouble('T'));
            // console.log('Highest spade single:', this._hands[this._players[i]].highestSingle('S'));
            // console.log('Highest spade double:', this._hands[this._players[i]].highestDouble('S'));
            // console.log('Highest diamond single:', this._hands[this._players[i]].highestSingle('D'));
            // console.log('Highest diamond double:', this._hands[this._players[i]].highestDouble('D'));
            // console.log('Highest club single:', this._hands[this._players[i]].highestSingle('C'));
            // console.log('Highest club double:', this._hands[this._players[i]].highestDouble('C'));
            // console.log('Highest heart single:', this._hands[this._players[i]].highestSingle('H'));
            // console.log('Highest heart double:', this._hands[this._players[i]].highestDouble('H'));
        }
    }

    get deck() {
        return this._deck;
    }

    get bottom() {
        return this._bottom;
    }

    get hands() {
        return this._hands;
    }

    get trumpSuit() {
        return this._trumpSuit;
    }

}

module.exports = BidRound;
