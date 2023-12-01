import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import POIAddedCardForPastTrip from "./POIAddedCardForPastTrip";

const PastTrip = ({
  navigation,
  data,
  setData,
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
  const handleDetailsPress = (item, key) => {
    const t = true;
    if (recommendations.includes(item.poi_id)) {
      navigation.navigate("POIs", { item, addPOI: t, key, recommended: t });
    } else {
      const f = false;
      navigation.navigate("POIs", { item, addPOI: t, key, recommended: f });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loading ? (
        <ScrollView>
          <View style={styles.container}>
            <Text style={{ height: 0, width: 0 }}>
              {data.length} {route_transport} {loading}
            </Text>
            {Array.from(data, ([key, value]) => (
              <View key={key} style={styles.container}>
                <View style={styles.toprow}>
                  <Text style={styles.text}>Day {key}</Text>
                </View>
                {value.map((item, index) => (
                  <View key={item.name + index}>
                    <TouchableOpacity
                      onPress={() => handleDetailsPress(item, key)}
                    >
                      <POIAddedCardForPastTrip
                        item={item}
                        index={index}
                        day={key}
                        route_transport={route_transport}
                        route_loading={route_loading}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
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
    flexDirection: "column",
    paddingHorizontal: 50,
  },
  dropDownPicker: {
    zIndex: 100,
    top: 5,
    width: 120,
    height: 5,
  },
});

export default PastTrip;
