import React from 'react';
import styled from 'styled-components';

const GameFunction = (props) => {
  return(
    <Button
      onClick={() => props.onClickCb()}
    >
      {props.label}
    </Button>
  );
}

const Button = styled.button`
  display: block;
  height: 30px;
  width: 80px;
`;

export default GameFunction;