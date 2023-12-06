import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native";
import { Dimensions } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";
import MapViewCard from "./MapViewCard";

const MapViewPage = ({
  data,
  POIListData,
  recommendations,
  radius,
  currentTripLoading,
  poiListLoading,
}) => {
  function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function kMToLongitudes(km, atLatitude) {
    return (km * 0.0089831) / Math.cos(degreesToRadians(atLatitude));
  }
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.333504500000004,
    longitude: -121.92289944954837,
    latitudeDelta: 0.022,
    longitudeDelta: 0.421,
  });
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([{ label: "All Locations", value: 0 }]);
  const [currentItem, setCurrentItem] = useState(null);

  const showPOI = () => {
    if (currentItem) {
      return <MapViewCard item={currentItem} />;
    }
  };

  const showMarkers = () => {
    if (value != 0) {
      return (
        <>
          {data.get(value).map((item) => (
            <Marker
              pinColor={
                recommendations.includes(item.poi_id) ? "#FFA500" : "#9b87a1"
              }
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
            ></Marker>
          ))}
        </>
      );
    } else {
      return (
        <>
          {POIListData.pois.map((item) => (
            <Marker
              pinColor={
                recommendations.includes(item.poi_id) ? "#FFA500" : "#9b87a1"
              }
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
      );
    }
  };

  useEffect(() => {
    for (let i = 1; i <= data.size; i++) {
      setItems((items) => [...items, { label: "day " + i, value: i }]);
    }
  }, [currentTripLoading, poiListLoading]);

  return (
    <SafeAreaView>
      {!currentTripLoading && !poiListLoading ? (
        <View>
          <View style={styles.container}>
            <DropDownPicker
              placeholder="All Locations"
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              zoomControlEnabled={true}
              style={{
                zIndex: 100,
                position: "absolute",
                top: 10,
                width: 150,
              }}
            />
            <MapView
              style={styles.map}
              initialRegion={
                POIListData
                  ? {
                      latitude: POIListData.geo.latitude,
                      longitude: POIListData.geo.longitude,
                      latitudeDelta: 0.00001,
                      longitudeDelta: kMToLongitudes(
                        radius / 800,
                        POIListData.geo.latitude
                      ),
                    }
                  : initialRegion
              }
            >
              <Circle
                center={{
                  latitude: POIListData.geo.latitude,
                  longitude: POIListData.geo.longitude,
                }}
                radius={radius}
                fillColor="rgba(255, 0, 0, 0.2)"
                strokeColor="rgba(0,0,0,0.5)"
                zIndex={2}
              />
              {showMarkers()}
              <Marker
                coordinate={{
                  latitude: POIListData.geo.latitude,
                  longitude: POIListData.geo.longitude,
                }}
                title="You are here"
                onPress={() => {
                  setCurrentItem(null);
                }}
              />
              <View style={styles.poi}>{showPOI()}</View>
            </MapView>
          </View>
        </View>
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
