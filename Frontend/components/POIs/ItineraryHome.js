import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CurrentTrip from "./CurrentTrip";
import Weather from "./Weather";
import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MapViewPage from "./MapViewPage";
import { useRecoilState } from "recoil";
import { userName } from "../RecoilStore/RecoilStore";
import EditIcon from "react-native-vector-icons/AntDesign";
import { DateFormat } from "../../utils/dateFormat.js";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { settings } from "../../configs/config";

const Tab = createMaterialTopTabNavigator();

function ItineraryTabs({ navigation }) {
  const [data, setData] = useState(new Map());
  const [username, setUsername] = useRecoilState(userName);
  const [POIListData, setPOIListData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reload, setReload] = useState(false);
  const { location, address, radius, startDate, endDate, trip_id } =
    navigation.state.params;
  const [route_transport, setRouteTransport] = useState("driving");
  const [route_loading, setRouteLoading] = useState(false);
  const [currentTripLoading, setCurrentTripLoading] = useState(true);
  const [poiListLoading, setPOIListLoading] = useState(true);

  const getCurrentTrip = () => {
    fetch(settings.BACKEND_URL + "/api/trip/poi_list_1/", {
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
        }
        setRouteLoading(false);
        setCurrentTripLoading(false);
      })
      .catch((error) => console.error(error));
  };
  const getPOIs = () => {
    fetch(
      settings.BACKEND_URL + "/api/getnearby/?user_address=" +
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
        setPOIListData(json);

        setRecommendations(json.gpt_recommendations);
        setPOIListLoading(false);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getCurrentTrip();
    getPOIs();
  }, [reload]);

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
    fetch(settings.BACKEND_URL + "/api/trip/mark/complete/share", {
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
    fetch(settings.BACKEND_URL + "/api/trip/mark/complete", {
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
            reload={reload}
            setReload={setReload}
            recommendations={recommendations}
            trip_id={trip_id}
            setRouteTransport={setRouteTransport}
            route_transport={route_transport}
            setRouteLoading={setRouteLoading}
            route_loading={route_loading}
            address={address}
            radius={radius}
            currentTripLoading={currentTripLoading}
            poiListLoading={poiListLoading}
          />
        )}
      />
      <Tab.Screen
        name="Map View"
        children={() => (
          <MapViewPage
            data={data}
            POIListData={POIListData}
            recommendations={recommendations}
            radius={radius}
            currentTripLoading={currentTripLoading}
            poiListLoading={poiListLoading}
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
  const { location, startDate, endDate, trip_id, tripName } =
    navigation.state.params;
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(tripName);

  let formatted_start_date = DateFormat.format3(startDate);
  let formatted_end_date = DateFormat.format3(endDate);
  let splitByComma1 = formatted_start_date.split(" ");
  let splitByComma2 = formatted_end_date.split(" ");

  if (splitByComma1[1][0] == "0") {
    splitByComma1[1] = splitByComma1[1].substring(1);
  }
  if (splitByComma2[1][0] == "0") {
    splitByComma2[1] = splitByComma2[1].substring(1);
  }
  formatted_start_date =
    splitByComma1[0].substring(0, 3) + " " + splitByComma1[1];
  formatted_end_date =
    splitByComma2[0].substring(0, 3) + " " + splitByComma2[1];

  const year = startDate.substring(0, 4);

  const handleEditPress = () => {
    setEditMode(true);
  };

  const handleSavePress = () => {
    console.log("Saving new title...");
    fetch(settings.BACKEND_URL + "/api/trip/update/title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
        new_title: newTitle,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setEditMode(false);
        } else {
          Alert.alert("Error", "Failed to update the title.");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlebar}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HomePage", { userIsLoggedIn: true })
          }
        >
          <SimpleLineIcons style={{ marginLeft: 10 }} name="home" size={30} />
        </TouchableOpacity>
        {editMode ? (
          <TextInput
            style={styles.titleInput}
            value={newTitle}
            onChangeText={(text) => setNewTitle(text)}
          />
        ) : (
          <Text style={styles.title}>{newTitle}</Text>
        )}
        <EditIcon
          name={editMode ? "save" : "edit"}
          size={25}
          color="grey"
          style={{ marginRight: 2 }}
          onPress={editMode ? handleSavePress : handleEditPress}
        />
      </View>
      <Text style={styles.date}>
        {formatted_start_date} - {formatted_end_date} {year}
      </Text>
      <ItineraryTabs navigation={navigation} />
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
    marginLeft: 30,
  },
  titlebar: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 18,
    textAlign: "center",
    color: "#412a47",
  },
});

export default ItineraryHome;
