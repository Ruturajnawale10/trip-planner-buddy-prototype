// Create three buttons that navigate to the three pages on bottom of screen

import React from "react";
import styled from "styled-components";
import { Icon } from "@rneui/themed";

const ButtonContainer = styled.TouchableOpacity`
  width: 33.33%;
  height: 100px;
  padding: 12px;
  background-color: ${(props) => props.bgColor};
`;
const ButtonText = styled.Text`
  font-size: 16px;
  text-align: center;
`;

const NavigationButton = ({ bgColor, iconName, title, page, navigation }) => {
  const onPress = () => {
    console.log("pressed");
    navigation.navigate(page);
  };
  return (
    <ButtonContainer bgColor={bgColor} onPress={onPress}>
      <Icon name={iconName} />
      <ButtonText>{title}</ButtonText>
    </ButtonContainer>
  );
};
export default NavigationButton;
