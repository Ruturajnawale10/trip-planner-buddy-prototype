import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapViewPage from "./components/MapViewPage";
// import MapScreen from "./components/MapScreen";
const App = () => {
  return (
    <View style={styles.container}>
      <MapViewPage />
      {/* <MapScreen /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
