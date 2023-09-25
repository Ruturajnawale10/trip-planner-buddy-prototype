// A card component with changable data and click event

import React from "react";
import styled from "styled-components";
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, StyleSheet, Text } from "react-native";

const CardContainer = styled.TouchableOpacity`
  width: 90%;
  height: 600px;
  padding: 12px;
  border: 1px solid black;
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
  const [showRemove, setShowRemove] = React.useState(false);
  const handleCardPress = (poi_id, task) => {
    if (task == "add") {
      setShowRemove(true);
      addPOI(poi_id);
    } else {
      setShowRemove(false);
      removePOI(poi_id);
    }
  };

  const handleDetailsPress = (item) => {
    navigation.navigate("POIs", { item, showRemove, handleCardPress });
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
      {showRemove ? (
        <TouchableOpacity
          onPress={() => handleCardPress(item.poi_id, "remove")}
          style={styles.removeButton}
        >
          <Text>Remove</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleCardPress(item.poi_id, "add")}
          style={styles.addButton}
        >
          <Text>Add</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => handleDetailsPress(item)}
        style={styles.moreDetailsButton}
      >
        <Text>Details</Text>
      </TouchableOpacity>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  removeButton: {
    // flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f44336",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  moreDetailsButton: {
    // flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2196F3",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
export default POIsCard;
