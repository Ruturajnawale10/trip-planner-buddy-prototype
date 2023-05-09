import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { Dimensions } from "react-native";
import SearchButton from "./SearchButton";

const SearchBar = ({ onSearch }) => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        onChangeText={(text) => setText(text)}
        value={text}
        onSubmitEditing={handleSearch}
      />
      {/* <Button title="Search" onPress={handleSearch} style={styles.button} /> */}
      <SearchButton onPress={handleSearch} bgColor="#F4727F" title="Search" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff000",
    alignSelf: "center",
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    margin: 10,
    padding: 5,
    alignItems: "center",
  },

  input: {
    height: 40,
    width: Dimensions.get("window").width - 20,
    borderColor: "#DBD9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    display: "flex",
  },
  button: {
    display: "flex",
    margin: 10,
    padding: 10,
    width: "100%",
  },
});

export default SearchBar;
