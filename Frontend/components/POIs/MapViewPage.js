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
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";
import { Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";
import MapViewCard from "./MapViewCard";
import CustomMarker from "./CustomMarker";

// import Dropdown from "./Dropdown";

const MapViewPage = ({ navigation, data, setData, loading }) => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.333504500000004,
    longitude: -121.92289944954837,
    latitudeDelta: 0.022,
    longitudeDelta: 0.421,
  });
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [reload, setReload] = useState(false);

  const showPOI = () => {
    if (currentItem) {
      return <MapViewCard item={currentItem} />;
    }
  };

  useEffect(() => {
    console.log("Size of data: ", data.size);
    for (let i = 1; i <= data.size; i++) {
      setItems((items) => [...items, { label: "day " + i, value: i }]);
    }
    console.log("Dropdown Reloaded", items);
  }, [loading]);

  return (
    <SafeAreaView>
      <View>
        <View style={styles.container}>
          <MapView style={styles.map} region={initialRegion}>
            <DropDownPicker
              placeholder="Select a day"
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={{ zIndex: 100, position: "absolute", top: 10, width: 150 }}
            />
            {value && (
              <>
                {data.get(value).map((item) => (
                  <Marker
                    pinColor="#9b87a1"
                    key={item.name}
                    coordinate={{
                      latitude: item.location.latitude,
                      longitude: item.location.longitude,
                    }}
                    title={item.name}
                    onPress={() => {
                      console.log(item);
                      setCurrentItem(item);
                    }}
                  >
                    {/* <CustomMarker /> */}
                  </Marker>
                ))}
              </>
            )}
            <Marker coordinate={initialRegion} />
            <View style={styles.poi}>{showPOI()}</View>
          </MapView>
        </View>
      </View>
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
  map: {
    alignSelf: "center",
    height: Dimensions.get("window").height * 0.8,
    width: Dimensions.get("window").width,
  },
  animation: {
    alignSelf: "center",
    height: 300,
    width: 300,
  },
  poi: {
    position: "absolute",
    top: 400,
  },
});
export default MapViewPage;
