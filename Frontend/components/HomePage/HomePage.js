import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import SearchBar from "../SearchBar";
import TripCard from "./TripCard";
import NavigationBar from "../NavigationButton/NavigationBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";
// import GetLocation from "react-native-get-location";

const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [latestTrip, setLatestTrip] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCurrentTripPresent, setIsCurrentTripPresent] = useState(false);

  const [username, setUsername] = useRecoilState(userName);
  
  const trip_img_url =
    "https://helios-i.mashable.com/imagery/articles/06zoscMHTZxU5KEFx8SRyDg/hero-image.fill.size_1200x900.v1630023012.jpg";

  // GetLocation.getCurrentPosition({
  //   enableHighAccuracy: true,
  //   timeout: 60000,
  // })
  //   .then((location) => {
  //     console.log(location);
  //   })
  //   .catch((error) => {
  //     const { code, message } = error;
  //     console.warn(code, message);
  //   });
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
        setLatestTrip(json[json.length - 1]);
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
    navigation.navigate("ItineraryHome", {
      location: latestTrip.cityName,
      startDate: latestTrip.startDate,
      endDate: latestTrip.endDate,
      trip_id: latestTrip._id,
    });
  };

  const seeAllUpcomingTrips = () => {
    navigation.navigate("ProfilePage"); 
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
              <Text style={styles.text}> Continue planning trip  </Text>
              <TouchableOpacity onPress={seeAllUpcomingTrips}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToTrip} style={styles.submitButton}>
                <TripCard
                  onPress={pastTrips}
                  bgColor="#ffffff"
                  imageSource={
                    "https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/ed578728-b35e-4336-ba27-8eced4e968f9/golden+gate+bridge+sarowly.jpg"
                  }
                  tripName={latestTrip.tripName}
                  startDate={latestTrip.startDate}
                  pois={latestTrip.pois}
                />
              </TouchableOpacity>
             
            </>
          )}
          <Text style={styles.text}> Top Rated Trips </Text>
          {/* ... Your other trip cards ... */}
        </ScrollView>
      )}
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: "#412a47",
    fontWeight: "bold",
    marginLeft: 10,
  },
  seeAllText: {
    fontSize: 16,
    color: "blue",
    marginLeft: 10,
    marginTop: 5,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default HomePage;
