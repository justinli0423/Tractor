import React, { Component } from "react";
import styled from 'styled-components';

import CardSvgs from '../utils/CardSvgs';
import { getCards } from "../socket/connect";

const path = '/cardsSVG/';
const Cards = new CardSvgs();
const cardWidth = 120;
const cardHeight = 168;


class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardSvgs: [],
      numCards: 0,
    };
  }

  componentDidMount() {
    getCards(this.setCards.bind(this));
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
  height: ${prop => `${prop.height * 3}px`};
  overflow-x: scroll;
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


export default Game;