import React from 'react';
import styled from 'styled-components';

const GameFunction = (props) => {
  return(
    <Button
      onClick={() => props.onClickCb(props.bid)}
    >
      {props.label}
      <Icon
        dangerouslySetInnerHTML={{__html: props.icon}}
      >
      </Icon>
    </Button>
  );
}

const Button = styled.button`
  display: block;
  height: 30px;
  width: 100px;
`;

const Icon = styled.span`
  content: ${props => props.icon};
`;

export default GameFunction;