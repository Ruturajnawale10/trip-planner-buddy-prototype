import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";

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
      <Button title="Search" onPress={handleSearch} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff000",
    borderRadius: 10,
    width: "50%",
    margin: 10,
    padding: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
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
