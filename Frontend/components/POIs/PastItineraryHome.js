import React, { useEffect } from "react";
import { useState } from "react";
import { Text, StyleSheet, Image, View, TouchableOpacity } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";
import { SafeAreaView } from "react-native";
import PastTrip from "./PastTrip";
import { userName } from "../../components/RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";

function PastItineraryHome({ navigation }) {
  const {
    location,
    startDate,
    endDate,
    trip_id,
    isPublic,
    rating,
    totalRatings,
  } = navigation.state.params;

  const [data, setData] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [reload, setReload] = useState(false);
  const [route_transport, setRouteTransport] = useState("driving");
  const [route_loading, setRouteLoading] = useState(false);
  const [trip_details, setTripDetails] = useState({});
  const [username, setUsername] = useRecoilState(userName);
  const [hasRated, setHasRated] = useState(true);

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
        setTripDetails(json.trip_details);
        let user_ratings = json.trip_details.userRatings;
        console.log(user_ratings);
        for (let i = 0; i < user_ratings.length; i++) {
          if (user_ratings[i][1] == username) {
            setHasRated(true);
          } else {
            setHasRated(false);
          }
        }
        for (let i = 0; i < json["pois"].length; i++) {
          let day = json["pois"][i][0]["pois"];
          let formattedDay = [];
          for (let j = 0; j < day.length; j++) {
            formattedDay.push(day[j]);
          }
          setData((data) => data.set(i + 1, formattedDay));
        }
        setLoading(false);
        setRouteLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const calculateAverageRating = () => {
    return rating;
  };

  const handleRatingSelect = (rating) => {
    fetch("http://127.0.0.1:8000/api/trip/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
        username: username,
        user_rating: rating,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setHasRated(true);
      })
      .catch((error) => console.error(error));
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
          source={require("../../assets/SingleStar.png")}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }

    if (halfStars === 1) {
      stars.push(
        <Image
          key="half"
          source={require("../../assets/HalfStar.png")}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }

    const emptyStars = totalStars - fullStars - halfStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty${i}`}
          source={require("../../assets/EmptyStar.png")}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }

    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginTop: 0, fontSize: 20, marginRight: 3 }}>
          <Text>{totalRatings > 0 ? averageRating.toFixed(1) : ""}</Text>
        </Text>

        {stars}
        <Text style={{ marginTop: 0, fontSize: 20, marginLeft: 3 }}>
          {totalRatings > 0 ? `(${totalRatings})` : "Not yet rated"}
        </Text>
      </View>
    );
  };

  const renderEmptyStars = (rating) => {
    const starsEmpty = [];
    for (let i = 0; i < 5; i++) {
      starsEmpty.push(
        <TouchableOpacity onPress={() => handleRatingSelect(i + 1)}>
          <Image
            key={`empty${i}`}
            source={require("../../assets/EmptyStar.png")}
            style={styles.emptyStarIcon}
          />
        </TouchableOpacity>
      );
    }

    return <View style={{ flexDirection: "row" }}>{starsEmpty}</View>;
  };

  const averageRating = calculateAverageRating();
  const stars = renderStars(averageRating);
  const emptyStars = renderEmptyStars(averageRating);

  useEffect(() => {
    console.log("We here", trip_id);
    getCurrentTrip();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trip to {location}</Text>
      {isPublic && (
        <View style={[styles.ratingContainer, { justifyContent: "center" }]}>
          <View style={[styles.starsContainer, { justifyContent: "center" }]}>
            {stars}
          </View>
        </View>
      )}

      {isPublic && !hasRated && (
        <View style={[styles.ratingContainer, { justifyContent: "center" }]}>
          <View
            style={[styles.starsContainer, { justifyContent: "center" }]}
          ></View>
          <Text style={styles.createdBy}>Add your rating </Text>
          {emptyStars}
        </View>
      )}

      <Text style={styles.createdBy}>Created by {trip_details.createdBy}</Text>

      <PastTrip
        navigation={navigation}
        data={data}
        setData={setData}
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
    alignItems: "center", // Aligns children elements along the cross-axis (horizontally here)
  },

  starsContainer: {
    flexDirection: "row", // Align stars horizontally
  },
  createdBy: {
    fontSize: 18,
    textAlign: "center",
    color: "#412a47",
    margin: 10,
  },
  emptyStarIcon: {
    width: 30,
    height: 30,
  },
});

export default PastItineraryHome;
