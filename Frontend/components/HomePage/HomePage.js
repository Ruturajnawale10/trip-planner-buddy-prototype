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
import TopRatedCard from "./TopRatedCard";
// import GetLocation from "react-native-get-location";

const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [latestTrip, setLatestTrip] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCurrentTripPresent, setIsCurrentTripPresent] = useState(false);
  const [topRatedTrips, setTopRatedTrips] = useState([]);
  const [isTopRatedTripsPresent, setIsTopRatedTripsPresent] = useState(false);
  const [isLoadingData1, setIsLoadingData1] = useState(true);

  const [username, setUsername] = useRecoilState(userName);

  const cityImages = {
    "New York": "https://media.istockphoto.com/id/1365467747/photo/the-statue-of-liberty-seen-from-new-york-harbor.jpg?s=1024x1024&w=is&k=20&c=uHUCaT-rOQsGUJ7qOpv4BLjnduNs9k20RX_SDEd3-BU=",
    "San Jose": "https://media.istockphoto.com/id/1489924466/photo/beautiful-aerial-view-of-the-national-theater-of-costa-rica-and-plaza-de-la-cultura.jpg?s=1024x1024&w=is&k=20&c=HzAMDX1cGyJO1FTWv5cEzXc2EDJ6DTVjXDHL0Bw2HG4=",
    "San Francisco": "https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/ed578728-b35e-4336-ba27-8eced4e968f9/golden+gate+bridge+sarowly.jpg",
    "Vegas": "https://media.istockphoto.com/id/954500850/photo/las-vegas.jpg?s=1024x1024&w=is&k=20&c=0wrHqkorBeV4IiQjQQioIAjrc191xQYBsqq5FMWx0xw=",
  };

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

  const getTopRatedTrips = () => {


    fetch("http://127.0.0.1:8000/api/trip/list/toprated/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
                setTopRatedTrips(json);
        if (json.length > 0) {
          setIsTopRatedTripsPresent(true);
        }
        setIsLoadingData1(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getUpcomingTrips();
    getTopRatedTrips();
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
      address: latestTrip.address,
      radius: latestTrip.radius,
      startDate: latestTrip.startDate,
      endDate: latestTrip.endDate,
      trip_id: latestTrip._id,
    });
  };

  const goToSharedTrip = (trip) => {
    console.log(trip);
    navigation.navigate("PastItineraryHome", {
      location: trip.cityName,
      address: trip.address,
      radius: trip.radius,
      startDate: trip.startDate,
      endDate: trip.endDate,
      trip_id: trip._id,
      isPublic: trip.isPublic,
      rating: trip.rating,
    });
  };

  const seeAllUpcomingTrips = () => {
    navigation.navigate("UpcomingTrips");
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
              <TouchableOpacity onPress={seeAllUpcomingTrips}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToTrip} style={styles.submitButton}>
                <TripCard
                  onPress={pastTrips}
                  bgColor="#ffffff"
                  imageSource={
                    cityImages[latestTrip.cityName]
                      ? cityImages[latestTrip.cityName].toString()
                      : "https://media.istockphoto.com/id/1394456695/photo/a-woman-at-the-airport-holding-a-passport-with-a-boarding-pass.jpg?s=1024x1024&w=is&k=20&c=pqyPtKCv5geYEwuBB1-4ZQ68SRq-j53e--2xa82bkEA="
                  }
                  // imageSource={
                  //   "https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/ed578728-b35e-4336-ba27-8eced4e968f9/golden+gate+bridge+sarowly.jpg"
                  // }
                  tripName={latestTrip.tripName}
                  startDate={latestTrip.startDate}
                  pois={latestTrip.pois}
                />
              </TouchableOpacity>
            </>
          )}
          <Text style={styles.text}> Top Rated Trips </Text>
          
          {isTopRatedTripsPresent && topRatedTrips.map((trip, index) => (
            
            <TouchableOpacity key={index} onPress={() => goToSharedTrip(trip)} style={styles.submitButton}>
            
              <TopRatedCard
                onPress={pastTrips}
                bgColor="#ffffff"
                imageSource={
                  cityImages[trip.cityName]
                    ? cityImages[trip.cityName].toString()
                    : "https://media.istockphoto.com/id/1394456695/photo/a-woman-at-the-airport-holding-a-passport-with-a-boarding-pass.jpg?s=1024x1024&w=is&k=20&c=pqyPtKCv5geYEwuBB1-4ZQ68SRq-j53e--2xa82bkEA="
                }
                tripName={trip.tripName}
                pois={trip.pois}
                rating={trip.rating}
              />
            </TouchableOpacity>
          ))}
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
