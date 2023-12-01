import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Dimensions } from "react-native";

const SearchBarEnter = ({
  topRatedTrips,
  setTopRatedTrips,
  setIsLoadingData1,
  setIsTopRatedTripsPresent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  function capitalizeEachWord(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase());
  }

  const performSearch = async () => {
    const capitalizedString = capitalizeEachWord(searchTerm.toString());
    fetch("http://127.0.0.1:8000/api/trip/list/toprated/" + capitalizedString, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // setData(json);
        console.log(json);
        setTopRatedTrips(json);
        if (json.length > 0) {
          setIsTopRatedTripsPresent(true);
        } else {
          setIsTopRatedTripsPresent(false);
        }
        setIsLoadingData1(true);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search plans by city name"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        onSubmitEditing={performSearch}
        blurOnSubmit={true}
      />
      <Button title="Search" onPress={performSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
  },

  input: {
    height: 35,
    width: Dimensions.get("window").width - 100,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    display: "flex",
    flex: 1,
  },
});

export default SearchBarEnter;
