import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const MapViewCard = ({ item, day }) => {
  return (
    <View>
      <TouchableOpacity style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.tripName}>{item.name}</Text>

          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Image
          source={{
            uri:
              "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
              item.images[0],
          }}
          style={styles.image}
        />
      </TouchableOpacity>
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
    borderColor: "#D3D3D3",
    borderWidth: 5,
    backgroundColor: "#D3D3D3",
    // borderStyle: "dashed",
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
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    width: Dimensions.get("window").width - 110,
  },
  description: {
    fontSize: 12,
    color: "#767282",
    width: Dimensions.get("window").width - 110,
  },
  separator: {
    height: 1,
    backgroundColor: "#D3D3D3", // Color of the separator line
    marginVertical: 16, // Adjust the margin as needed
  },
});

export default MapViewCard;
