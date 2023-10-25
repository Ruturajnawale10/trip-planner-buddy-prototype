import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { SafeAreaView } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import ListPOIs from "./ListPOIs";
import POIAddedCard from "./POIAddedCard";

const CurrentTrip = ({ navigation }) => {
  const [data, setData] = useState(new Map());
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { location, startDate, endDate, trip_id } = navigation.state.params;

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
        setCity(json["trip_details"]["cityName"]);
        for (let i = 0; i < json["pois"].length; i++) {
          let day = json["pois"][i][0]["pois"];
          let formattedDay = [];
          for (let j = 0; j < day.length; j++) {
            formattedDay.push(day[j]);
          }
          setData((data) => data.set(i + 1, formattedDay));
        }
        setLoading(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCurrentTrip();
  }, []);

  const handleDetailsPress = (item) => {
    navigation.navigate("POIs", { item });
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ScrollView>
          <View style={styles.container}>
            {/* Loop days and data in a tabular format  */}
            {Array.from(data, ([key, value]) => (
              <View key={key} style={styles.container}>
                <Text style={styles.text}>Day {key}</Text>
                {value.map((item) => (
                  <View key={item.name}>
                    <TouchableOpacity onPress={() => handleDetailsPress(item)}>
                      <POIAddedCard item={item} />
                    </TouchableOpacity>
                  </View>
                ))}
                <ListPOIs navigation={navigation} day={key - 1} />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 6,
    backgroundColor: "#ffffff",
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
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  day: {
    border: "1px solid black",
    backgroundColor: "#ffffff",
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

export default CurrentTrip;
