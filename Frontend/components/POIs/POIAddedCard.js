import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const POIAddedCard = ({ item, day, removePOI, isOptimized }) => {
  return (
    <View>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.tripName}>{item.name}</Text>
          <Text style={styles.description}>
            {item.description != null && item.description.length < 90
              ? `${item.description}`
              : item.description != null
              ? `${item.description.substring(0, 90)}...`
              : ""}
          </Text>
        </View>
        <Image
          source={{
            uri:
              "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
              item.images[0],
          }}
          style={styles.image}
        />
        <View>
          <TouchableOpacity onPress={() => removePOI(item.poi_id, day)}>
            <Icon name="remove" size={30} color="#900" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Add a horizontal line below the card */}
      {isOptimized && item.nextStep ? (
        <View style={styles.container}>
          <View style={styles.separator} />
          <Text style={styles.text}>Driving</Text>
          <View style={styles.separator} />
          <Text style={styles.text}>Distance {item.nextStep ? item.nextStep.distance: ""}</Text>
          <View style={styles.separator} />
          <Text style={styles.text}>Time {item.nextStep ? item.nextStep.duration: ""}</Text>
          <View style={styles.separator} />
        </View>
      ) : <View style={styles.separator_full} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 8,
    marginBottom: 18,
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    justifyContent: "center",
  },
  tripName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
    width: Dimensions.get("window").width - 150,
  },
  description: {
    flex: 1,
    fontSize: 16,
    color: "#767282",
    width: Dimensions.get("window").width - 150,
    numberOfLines: 2,
  },
  separator_full: {
    height: 1,
    backgroundColor: "#D3D3D3",
    borderRadius: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  toprow: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-between", // Space evenly between children
    paddingHorizontal: 30, // Add padding if needed
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    marginRight: 5, // Adjust the spacing between texts
    color: "#767282",
  },
  separator: {
    height: 1,
    width: "10%",
    backgroundColor: "#D3D3D3",
    borderRadius: 1,
    marginHorizontal: 5,
  },
});

export default POIAddedCard;
