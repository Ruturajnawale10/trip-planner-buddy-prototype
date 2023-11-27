import React, { useEffect } from "react";
import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import CurrentTrip from "./CurrentTrip";
import Weather from "./Weather";
import NavigationBar from "../NavigationButton/NavigationBar";
import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MapViewPage from "./MapViewPage";
import { useRecoilState } from "recoil";
import { userName } from "../RecoilStore/RecoilStore";

const Tab = createMaterialTopTabNavigator();

function ItineraryTabs({ navigation }) {
  const [data, setData] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useRecoilState(userName);
  const [POIListData, setPOIListData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [flag, setFlag] = useState(false);
  const [reload, setReload] = useState(false);
  const { location, address, radius, startDate, endDate, trip_id } =
    navigation.state.params;
  const [route_transport, setRouteTransport] = useState("driving");
  const [route_loading, setRouteLoading] = useState(false);

  const getCurrentTrip = () => {
    fetch("http://127.0.0.1:8000/api/trip/poi_list_1/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
        mode: route_transport,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        for (let i = 0; i < json["pois"].length; i++) {
          let day = json["pois"][i][0]["pois"];
          let formattedDay = [];
          for (let j = 0; j < day.length; j++) {
            formattedDay.push(day[j]);
          }
          setData((data) => data.set(i + 1, formattedDay));
          setRouteLoading(false);
        }
      })
      .catch((error) => console.error(error));
  };
  const getPOIs = () => {
    fetch(
      "http://127.0.0.1:8000/api/getnearby/?user_address=" +
        address +
        "&radius=" +
        radius +
        "&user_name=" +
        username,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        // console.log("POI List", json);
        setPOIListData(json);

        setRecommendations(json.gpt_recommendations);
        setFlag(true);
        setLoading(true);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getCurrentTrip();
    getPOIs();
  }, [reload]);

  useEffect(() => {
    console.log("**************data", data.size);
  }, [loading]);

  useEffect(() => {
    const currentDate = new Date();
    const tripEndDate = new Date(endDate);
  
    if (tripEndDate < currentDate) {
      // Trip has ended
      Alert.alert(
        "Your trip seems to have ended.",
        "Do you wish to move it to past trips?",
        [
          {
            text: "Yes",
            onPress: () => moveToPastTrips(),
          },
          {
            text: "No",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }, []);

  const moveToPastTrips = () => {
    // Make API call to move trip to past trips
    // Show another confirmation alert
    Alert.alert(
      "Help other users of Trip Planner by sharing this trip.",
      "Do you wish to share this trip?",
      [
        {
          text: "Yes",
          onPress: () => shareTrip(),
        },
        {
          text: "No",
          onPress: () => onlyMoveToPastTrips(),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  
  const shareTrip = () => {
    fetch("http://127.0.0.1:8000/api/trip/mark/complete/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
      }),
    })
      .then((response) => navigation.navigate("HomePage"))
      .catch((error) => console.error(error));
  };

  const onlyMoveToPastTrips = () => {
    fetch("http://127.0.0.1:8000/api/trip/mark/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
      }),
    })
      .then((response) => navigation.navigate("HomePage"))
      .catch((error) => console.error(error));
  };

  return (
    <Tab.Navigator
      screenOptions={{
        labelStyle: {
          fontSize: 16,
          fontWeight: "bold",
          textTransform: "capitalize",
        },
        tabStyle: {
          // You can add additional styles to the tab container
        },
      }}
    >
      <Tab.Screen
        name="Itinerary"
        children={() => (
          <CurrentTrip
            navigation={navigation}
            data={data}
            setData={setData}
            POIListData={POIListData}
            setPOIListData={setPOIListData}
            flag={flag}
            reload={reload}
            setReload={setReload}
            recommendations={recommendations}
            loading={loading}
            trip_id={trip_id}
            setRouteTransport={setRouteTransport}
            route_transport={route_transport}
            setRouteLoading={setRouteLoading}
            route_loading={route_loading}
          />
        )}
      />
      <Tab.Screen
        name="Map View"
        children={() => (
          <MapViewPage
            navigation={navigation}
            data={data}
            setData={setData}
            POIListData={POIListData}
            loading={loading}
            recommendations={recommendations}
            radius={radius}
          />
        )}
      />
      <Tab.Screen
        name="Weather"
        children={() => <Weather navigation={navigation} />}
      />
    </Tab.Navigator>
  );
}

function ItineraryHome({ navigation }) {
  const { location, startDate, endDate, trip_id } = navigation.state.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trip to {location}</Text>
      <ItineraryTabs navigation={navigation} />
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 6,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    color: "#412a47",
    fontWeight: "bold",
    margin: 10,
  },
});

export default ItineraryHome;
