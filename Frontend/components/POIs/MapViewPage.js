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

// import Dropdown from "./Dropdown";

const MapViewPage = ({ navigation, data, setData, loading }) => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.333504500000004,
    longitude: -121.92289944954837,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log("Size of data: ", data.size);
    for (let i = 1; i <= data.size; i++) {
      setItems((items) => [...items, { label: "day " + i, value: i }]);
    }
    console.log("Dropdown Reloaded", items);
  }, [loading]);

  return (
    <View>
      <MapView style={styles.map} region={initialRegion}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        {value && (
          <>
            {data.get(value).map((item) => (
              <Marker
                key={item.name}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
              />
            ))}
          </>
        )}
        <Marker coordinate={initialRegion} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    alignSelf: "center",
    height: Dimensions.get("window").height * 0.6,
    width: Dimensions.get("window").width * 0.9,
  },
  animation: {
    alignSelf: "center",
    height: 300,
    width: 300,
  },
});
export default MapViewPage;
