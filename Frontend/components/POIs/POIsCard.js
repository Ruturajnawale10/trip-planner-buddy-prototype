// A card component with changable data and click event

import React from "react";
import styled from "styled-components";
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, StyleSheet } from "react-native";

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
  bgColor,
  title,
  imageID,
  rating,
  description,
  item,
  navigation,
  addPOI,
  removePOI,
}) => {
  // const navigation = useNavigation(); // Initialize navigation

  const handleCardPress = () => {
    console.log("posidata", item);
    navigation.navigate("POIs", { item: item });
  };

  return (
    <CardContainer bgColor={bgColor}>
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
      <TouchableOpacity onPress={() => addPOI(item.poi_id)}>
        <Button title="Add to Itinerary" style={styles.addButton} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removePOI(item.poi_id)}>
        <Button title="Remove from Itinerary" style={styles.removeButton} />
      </TouchableOpacity>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F4727F",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F4727F",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default POIsCard;
