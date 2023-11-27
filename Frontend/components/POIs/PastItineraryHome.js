import React, { useEffect } from "react";
import { useState } from "react";
import { Text, StyleSheet, Alert, Image, View } from "react-native";
import CurrentTrip from "./CurrentTrip";
import Weather from "./Weather";
import NavigationBar from "../NavigationButton/NavigationBar";
import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MapViewPage from "./MapViewPage";
import { useRecoilState } from "recoil";
import { userName } from "../RecoilStore/RecoilStore";
import PastTrip from "./PastTrip";

const Tab = createMaterialTopTabNavigator();

function ItineraryTabs({ navigation }) {
  const [data, setData] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useRecoilState(userName);
  const [POIListData, setPOIListData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [flag, setFlag] = useState(false);
  const [reload, setReload] = useState(false);
  const { location, address, radius, startDate, endDate, trip_id, isPulic , rating } =
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
          <PastTrip
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

function PastItineraryHome({ navigation }) {
  const { location, startDate, endDate, trip_id, isPublic, rating } = navigation.state.params;

  const calculateAverageRating = () => {
    return rating;
  };
  
  const renderStars = (averageRating) => {
    const totalStars = 5;
    const fullStars = Math.floor(averageRating);
    const halfStars = Math.ceil(averageRating - fullStars);
    const stars = [];
    const starSize = 20; // Set the desired size for your stars
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={i}
          source={require('../../assets/SingleStar.png')}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }
  
    if (halfStars === 1) {
      stars.push(
        <Image
          key="half"
          source={require('../../assets/HalfStar.png')}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }
  
    const emptyStars = totalStars - fullStars - halfStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty${i}`}
          source={require('../../assets/EmptyStar.png')}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }
  
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars}
      </View>
    );
  };
    
  const averageRating = calculateAverageRating();
  const stars = renderStars(averageRating);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trip to {location}</Text>
      {isPublic && (
        <View style={[styles.ratingContainer,  { justifyContent: 'center' }]}>
        <View style={[styles.starsContainer,  { justifyContent: 'center' }]}>{stars}</View>
      </View>
      )}
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
  ratingContainer: {
    alignItems: 'center', // Aligns children elements along the cross-axis (horizontally here)
  },
  
  starsContainer: {
    flexDirection: 'row', // Align stars horizontally
  },
});

export default PastItineraryHome;
