import React, { Component } from "react";
import styled from 'styled-components';

import PlayingCards from '../utils/Cards';
import { getCards, getCurrentBottom } from "../socket/connect";


const path = '/cardsSVG/';
const Cards = new PlayingCards();
const cardWidth = 120;
const cardHeight = 168;


class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardSvgs: [],
      numCards: 0
    };
  }

  componentDidMount() {
    getCards(this.setCards.bind(this));
    getCurrentBottom(this.props.setCurrentBottomCb);
    this.setCards();
  }

  setCards(card) {
    if (!card || card.length !== 2) return;
    const {
      cards,
      cardSvgs,
      numCards
    } = this.state;
    
    cards.push(card);
    cardSvgs.push(path + Cards.getSvg(card));

    this.setState({
      cards,
      cardSvgs,
      numCards: numCards + 1
    });
  }

  render() {
    const {
      // cards,
      cardSvgs,
      numCards
    } = this.state;
    return(
      <Container 
        height={cardHeight}
      >
        {/* <img src={cardSvgs[1]} /> */}
        {cardSvgs.map((card, i) => {
          let cardKey = card + '_' + i;
          return (
            <CardImg
              width={cardWidth}
              height={cardHeight}
              numCards={numCards}
              src={card}
              key={cardKey}
            />
            // change the key prop to the name of card
          )
        })}
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  display: flex;
  bottom: 2em;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  width: 1800px;
  height: ${prop => `${prop.height * 1.6}px`};
  overflow-y: scroll;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
`;

const CardImg = styled.img`
  width: ${prop => `${prop.width}px`};
  height: ${prop => `${prop.height}px`};
  flex-shrink: 0;

  &:not(:first-child) {
    margin-left: ${prop => `-${prop.numCards * 2.2}px`};
  }

  &:hover {
    z-index: 100;
    transform: scale(1.5) translateY(-28px);
    /* width: ${prop => `${prop.width * 1.5}px`};
    height: ${prop => `${prop.height * 1.5}px`}; */
    /* margin-left: ${prop => `-${prop.numCards}px`}; */
  }
`;

function insertCard(cards, newCard, trumpValue, trumpSuit) {
  // want a black, red, black, red order
  // order already works for NT and spades trump
  let suitOrder = {'S': 0, 'D': 1, 'C': 2, 'H': 3};
  const valueOrder = {
    'A': 0,
    'K': 1,
    'Q': 2,
    'J': 3,
    '10': 4,
    '9': 5,
    '8': 6,
    '7': 7,
    '6': 8,
    '5': 9,
    '4': 10,
    '3': 11,
    '2': 12
  }
  if (trumpSuit) {
    // diamonds are trump -> want diamonds first -> move spades to back
    if (trumpSuit === 'D') {
      suitOrder['S'] = 4;
      // clubs are trump -> switch clubs and spades
    } else if (trumpSuit === 'C') {
      suitOrder['C'] = 0;
      suitOrder['S'] = 2;
      // hearts are trump -> move hearts to front
    } else if (trumpSuit === 'H') {
      suitOrder['H'] = -1;
    }
  }
  if (cards) {
    let i = 0;
    // card is a joker
    if (newCard[0] === 'S' || newCard[1] === 'J') {
      while (cards[i][0] === 'B' && cards[i][1] === 'J') {
        i++;
      }
      // card value is trump
    } else if (newCard[0] === trumpValue) {
      // Jokers come first
      while (cards[i][1] === 'J') {
        i++;
      }
      // insert based on order
      while (cards[i][0] === trumpValue && suitOrder[cards[i][0]] < suitOrder[newCard[0]]) {
        i++;
      }
      // card is neither a joker nor a "trump value trump"
    } else {
      while (cards[i][1] === 'J' || cards[i][0] === trumpValue) {
        i++;
      }
      while (suitOrder[cards[i][1]] < suitOrder[newCard[1]]) {
        i++;
      }
      while (valueOrder[cards[i][1]] < valueOrder[newCard[1]]) {
        i++;
      }
    }
    cards.splice(i, 0, newCard);
  } else {
    cards.push(newCard)
  }
}

const input = [
[ 'S', 'J' ],
    [ '10', 'D' ],
    [ '3', 'D' ],
    [ 'Q', 'S' ],
    [ '5', 'C' ],
    [ '7', 'H' ],
    [ '4', 'D' ],
    [ 'K', 'C' ],
    [ 'K', 'H' ],
    [ '3', 'D' ],
    [ '7', 'H' ],
    [ 'Q', 'H' ],
    [ '6', 'D' ],
    [ '9', 'D' ],
    [ 'A', 'C' ],
    [ '6', 'D' ],
    [ 'Q', 'C' ],
    [ 'B', 'J' ],
    [ '7', 'S' ],
    [ 'A', 'S' ],
    [ '3', 'C' ],
    [ 'J', 'S' ],
    [ '3', 'H' ],
    [ 'A', 'S' ],
    [ 'A', 'C' ],
    [ 'K', 'H' ],
    [ '4', 'S' ],
    [ '8', 'C' ],
    [ 'J', 'S' ],
    [ 'B', 'J' ],
    [ '2', 'C' ],
    [ '2', 'H' ],
    [ '8', 'D' ],
    [ '2', 'D' ],
    [ '8', 'C' ],
    [ '9', 'S' ],
    [ '6', 'H' ],
    [ '5', 'C' ],
    [ '5', 'H' ],
    [ 'K', 'S' ],
    [ 'J', 'D' ],
    [ '6', 'C' ],
    [ '10', 'H' ],
    [ '8', 'D' ],
    [ '3', 'C' ],
    [ '4', 'D' ],
    [ 'Q', 'D' ],
    [ 'K', 'C' ],
    [ '9', 'H' ],
    [ '10', 'C' ],
    [ '3', 'S' ],
    [ '5', 'H' ],
    [ '3', 'H' ],
    [ '4', 'C' ],
    [ '2', 'D' ],
    [ '5', 'S' ],
    [ '8', 'H' ],
    [ '8', 'S' ],
    [ '9', 'S' ],
    [ 'A', 'H' ],
    [ '7', 'C' ],
    [ '6', 'C' ],
    [ '10', 'C' ],
    [ '10', 'S' ],
    [ 'Q', 'H' ],
    [ '6', 'H' ],
    [ '2', 'C' ],
    [ '5', 'D' ],
    [ '4', 'H' ],
    [ 'K', 'D' ],
    [ '10', 'S' ],
    [ '7', 'S' ],
    [ '4', 'S' ],
    [ '3', 'S' ],
    [ '2', 'S' ],
    [ '6', 'S' ],
    [ 'J', 'H' ],
    [ '10', 'H' ],
    [ '7', 'D' ],
    [ 'J', 'C' ],
    [ 'A', 'H' ],
    [ '7', 'C' ],
    [ '6', 'S' ],
    [ '10', 'D' ],
    [ '4', 'C' ],
    [ '9', 'H' ],
    [ '8', 'S' ],
    [ '2', 'S' ],
    [ '4', 'H' ],
    [ '9', 'D' ],
    [ 'K', 'S' ],
    [ '8', 'H' ],
    [ 'J', 'D' ],
    [ 'J', 'H' ],
    [ 'Q', 'S' ],
    [ 'A', 'D' ],
    [ '2', 'H' ],
    [ 'S', 'J' ],
    [ '5', 'S' ],
    [ 'A', 'D' ]
]

var output = []

// for (let i = 0; i < )

console.log(input.length)

export default Game;

