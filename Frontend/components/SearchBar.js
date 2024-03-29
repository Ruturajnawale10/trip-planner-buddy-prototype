import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { Dimensions } from "react-native";

const SearchBar = ({ onSearch }) => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    onSearch();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search a destination"
        onFocus={handleSearch}
        onChange={handleSearch}
        value={text}
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    margin: 10,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  input: {
    height: 40,
    width: Dimensions.get("window").width - 100,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    display: "flex",
    flex: 1,
  },

  button: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#d1c9d4",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchBar;
