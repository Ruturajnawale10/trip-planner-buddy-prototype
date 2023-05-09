import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SearchBar from "./SearchBar";
import { Dimensions } from "react-native";
import { Keyboard } from "react-native";
import CustomMarker from "./CustomMarker";
import LottieView from "lottie-react-native";
import AnimatedLottieView from "lottie-react-native";

// import Logo from "./Logo";

const MapViewPage = ({ logoLoaded }) => {
  const [isLoading, setLoading] = useState(false);
  const [isInitialSearch, setInitialSearch] = useState(true);
  const [data, setData] = useState([]);
  const [initialRegion, setInitialRegion] = useState({});

  const onSearch = (text) => {
    if (!isInitialSearch) {
      logoLoaded(false);
    }
    setLoading(true);

    Keyboard.dismiss();
    fetch("http://10.0.0.27:8000/destination/" + text, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setInitialRegion({
          latitude: json.shortest_path[0][1].lat,
          longitude: json.shortest_path[0][1].lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        setInitialSearch(false);
        logoLoaded(true);
      });
  };

  return (
    <View>
      {/* <Logo /> */}

      <SearchBar onSearch={onSearch} />

      {isLoading ? (
        <LottieView
          source={require("../assets/loading.json")}
          style={styles.animation}
          autoPlay={true}
        />
      ) : isInitialSearch ? (
        <></>
      ) : (
        <>
          <MapView style={styles.map} region={initialRegion}>
            <Marker
              title={data.shortest_path[0][0]}
              description="Start"
              // image={require("../assets/1.png")}
              coordinate={{
                latitude: data.shortest_path[0][1].lat,
                longitude: data.shortest_path[0][1].lng,
              }}
            >
              <CustomMarker rank="1" name={data.shortest_path[0][0]} />
            </Marker>
            <Marker
              title={data.shortest_path[1][0]}
              coordinate={{
                latitude: data.shortest_path[1][1].lat,
                longitude: data.shortest_path[1][1].lng,
              }}
            >
              <CustomMarker rank="2" name={data.shortest_path[1][0]} />
            </Marker>

            <Marker
              title={data.shortest_path[2][0]}
              coordinate={{
                latitude: data.shortest_path[2][1].lat,
                longitude: data.shortest_path[2][1].lng,
              }}
            >
              <CustomMarker rank="3" name={data.shortest_path[2][0]} />
            </Marker>
            <Marker
              title={data.shortest_path[3][0]}
              coordinate={{
                latitude: data.shortest_path[3][1].lat,
                longitude: data.shortest_path[3][1].lng,
              }}
            >
              <CustomMarker rank="4" name={data.shortest_path[3][0]} />
            </Marker>

            <Marker
              title={data.shortest_path[4][0]}
              coordinate={{
                latitude: data.shortest_path[4][1].lat,
                longitude: data.shortest_path[4][1].lng,
              }}
            >
              <CustomMarker rank="5" name={data.shortest_path[4][0]} />
            </Marker>
          </MapView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    alignSelf: "center",
    height: Dimensions.get("window").height * 0.8,
    width: Dimensions.get("window").width * 0.9,
  },
  animation: {
    alignSelf: "center",
    height: 300,
    width: 300,
  },
});

export default MapViewPage;
