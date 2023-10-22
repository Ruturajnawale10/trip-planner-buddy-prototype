import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import SearchBar from "../SearchBar";
import TripCard from "./TripCard";
import NavigationBar from "../NavigationButton/NavigationBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchValue = async (key) => {
  try {
    let username = await AsyncStorage.getItem(key);
    if (username !== null) {
      // Data retrieval was successful
      console.log(`Retrieved ${key}: ${username}`);
      return username;
    } else {
      // Data does not exist
      console.log(`${key} does not exist in storage`);
      return null;
    }
  } catch (error) {
    // Error retrieving data
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCurrentTripPresent, setIsCurrentTripPresent] = useState(false);

  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Function to fetch data from AsyncStorage
    const fetchDataFromStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem("username");
        if (storedData !== null) {
          setUsername(storedData);
        } else {
          console.log("Data not found in storage");
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    // Call the function to fetch data when the component is mounted
    fetchDataFromStorage();
  }, []);

  const trip_img_url =
    "https://helios-i.mashable.com/imagery/articles/06zoscMHTZxU5KEFx8SRyDg/hero-image.fill.size_1200x900.v1630023012.jpg";

  const getUpcomingTrips = () => {
    const requestBody = {
      username: username,
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
        setData(json);
        if (json.length > 0) {
          setIsCurrentTripPresent(true);
        }
        setIsLoadingData(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getUpcomingTrips();
  }, [username]);

  const pastTrips = () => {
    console.log("past trips");
  };

  const onSearch = () => {
    navigation.navigate("SearchPage");
  };

  const goToTrip = () => {
    const latest_trip_id = data[data.length - 1]._id;
    navigation.navigate("ShowCurrentTrip", {
      trip_id: latest_trip_id,
    });
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
          {isCurrentTripPresent && (
            <>
              <Text style={styles.text}> Continue planning trip </Text>
              <TouchableOpacity onPress={goToTrip} style={styles.submitButton}>
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
              </TouchableOpacity>
            </>
          )}
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
