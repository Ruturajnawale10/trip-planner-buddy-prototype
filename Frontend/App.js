import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapViewPage from "./components/MapViewPage";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import HomePage from "./components/HomePage/HomePage";

const App = () => {
  const [isLogoLoading, setLogoLoading] = useState(false);
  // remove logo when map is loaded
  const logoLoaded = (bool) => {
    setLogoLoading(bool);
  };

  return <HomePage />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#E9E3E4",
  },
});

export default App;
