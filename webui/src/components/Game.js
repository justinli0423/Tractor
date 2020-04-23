import React, { Component } from "react";
import styled from 'styled-components';
import { Card } from '../utils/getCards';

const path = '/cardsSVG/';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardSvgs: []
    };
  }

  componentDidMount() {
    const Cards = new Card();
    const cards = [['A', 'S'], ['A', 'S'], [3, 'C'], [5, 'D'], ['K', 'S'],['A', 'S'], [3, 'C'], [5, 'D'], ['K', 'S']];
    const cardSvgs = [];
    cards.forEach((card) => {
      cardSvgs.push(path + Cards.getSvg(card)+'.svg');
    });
    this.setState({
      cards,
      cardSvgs
    });
  }

  render() {
    const {
      // cards,
      cardSvgs
    } = this.state;
    return(
      <Container>
        {/* <img src={cardSvgs[1]} /> */}
        {cardSvgs.map(card => {
          console.log(card);
          return (
            <CardImg src={card} key={card} />
            // change the key prop to the name of card
          )
        })}
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  bottom: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 1800px;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
`;

const CardImg = styled.img`
  width: 240px;
  height: 336px;
  flex-shrink: 0;
`;

export default Game;