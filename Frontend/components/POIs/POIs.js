import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native";
import Swiper from "react-native-swiper";
import NavigationBar from "../NavigationButton/NavigationBar";
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";
import { color } from "../../custom_colors/colors";
import { Icon } from "@rneui/themed";
import YelpLogo from "../POIs/Logos/YelpLogo";

export default function POIs({ navigation }) {
  // Extract the POI data from the route params
  const { item, addPOI, day, recommended } = navigation.state.params;
  const [recommendedDescription, setRecommendedDescription] = useState(null);
  const [username, setUsername] = useRecoilState(userName);
  const [images, setImages] = useState([]);
  const [load, setLoad] = useState(false);
  const [placeDetails, setPlaceDetails] = useState(null);
  let showAdded;
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
        setRecommendedDescription(json);
      })
      .catch((error) => console.error(error));
  };

  const getPlaceDetails = (place_id) => {
    console.log("getPlaceDetails: ", place_id);
    fetch(
      "https://wanderlog.com/api/placesAPI/getPlaceDetails/v2?placeId=" +
        place_id +
        "&language=en-US",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setPlaceDetails(json);
        for (let i = 0; i < item.images.length; i++) {
          fetch(
            "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
              item.images[i]
          )
            .then((response) => {
              if (response.status === 200) {
                setImages((images) => [...images, response.url]);
              }
              if (recommended) {
                fetchRecommendedDescription(item.city, username, item.poi_id);
              }
              setLoad(true);
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    console.log("item", item);
    getPlaceDetails(item.placeId);
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        {load ? (
          <SafeAreaView style={styles.container}>
            <Swiper showsButtons={true} style={{ height: 400 }}>
              {images.map((image) => (
                <View key={image} style={{ alignItems: "center" }}>
                  <Image style={styles.image} source={{ uri: image }} />
                </View>
              ))}
            </Swiper>
            {/* Destination details */}
            <Text style={styles.title}>{item.name}</Text>
            <View style={{ flexDirection: "row", margin: 8 }}>
              {placeDetails.data.price_level && (
                <TouchableOpacity style={styles.pricelevel}>
                  <Text style={{ color: "#f6c64d" }}>
                    {"$".repeat(placeDetails.data.price_level)}
                  </Text>
                </TouchableOpacity>
              )}
              {placeDetails.data.types && (
                <ScrollView horizontal={true}>
                  {placeDetails.data.types.map((type) => (
                    <TouchableOpacity style={styles.links} key={type}>
                      <Text>{type.replace("_", " ")}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            {recommended && (
              <View>
                <Text style={styles.whyText}>
                  Why we recommend this for you:
                </Text>

                <TouchableOpacity style={styles.recommendedDescription}>
                  <Text style={styles.recommendedDescriptionText}>
                    {recommendedDescription}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {placeDetails.data.website && (
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 16,
                  marginRight: 16,
                }}
              >
                <TouchableOpacity
                  style={styles.links}
                  onPress={() => {
                    Linking.openURL(placeDetails.data.website);
                  }}
                >
                  <Icon name="link" />
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 16, margin: 8, padding: 8 }}
                  onPress={() => {
                    Linking.openURL(placeDetails.data.website);
                  }}
                >
                  {placeDetails.data.website}
                </Text>
              </View>
            )}
            {placeDetails.data.international_phone_number && (
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 16,
                  marginRight: 16,
                }}
              >
                <TouchableOpacity
                  style={styles.links}
                  onPress={() => {
                    Linking.openURL(
                      "tel:" + placeDetails.data.international_phone_number
                    );
                  }}
                >
                  <Icon name="phone" />
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 16, margin: 10, padding: 10 }}
                  onPress={() => {
                    Linking.openURL(
                      "tel:" + placeDetails.data.international_phone_number
                    );
                  }}
                >
                  {placeDetails.data.international_phone_number}
                </Text>
              </View>
            )}

            <Text style={styles.details}>City: {item.city}</Text>
            <Text style={styles.details}>Address: {item.address}</Text>
            <Text style={styles.details}>Rating: {item.rating} / 5</Text>
            {placeDetails.data.opening_hours && (
              <View
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 8,
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: color.purpleLight,
                }}
              >
                <Text style={{ fontSize: 16, margin: 8 }}>Opening Hours:</Text>
                {/* Draw line */}
                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    width: "100%",
                  }}
                />
                {placeDetails.data.opening_hours.weekday_text.map((item) => (
                  <Text style={{ fontSize: 16, margin: 8 }} key={item}>
                    {item}
                  </Text>
                ))}
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {placeDetails.data.url && (
                <View
                  style={{
                    marginLeft: 8,
                    marginRight: 8,
                    flexDirection: "row",
                    height: 90,
                  }}
                >
                  <TouchableOpacity
                    style={styles.links}
                    onPress={() => {
                      Linking.openURL(placeDetails.data.url);
                    }}
                  >
                    <Icon name="map" />
                    <Text>Google Map</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* https://www.google.com/search?q=Nomikai
               */}
              <View
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  flexDirection: "row",
                  height: 90,
                }}
              >
                <TouchableOpacity
                  style={styles.links}
                  onPress={() => {
                    Linking.openURL(
                      "https://www.google.com/search?q=" + item.name
                    );
                  }}
                >
                  <Icon name="search" />
                  <Text>Google</Text>
                </TouchableOpacity>
              </View>
              {/* https://www.yelp.com/search?find_desc=nomikai */}
              <View
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  flexDirection: "row",
                  height: 90,
                }}
              >
                <TouchableOpacity
                  style={styles.links}
                  onPress={() => {
                    Linking.openURL(
                      "https://www.yelp.com/search?find_desc=" + item.name
                    );
                  }}
                >
                  <YelpLogo />

                  <Text>Yelp</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showAdded && (
              <TouchableOpacity
                style={[
                  styles.favouriteButton,
                  { backgroundColor: color.purple },
                ]}
                onPress={() => {
                  try {
                    addPOI(item.poi_id);
                  } catch (e) {
                    console.error(e);
                  }
                }}
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
            <View style={{ height: 100 }} />
          </SafeAreaView>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </ScrollView>

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "flex-start",
    // Adjust the vertical alignment as needed
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
    margin: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    margin: 16,
  },
  recommendedDescription: {
    fontSize: 16,
    marginBottom: 16,
    margin: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: color.purple,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: color.purpleLight,
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
    fontSize: 16,
    marginBottom: 8,
    margin: 8,
    paddingHorizontal: 8,
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
    marginBottom: 16,
    margin: 8,
  },
  links: {
    backgroundColor: color.purpleLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    margin: 8,
  },
  pricelevel: {
    backgroundColor: "#9b87a1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    margin: 8,
  },
});
