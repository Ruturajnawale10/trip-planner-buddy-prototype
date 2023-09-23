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
import NavigationButton from "./components/NavigationButton/NavigationButton";

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

const LoginSignupStack = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
  },
  {
    initialRouteName: "Login", // You can change this to 'Signup' if you want to start with signup
  }
);

const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      LoginSignup: LoginSignupStack,
      MapView: MapViewPage,
      HomePage: HomePage,
      SearchPage: SearchPage,
      ListPOIs: ListPOIs,
    },
    {
      initialRouteName: "LoginSignup", // Starts with the login/signup screens
      headerMode: "none", // Hide the navigation header
    }
  )
);

export default App;
