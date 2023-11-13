import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import MapViewPage from "./components/MapViewPage";
import HomePage from "./components/HomePage/HomePage";
import SearchPage from "./components/SearchPage";
import ListPOIs from "./components/POIs/ListPOIs";
import POIs from "./components/POIs/POIs";
import CurrentTrip from "./components/POIs/CurrentTrip";
import ItineraryHome from "./components/POIs/ItineraryHome";
import PreferenceScreen1 from "./components/UserPreferences/PreferenceScreen1";
import PreferenceScreen2 from "./components/UserPreferences/PreferenceScreen2";

const App = () => {
  const [isLogoLoading, setLogoLoading] = useState(false);
  // remove logo when map is loaded
  const logoLoaded = (bool) => {
    setLogoLoading(bool);
  };

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      Login: LoginScreen,
      Signup: SignupScreen,
      MapView: MapViewPage,
      HomePage: HomePage,
      SearchPage: SearchPage,
      ListPOIs: ListPOIs,
      POIs: POIs,
      CurrentTrip: CurrentTrip,
      ItineraryHome: ItineraryHome,
      PreferenceScreen1: PreferenceScreen1,
      PreferenceScreen2: PreferenceScreen2,
      MapViewPage: MapViewPage,
    },
    {
      initialRouteName: "HomePage", // Starts with the login/signup screens
      headerMode: "none", // Hide the navigation header
    }
  )
);

export default App;
