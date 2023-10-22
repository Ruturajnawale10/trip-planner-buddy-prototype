import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";

import { SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import NavigationBar from "../NavigationButton/NavigationBar";
import POIsCard from "./POIsCard";
import { TouchableOpacity } from "react-native-gesture-handler";

const ListPOIs = ({ navigation, day }) => {
  const [destination, setDestination] = useState("");
  const [flag, setFlag] = useState(false);
  const [pois, setPOIs] = useState([]);
  const scrollViewRef = useRef();
  const [scrollX, setScrollX] = useState(0);

  const [data, setData] = useState([]);
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const onPress = () => {
    console.log("pressed");
  };

  const getPOIs = (location) => {
    fetch("http://127.0.0.1:8000/api/destination/" + location, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setFlag(true);
      })
      .catch((error) => console.error(error));
  };

  const addPOI = (POIid) => {
    const desiredX = scrollX + 300;

    // Scroll to the desired position
    scrollViewRef.current.scrollTo({ x: desiredX, animated: true });
    setScrollX(desiredX);

    fetch("http://127.0.0.1:8000/api/trip/add/poi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
        poi_id: POIid,
        day: day,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("POI added with poi_id " + POIid);
      })
      .catch((error) => console.error(error));
  };

  const removePOI = (POIid) => {
    console.log(POIid);
  };

  useEffect(() => {
    getPOIs(location);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {flag && (
        <ScrollView
          horizontal={true}
          ref={scrollViewRef}
          onScroll={(event) => {
            setScrollX(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={16}
        >
          {data.pois.map((item) => (
            <View key={item.id} style={styles.poiCard}>
              <POIsCard
                imageID={item.images[0]}
                poi_name={item.name}
                poi_id={item.poi_id}
                navigation={navigation}
                addPOI={addPOI}
                removePOI={removePOI}
                item={item}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E3E4",
    display: "flex",
  },
  input: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width - 20,
    borderColor: "#DBD9D9",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
  },
  text: {
    fontSize: 20,
    textAlign: "left",
    color: "#412a47",
    fontWeight: "bold",
    marginLeft: 20,
  },
  submitButton: {
    backgroundColor: "#F4727F",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
});

export default ListPOIs;
