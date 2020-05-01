import React from 'react';
import styled from 'styled-components';
import { Button as RegularButton } from './RegularButton';

const BidButton = (props) => {
  return (
    <Button
      onClick={() => props.onClickCb(props.bid)}
    >
      <span>
        {props.label}
      </span>
      <Icon
        color={props.color}
        dangerouslySetInnerHTML={{ __html: props.icon }}
      >
      </Icon>
    </Button>
  );
}

// TODO: FIX BUTTON ALIGNMENT AND SIZE
const Button = styled(RegularButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 0;
  border-radius: 5px;
  height: 40px;
  width: 105px;
`;

const Icon = styled.span`
  padding-left: 5px;
  font-size: 20px;
  color: red;
  filter: ${props => props.color === 'black' && 'grayscale(1)'};
`;

export default BidButton;