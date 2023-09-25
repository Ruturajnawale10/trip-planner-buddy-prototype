import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";
import POIsCard from "./POIsCard";
import { TouchableOpacity } from "react-native-gesture-handler";

const ListPOIs = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [flag, setFlag] = useState(false);
  const [pois, setPOIs] = useState([]);

  //   const route = useRoute();
  //   console.log(navigation.state.params.location);
  const [data, setData] = useState([]);
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  //   const { destination, startDate, endDate } = route.params;
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
        // console.log(json);
      })
      .catch((error) => console.error(error));
  };

  const addPOI = (POIid) => {
    console.log(POIid);
    setPOIs([...pois, POIid]);
  };

  const removePOI = (POIid) => {
    console.log(POIid);
    setPOIs(pois.filter((id) => id !== POIid));
  };

  const submitPOIs = () => {
    console.log("submitting");
    console.log(pois, trip_id);
    for (let i = 0; i < pois.length; i++) {
      fetch("http://127.0.0.1:8000/api/trip/add/poi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: trip_id,
          poi_id: pois[i],
          day: i / 3,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (i === pois.length - 1) {
            navigation.navigate("ShowCurrentTrip", {
              trip_id: trip_id,
            });
          }
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    getPOIs(location);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Destination:</Text>
      <TextInput
        placeholder="Enter destination"
        value={data.city_name}
        onChangeText={(text) => setDestination(text)}
        style={styles.input}
      />
      {flag && (
        <ScrollView>
          {data.pois.map((item) => (
            <View key={item.id}>
              <POIsCard
                bgColor="#d1c9d4"
                title={item.name}
                imageID={item.images[0]}
                rating={item.rating}
                description={item.description}
                item={item}
                navigation={navigation}
                addPOI={addPOI}
                removePOI={removePOI}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity onPress={submitPOIs} style={styles.submitButton}>
        <Text> Submit </Text>
      </TouchableOpacity>
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E3E4",
    display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
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
