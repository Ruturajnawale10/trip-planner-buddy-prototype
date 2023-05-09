import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapViewPage from "./components/MapViewPage";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";

const App = () => {
  const [isLogoLoading, setLogoLoading] = useState(false);
  // remove logo when map is loaded
  const logoLoaded = (bool) => {
    setLogoLoading(bool);
  };

  return (
    // <View style={styles.container}>
    <SafeAreaView style={styles.container}>
      {isLogoLoading ? (
        <></>
      ) : (
        <Image
          source={require("./assets/logo.png")}
          style={{ alignSelf: "center", marginTop: 20 }}
        />
      )}

      <MapViewPage logoLoaded={logoLoaded} />
    </SafeAreaView>
    // {/* <MapScreen /> */}
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#E9E3E4",
  },
});

export default App;
