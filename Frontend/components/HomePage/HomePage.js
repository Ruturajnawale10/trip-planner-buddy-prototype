import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import SearchBar from "../SearchBar";
import TripCard from "./TripCard";
import NavigationBar from "../NavigationButton/NavigationBar";

const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const trip_img_url =
    "https://helios-i.mashable.com/imagery/articles/06zoscMHTZxU5KEFx8SRyDg/hero-image.fill.size_1200x900.v1630023012.jpg";

  const getUpcomingTrips = () => {
    const requestBody = {
      username: "ruturaj",
    };

    fetch("http://127.0.0.1:8000/api/trip/list/upcoming", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("wow");
        console.log(json);
        setData(json);
        setIsLoadingData(false);
        console.log(json);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getUpcomingTrips();
  }, []);

  const pastTrips = () => {
    console.log("past trips");
  };

  const onSearch = () => {
    navigation.navigate("SearchPage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/logo.png")} // Update the path to your logo image
        style={styles.logo}
      />
      <SearchBar onSearch={onSearch} />
      {!isLoadingData && (
      <ScrollView>
        <Text style={styles.text}> Continue planning trip </Text>
        <TripCard
          onPress={pastTrips}
          bgColor="#d1c9d4"
          imageSource={
            "https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/ed578728-b35e-4336-ba27-8eced4e968f9/golden+gate+bridge+sarowly.jpg"
          }
          tripName={data[data.length - 1].tripName}
          startDate={data[data.length - 1].startDate}
          pois={data[data.length - 1].pois}
        />
        <Text style={styles.text}> Top Rated Trips </Text>
        <TripCard
          onPress={pastTrips}
          bgColor="#d1c9d4"
          imageSource={trip_img_url}
          tripName="Trip to Washington"
        />
        <TripCard
          onPress={pastTrips}
          bgColor="#d1c9d4"
          imageSource={trip_img_url}
          tripName="Trip to San Fransisco"
        />
        <TripCard
          onPress={pastTrips}
          bgColor="#d1c9d4"
          imageSource={trip_img_url}
          tripName="Trip to Arizona"
        />
        <TripCard
          onPress={pastTrips}
          bgColor="#d1c9d4"
          imageSource={trip_img_url}
          tripName="Trip to Yosemite"
        />
      </ScrollView>
      )}
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E3E4",
  },
  text: {
    fontSize: 20,
    color: "#412a47",
    fontWeight: "bold",
    marginLeft: 10,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default HomePage;
