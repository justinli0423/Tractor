export default class Cards {
  suits = [];
  jokers = [];
  cards = [];
  // fake trump;
  trump = '2';

  constructor() {
    this.suits = new Set(['H', 'C', 'S', 'D']); //hearts, clubs, spades, diamonds
    this.jokers = new Set(['S', 'B']); // Small, big
    this.cards = new Set(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']);
  }

  isValidCard(arr) {
    if (arr[1] === 'J') {
      // if it is a joker,
      return this.jokers.has(arr[0]);
    }
    
    let valid_card = this.cards.has(arr[0]);
    let valid_suit = this.suits.has(arr[1]);

    return valid_card && valid_suit;
  }

  getSvg(arr) {
    if (!this.isValidCard(arr)) {
      console.log(`Invalid card: ${arr}`);
    }
    return `${arr[0]}${arr[1]}.svg`;
  }

  isTrump(card) {
    return card[0] === this.trump;
  }
};