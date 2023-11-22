import React, { useState, useRef } from "react";
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
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";
import DropDownPicker from "react-native-dropdown-picker";

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
  setRouteTransport,
  route_transport,
  setRouteLoading,
  route_loading,
}) => {
  const [username, setUsername] = useRecoilState(userName);
  const scrollViewRef = useRef();
  const [scrollX, setScrollX] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "driving", value: "driving" },
    { label: "walking", value: "walking" },
    { label: "bicycling", value: "bicycling" },
  ]);

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
      day: dayNo,
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
        console.log("Path optimized");
        setReload(!reload);
      })
      .catch((error) => console.error("Error fetching optimized path:", error));
  };

  const handleTransportChange = (item) => {
    setRouteTransport(item);
    setRouteLoading(true);
    setReload(!reload);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ScrollView>
          <View style={styles.container}>
            {/*using data object below to reflect change in data without reloading entire page*/}
            <Text style={{ height: 0, width: 0 }}>
              {data.length} {route_transport}
            </Text>
            <DropDownPicker
              placeholder={route_transport}
              defaultValue={route_transport}
              style={styles.dropDownPicker}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              listMode="SCROLLVIEW"
              onChangeValue={handleTransportChange}
            />
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
                        route_transport={route_transport}
                        route_loading={route_loading}
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
    paddingBottom: 30,
    paddingLeft: 6,
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 5,
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
  },
  removeButton: {
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
    flexDirection: "col",
    paddingHorizontal: 50,
  },
  dropDownPicker: {
    zIndex: 100,
    top: 5,
    width: 120,
    height: 5,
  },
});

export default CurrentTrip;
