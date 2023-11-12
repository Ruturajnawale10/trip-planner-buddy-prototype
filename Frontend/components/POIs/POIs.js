import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";

export default function POIs({ navigation }) {
  // Extract the POI data from the route params
  const { item, addPOI, removePOI, day } = navigation.state.params;
  if (addPOI == null) {
    console.log("addPOI is null");
    showAdded = false;
  } else {
    showAdded = true;
  }

  return (
    <SafeAreaView style={styles.container}>
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
      {showAdded && (
        <TouchableOpacity
          style={[styles.favouriteButton, { backgroundColor: "blue" }]}
          onPress={() => addPOI(item.poi_id)}
        >
          <Text style={styles.buttonText}>Add to Itinerary</Text>
        </TouchableOpacity>
      )}
      {!showAdded && (
        <TouchableOpacity
          style={[styles.favouriteButton, { backgroundColor: "red" }]}
          onPress={() => removePOI(item.poi_id, day)}
        >
          <Text style={styles.buttonText}>Remove from Itinerary</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Adjust the vertical alignment as needed
  },
  image: {
    width: "100%", // Adjust the image width as needed
    height: 400, // Adjust the image height as needed
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    margin: 16,
  },
  details: {
    fontSize: 14,
    marginBottom: 8,
    margin: 8,
  },
  favouriteButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    margin: 8,
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
