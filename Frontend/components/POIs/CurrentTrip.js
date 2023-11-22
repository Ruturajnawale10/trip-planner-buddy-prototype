import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
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
  POIListData,
  setPOIListData,
  flag,
  reload,
  setReload,
  recommendations,
  loading,
  trip_id,
}) => {
  const [username, setUsername] = useRecoilState(userName);
  const scrollViewRef = useRef();
  const [scrollX, setScrollX] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);

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

  const getOptimizedPath = (dayNo) => {
    console.log("Optimizing path...", dayNo);
    let poi_list = [];
    Array.from(data, ([key, value]) => {
      if (key == dayNo) {
        value.map((item) => {
          poi_list.push([
            item.poi_id,
            item.location.latitude,
            item.location.longitude,
          ]);
        });
      }
    });

    const postData = {
      trip_id: trip_id,
      pois: poi_list,
      start_poi_id: "1",
      end_poi_id: "2",
      mode: "driving",
      optimize_waypoints: true,
    };

    fetch("http://127.0.0.1:8000/api/trip/route/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data2) => {
        var optimized_days = [];
        var n = data2["optimal_route"].length;
        for (let i = 0; i < n; i++) {
          var curr_poi_id = data2["optimal_route"][i]["start_poi_id"];
          data.forEach((value, key) => {
            if (key == dayNo) {
              for (let j = 0; j < value.length; j++) {
                if (key == dayNo && value[j].poi_id == curr_poi_id) {
                  obj = value[j];
                  obj["nextStep"] = data2["optimal_route"][i];
                  optimized_days.push(obj);
                }
              }
            }
          });
        }
        var last_poi_id = data2["optimal_route"][n - 1]["end_poi_id"];
        data.forEach((value, key) => {
          if (key == dayNo) {
            for (let j = 0; j < value.length; j++) {
              if (value[j].poi_id == last_poi_id) {
                obj = value[j];
                optimized_days.push(obj);
                break;
              }
            }
          }
        });

        setData((data) => data.set(dayNo, optimized_days));
        setIsOptimized(true);
      })
      .catch((error) => console.error("Error fetching optimized path:", error));
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ScrollView>
          <View style={styles.container}>
            {/* Loop days and data in a tabular format  */}
            {/*using data object below to reflect change in data without reloading entire page*/}
            <Text style={{ height: 0, width: 0 }}>{data.length}</Text>
            {Array.from(data, ([key, value]) => (
              <View key={key} style={styles.container}>
                <View style={styles.toprow}>
                  <Text style={styles.text}>Day {key}</Text>
                  <Button
                    title="Optimize route"
                    onPress={() => getOptimizedPath(key)}
                  />
                </View>
                {value.map((item, index) => (
                  <View key={item.name + index}>
                    <TouchableOpacity
                      onPress={() => handleDetailsPress(item, key)}
                    >
                      <POIAddedCard
                        item={item}
                        index={index}
                        day={key}
                        removePOI={removePOI}
                        isOptimized={isOptimized}
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
  toprow: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-between", // Space evenly between children
    paddingHorizontal: 30, // Add padding if needed
  },
});

export default CurrentTrip;
