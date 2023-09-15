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
import NavigationButton from "./components/NavigationButton/NavigationButton";

const App = () => {
  const [isLogoLoading, setLogoLoading] = useState(false);
  // remove logo when map is loaded
  const logoLoaded = (bool) => {
    setLogoLoading(bool);
  };

  const dummyFunction = () => {
    console.log("dummy function");
  };

  return (
    <NavigationContainer>
      <AppNavigator />
      <SafeAreaView style={styles.navButtons}>
        <NavigationButton
          onPress={dummyFunction}
          bgColor="#F4727F"
          iconName="home"
          title="Home"
        />
        <NavigationButton
          onPress={dummyFunction}
          bgColor="#F4727F"
          iconName="search"
          title="Search"
        />
        <NavigationButton
          onPress={dummyFunction}
          bgColor="#F4727F"
          iconName="person"
          title="Profile"
        />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#E9E3E4",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E9E3E4",
  },
});

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
    },
    {
      initialRouteName: "LoginSignup", // Starts with the login/signup screens
      headerMode: "none", // Hide the navigation header
    }
  )
);

export default App;
