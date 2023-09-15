// A card component with changable data and click event

import React from "react";
import styled from "styled-components";

const CardContainer = styled.TouchableOpacity`
  width: 90%;
  height: 100px;
  padding: 12px;
  border-radius: 10px;
  align-self: center;
  justify-content: center;
  margin: 10px;
  background-color: ${(props) => props.bgColor};
`;
const CardText = styled.Text`
  font-size: 16px;
  text-align: center;
`;

const Card = ({ onPress, bgColor, title }) => (
  <CardContainer onPress={onPress} bgColor={bgColor}>
    <CardText>{title}</CardText>
  </CardContainer>
);
export default Card;
