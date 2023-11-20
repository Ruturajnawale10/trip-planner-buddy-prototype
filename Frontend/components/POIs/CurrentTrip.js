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
  const [newData, setNewData] = useState(new Map());

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

  const getOptimizedPath = () => {
    console.log("Optimizing path...");
    console.log("noww", data);
    let poi_list = [];
    const no_days = data.size;
    var i = 0;
    Array.from(data, ([key, value]) => {
        if (i < key) {
          poi_list.push([]);
          i += 1;
        }
        value.map((item) => {
          poi_list[key - 1].push([item.poi_id, item.location.latitude, item.location.longitude]);
          // poi_list.push([key, item.poi_id, item.location.latitude, item.location.longitude]);
        });
    });
    console.log("POI list", poi_list);

    const postData = {
      trip_id: trip_id,
      pois: poi_list,
      start_poi_id: "1",
      end_poi_id: "2",
      mode: "driving",
    };
  
    // fetch("http://127.0.0.1:8000/api/trip/route/optimize", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     // You may need to include additional headers if required by your API
    //   },
    //   body: JSON.stringify(postData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle the response data
    //     console.log("Optimized path data:", data);
    //     let optimized_days = new Map();
    //     for (let i = 0; i < data["optimal_route"].length; i++) {
    //       let dayRoute = data["optimal_route"][i];
    //       let formattedDay = [];
    //       for (let j = 0; j < day.length; j++) {
    //         formattedDay.push(day[j]);
    //       }
    //       optimized_days.set(i + 1, formattedDay);
    //     }
    //   })
    //   .catch((error) => console.error("Error fetching optimized path:", error));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ScrollView>
          <View style={styles.container}>
            {/* Loop days and data in a tabular format  */}
            {Array.from(data, ([key, value]) => (
              <View key={key} style={styles.container}>
              <View style={styles.toprow}>
                <Text style={styles.text}>Day {key}</Text>
                {/* if (!optimized_days.has(key)) { */}
                  <Button title="Optimize route" onPress={getOptimizedPath}/>
                {/* } */}
              </View>
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
  toprow: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-between", // Space evenly between children
    paddingHorizontal: 30, // Add padding if needed
  },
});

export default CurrentTrip;
