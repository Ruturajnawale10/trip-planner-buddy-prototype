import React from "react";
import { Text, StyleSheet } from "react-native";
import CurrentTrip from "./CurrentTrip";
import Weather from "./Weather";
import NavigationBar from "../NavigationButton/NavigationBar";
import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function ItineraryTabs({ navigation }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
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
        children={() => <CurrentTrip navigation={navigation} />}
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
