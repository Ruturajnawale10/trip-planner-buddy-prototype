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

const ShowCurrentTrip = ({ navigation }) => {
  const [formattedData, setFormattedData] = useState(new Map());
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { trip_id } = navigation.state.params;

  const getCurrentTrip = () => {
    fetch("http://127.0.0.1:8000/api/trip/poi_list/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: trip_id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json["trip_details"]);
        setCity(json["trip_details"]["cityName"]);
        for (let i = 0; i < json["pois"].length; i++) {
          let day = json["pois"][i][0]["pois"];
          let formattedDay = [];
          for (let j = 0; j < day.length; j++) {
            formattedDay.push(day[j]["name"]);
          }
          console.log("data", formattedDay);
          setFormattedData((formattedData) =>
            formattedData.set(i + 1, formattedDay)
          );
        }

        console.log("final datas", formattedData);
        setLoading(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCurrentTrip();
    console.log(formattedData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.text}>Your Current Trip to {city}</Text>
            {/* Loop days and data in a tabular format  */}
            {Array.from(formattedData, ([key, value]) => (
              <View style={styles.container}>
                <Text style={styles.text}>Day {key}</Text>
                {value.map((item) => (
                  <View style={styles.locations}>
                    <Text style={styles.location}>{item}</Text>
                    <TouchableOpacity style={styles.removeButton}>
                      <Text>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "gainsboro",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  location: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 20,
    width: "70%",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  day: {
    border: "1px solid black",
    backgroundColor: "gainsboro",
  },
  locations: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
  },
  removeButton: {
    // flex: 1,
    width: "80%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f44336",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default ShowCurrentTrip;
