import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import TripCard from "../HomePage/TripCard";
import NavigationBar from "../NavigationButton/NavigationBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";
import GetLocation from "react-native-get-location";

const PastTrips = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [latestTrip, setLatestTrip] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCurrentTripPresent, setIsCurrentTripPresent] = useState(false);

  const [username, setUsername] = useRecoilState(userName);

  const [allCollapsed, setAllCollapsed] = useState(false);


  const cityImages = {
    "New York": "https://media.istockphoto.com/id/1365467747/photo/the-statue-of-liberty-seen-from-new-york-harbor.jpg?s=1024x1024&w=is&k=20&c=uHUCaT-rOQsGUJ7qOpv4BLjnduNs9k20RX_SDEd3-BU=",
    "San Jose": "https://media.istockphoto.com/id/1489924466/photo/beautiful-aerial-view-of-the-national-theater-of-costa-rica-and-plaza-de-la-cultura.jpg?s=1024x1024&w=is&k=20&c=HzAMDX1cGyJO1FTWv5cEzXc2EDJ6DTVjXDHL0Bw2HG4=",
    "San Francisco": "https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/ed578728-b35e-4336-ba27-8eced4e968f9/golden+gate+bridge+sarowly.jpg",
    "Vegas": "https://media.istockphoto.com/id/954500850/photo/las-vegas.jpg?s=1024x1024&w=is&k=20&c=0wrHqkorBeV4IiQjQQioIAjrc191xQYBsqq5FMWx0xw=",
  };
// Function to toggle collapse/expand for all trips
const toggleAllTrips = () => {
  setAllCollapsed(!allCollapsed);
};

  const trip_img_url =
    "https://helios-i.mashable.com/imagery/articles/06zoscMHTZxU5KEFx8SRyDg/hero-image.fill.size_1200x900.v1630023012.jpg";

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then((location) => {
      console.log(location);
    })
    .catch((error) => {
      const { code, message } = error;
      console.warn(code, message);
    });
  const getUpcomingTrips = () => {
  
    fetch("http://127.0.0.1:8000/api/trip/list/past/" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
        setUpcomingTrips(json);
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

  const goToTrip = (trip) => {
    navigation.navigate("PastItineraryHome", {
      location: trip.cityName,
      address: trip.address,
      radius: trip.radius,
      startDate: trip.startDate,
      endDate: trip.endDate,
      trip_id: trip._id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
     <Image
        source={require("../../assets/logo.png")} // Update the path to your logo image
        style={styles.logo}
      />
      {!isLoadingData && (
        <ScrollView>
            
        <TouchableOpacity onPress={toggleAllTrips}>
        <Text style={styles.text}>
          {upcomingTrips.length > 0 ? " Past Trips  " : " No Past Trips "}
         </Text>
        
        </TouchableOpacity> 
          {isCurrentTripPresent && upcomingTrips.map((trip, index) => (
            
            <TouchableOpacity key={index} onPress={() => goToTrip(trip)} style={styles.submitButton}>
            
              <TripCard
                onPress={pastTrips}
                bgColor="#ffffff"
                imageSource={
                  cityImages[trip.cityName]
                    ? cityImages[trip.cityName].toString()
                    : "https://media.istockphoto.com/id/1394456695/photo/a-woman-at-the-airport-holding-a-passport-with-a-boarding-pass.jpg?s=1024x1024&w=is&k=20&c=pqyPtKCv5geYEwuBB1-4ZQ68SRq-j53e--2xa82bkEA="
                } // Assuming each trip object has an image property// Assuming each trip object has an image property
                tripName={trip.tripName}
                startDate={trip.startDate}
                pois={trip.pois}
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
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default PastTrips;
