import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ListPOIs from "./ListPOIs";
import POIAddedCard from "./POIAddedCard";

const CurrentTrip = ({ navigation }) => {
  const [data, setData] = useState(new Map());
  const [POIListData, setPOIListData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const [reload, setReload] = useState(false);

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

  const getPOIs = (location) => {
    fetch("http://127.0.0.1:8000/api/destination/" + location, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setPOIListData(json);
        setFlag(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCurrentTrip();
    getPOIs(location);
    console.log("Reload");
  }, [reload, data]);

  const handleDetailsPress = (item, key) => {
    const t = true;
    navigation.navigate("POIs", { item, t, key });
  };

  const removePOI = (POIid, day) => {
    console.log(POIid);
    console.log(day);
    Array.from(data, ([key, value]) => {
      if (key == day) {
        let newData = value.filter((item) => item.poi_id !== POIid);
        setData((data) => data.set(key, newData));
      }
    });
    setReload(!reload);
    console.log(data);
    fetch("http://127.0.0.1:8000/api/trip/delete/poi", {
      method: "DELETE",
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
        console.log("POI deleted with poi_id " + POIid, json);
      })
      .catch((error) => console.error(error));
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
                    <TouchableOpacity
                      onPress={() => handleDetailsPress(item, key)}
                    >
                      <POIAddedCard
                        item={item}
                        day={key}
                        removePOI={removePOI}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                {flag && (
                  <ListPOIs
                    navigation={navigation}
                    data={POIListData}
                    day={key - 1}
                    removePOI={removePOI}
                  />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
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
