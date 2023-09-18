// A card component with changable data and click event

import React from "react";
import styled from "styled-components";
import { Icon } from "@rneui/themed";

const CardContainer = styled.TouchableOpacity`
  width: 90%;
  height: 500px;
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

const CardImage = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  align-self: center;
  justify-content: center;
  margin: 10px;
  background-color: ${(props) => props.bgColor};
`;

const POIsCard = ({
  onPress,
  bgColor,
  title,
  imageID,
  rating,
  description,
}) => (
  <CardContainer onPress={onPress} bgColor={bgColor}>
    <CardText>{title}</CardText>

    <CardImage
      source={{
        uri:
          "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
          imageID,
      }}
    />
    <Icon name="star" />

    <CardText>{rating}</CardText>
    <CardText>{description}</CardText>
  </CardContainer>
);
export default POIsCard;
