// Create boilerplate reactnative page for a home page with a search bar and a list of items

import React, { Component } from "react";
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
import Card from "./Card";
import NavigationBar from "../NavigationButton/NavigationBar";

const HomePage = ({ navigation }) => {
  // const [showDate, setShowDate] = useState(false);
  const pastTrips = () => {
    console.log("past trips");
  };

  // const onSearch = (text) => {
  //   Keyboard.dismiss();
  //   fetch("http://10.0.0.27:8000/destination/" + text, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       setInitialRegion({
  //         latitude: json.shortest_path[0][1].lat,
  //         longitude: json.shortest_path[0][1].lng,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       });
  //       setData(json);
  //     })
  //     .catch((error) => console.error(error));
  // };
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

      <ScrollView>
        <Card onPress={pastTrips} bgColor="#e7e7e7" title="Past Trips" />
        <Card onPress={pastTrips} bgColor="#e7e7e7" title="All Trips" />
        <Text style={styles.text}> Top Rated Trips </Text>
        <Card onPress={pastTrips} bgColor="#e7e7e7" title="Trip to New York" />
        <Card
          onPress={pastTrips}
          bgColor="#e7e7e7"
          title="Trip to San Fransisco"
        />
        <Card onPress={pastTrips} bgColor="#e7e7e7" title="Trip to Arizona" />
        <Card onPress={pastTrips} bgColor="#e7e7e7" title="Trip to Yosemite" />
      </ScrollView>
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
    textAlign: "center",
    color: "#F4727F",
    fontWeight: "bold",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default HomePage;
