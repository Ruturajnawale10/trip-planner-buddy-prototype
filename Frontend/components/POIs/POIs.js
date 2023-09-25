import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function POIs({ navigation, route }) {
  const [isFavourite, toggleFavourite] = useState(false);
  console.log(navigation.state);
  // Extract the POI data from the route params
  const { item } = navigation.state.params;
  console.log(item);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{
          uri:
            "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
            item.images[0],
        }}
        style={styles.image}
      />

      {/* Destination details */}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.details}>City: {item.city}</Text>
      <Text style={styles.details}>Address: {item.address}</Text>
      <Text style={styles.details}>Rating: {item.rating} / 5</Text>

      {/* Favorite and Back buttons */}
      <TouchableOpacity
        style={[
          styles.favouriteButton,
          { backgroundColor: isFavourite ? "red" : "blue" },
        ]}
        onPress={() => toggleFavourite(!isFavourite)}
      >
        <Text style={styles.buttonText}>
          {isFavourite ? "Remove from Itinerary" : "Add to Itinerary"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Adjust the vertical alignment as needed
    padding: 16,
  },
  image: {
    width: 300, // Adjust the image width as needed
    height: 400, // Adjust the image height as needed
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8, // Optional: Add border radius for a rounded image
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  details: {
    fontSize: 14,
    marginBottom: 8,
  },
  favouriteButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 8,
  },
});