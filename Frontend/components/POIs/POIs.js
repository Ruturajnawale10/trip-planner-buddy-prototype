import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";
import { Dimensions } from "react-native";

export default function POIs({ navigation }) {
  // Extract the POI data from the route params
  const { item, addPOI, day, recommended } = navigation.state.params;
  const [recommendedDescription, setRecommendedDescription] = useState(null);
  if (addPOI == null) {
    console.log("addPOI is null");
    showAdded = false;
  } else {
    showAdded = true;
  }
  const removePOI = (POIid, day) => {
    console.log(POIid);
    console.log(day);

    fetch("http://127.0.0.1:8000/api/trip/delete/poi", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
        poi_id: POIid,
        day: day,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("POI deleted with poi_id " + POIid, json);
      })
      .catch((error) => console.error(error));
  };

  const fetchRecommendedDescription = (city, username, poi_id) => {
    fetch(
      "http://127.0.0.1:8000/api/gpt/personalized/description?city_name=" +
        city +
        "&user_name=" +
        username +
        "&poi_id=" +
        poi_id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("output", json);
        setRecommendedDescription(json);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    console.log("********", recommended);
    if (recommended) {
      fetchRecommendedDescription(item.city, "roshan", item.poi_id);
    }
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
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
          {recommended && (
            <View>
              <Text style={styles.whyText}>Why we recommend this for you:</Text>

              <TouchableOpacity style={styles.recommendedDescription}>
                <Text style={styles.recommendedDescriptionText}>
                  {recommendedDescription}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
              onPress={() => {
                console.log("remove POI", item.poi_id, day);
                try {
                  removePOI(item.poi_id, day);
                } catch (e) {
                  console.log(e);
                }
                navigation.goBack();
              }}
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
        </SafeAreaView>
      </ScrollView>

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
  recommendedDescription: {
    fontSize: 16,
    marginBottom: 16,
    margin: 8,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f9a03f",
  },
  recommendedDescriptionText: {
    fontSize: 16,
    marginBottom: 4,
    margin: 8,
    padding: 8,
  },
  whyText: {
    fontSize: 16,
    margin: 8,
    padding: 8,
    fontWeight: "bold",
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
