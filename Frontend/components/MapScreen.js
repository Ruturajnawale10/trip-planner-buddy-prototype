import React, { useState } from "react";
// import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const MapScreen = () => {
  const [location, setLocation] = useState(null);

  const handleSelect = (data, details) => {
    setLocation({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <>
      <GooglePlacesAutocomplete
        placeholder="Enter Location"
        onPress={handleSelect}
        fetchDetails={true}
        enablePoweredByContainer={false}
        query={{
          key: "AIzaSyApoUcX90UtIqqXxu1JLE1y7P4hmRX191E",
          language: "en",
          components: "country:us",
        }}
      />
      {/* {location && (
        <MapView style={{ flex: 1 }} initialRegion={location}>
          <Marker coordinate={location} />
        </MapView>
      )} */}
    </>
  );
};

export default MapScreen;
