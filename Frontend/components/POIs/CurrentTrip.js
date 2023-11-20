import React, { useEffect, useState, useRef } from "react";
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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";

const CurrentTrip = ({
  navigation,
  data,
  setData,
  getCurrentTrip,
  loading,
  setLoading,
}) => {
  const [POIListData, setPOIListData] = useState([]);
  const [flag, setFlag] = useState(false);
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const [reload, setReload] = useState(false);
  const [username, setUsername] = useRecoilState(userName);
  const [recommendations, setRecommendations] = useState([]);
  const scrollViewRef = useRef();
  const [scrollX, setScrollX] = useState(0);

  const addPOI = (POIid, day) => {
    const desiredX = scrollX + 300;

    // Scroll to the desired position
    scrollViewRef.current.scrollTo({ x: desiredX, animated: true });
    setScrollX(desiredX);

    let newItem;

    POIListData.pois.map((item) => {
      if (item.poi_id == POIid) {
        newItem = item;
      }
    });

    Array.from(data, ([key, value]) => {
      if (key == day) {
        let newData = value.concat([newItem]);
        setData((data) => data.set(key, newData));
      }
    });
    setReload(!reload);

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
      })
      .catch((error) => console.error(error));
  };

  const getRecommendations = (cityName, username) => {
    console.log("getRecommendations", cityName, username);
    fetch(
      "http://127.0.0.1:8000/api/get/gpt/recommendation?city_name=" +
        cityName +
        "&user_name=" +
        username,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("output", json);
        setRecommendations(json);
        setFlag(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCurrentTrip();
    getPOIs(location);
    // fetchDataFromStorage().then(() => {
    console.log("username", username);
    getRecommendations(location, username);
    // });
    console.log("Reload");
  }, [reload, data]);

  const handleDetailsPress = (item, key) => {
    const t = true;
    if (recommendations.includes(item.poi_id)) {
      navigation.navigate("POIs", { item, addPOI: t, key, recommended: t });
    } else {
      const f = false;
      navigation.navigate("POIs", { item, addPOI: t, key, recommended: f });
    }
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
                    setData={setPOIListData}
                    recommendations={recommendations}
                    day={key - 1}
                    removePOI={removePOI}
                    addPOI={addPOI}
                    setScrollX={setScrollX}
                    scrollViewRef={scrollViewRef}
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
