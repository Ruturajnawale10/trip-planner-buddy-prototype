import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import DateRangePicker from "./DateRangePicker"; // Import your custom DateRangePicker component
import { SafeAreaView } from "react-native";
import NavigationBar from "./NavigationButton/NavigationBar";
import { Dimensions } from "react-native";

const SearchPage = ({ navigation }) => {
  const [selectedDates, setSelectedDates] = useState({});
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    // Implement your search logic here, using destination and selectedDates
    // You can use selectedDates.start and selectedDates.end for the date range
    console.log("Destination:", destination);
    console.log("Selected Start Date:", selectedDates.start);
    console.log("Selected End Date:", selectedDates.end);
    // Perform the search based on user input
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Destination:</Text>
      <TextInput
        placeholder="Enter destination"
        value={destination}
        onChangeText={(text) => setDestination(text)}
        style={styles.input}
      />

      <Text>Select Start and End Dates:</Text>
      <DateRangePicker
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />

      <Button
        title="Search Plans"
        onPress={handleSearch}
        style={styles.button}
      />
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E9E3E4",
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 10,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E3E4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width - 10,
    borderColor: "#DBD9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    display: "flex",
  },

  button: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F4727F",
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "left",
    color: "#F4727F",
    fontWeight: "bold",
  },
});

export default SearchPage;
