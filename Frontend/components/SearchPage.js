import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native";
import NavigationBar from "./NavigationButton/NavigationBar";
import { Dimensions } from "react-native";
import CalendarPicker from "react-native-calendar-picker"; // Import the calendar picker
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchPage = ({ navigation }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [destination, setDestination] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // Data retrieval was successful
        console.log(`Retrieved ${key}: ${value}`);
        return value;
      } else {
        // Data does not exist
        console.log(`${key} does not exist in storage`);
        return null;
      }
    } catch (error) {
      // Error retrieving data
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  };
  
  const handleSearch = () => {
    // Implement your search logic here, using destination and selectedStartDate/selectedEndDate
    // You can use selectedStartDate and selectedEndDate for the date range

    retrieveData("username")
    .then((username) => {
      if (username) {
        console.log("Destination:", destination);
        console.log("Start Date:", selectedStartDate);
        console.log("End Date:", selectedEndDate);
        const startDateString = selectedStartDate.toISOString().split("T")[0];
        const endDateString = selectedEndDate.toISOString().split("T")[0];
        setCreatedBy(retrieveData("username"));
        const requestBody = {
          startDate: startDateString,
          endDate: endDateString,
          cityName: destination,
          createdBy: username
        };
        console.log(requestBody);
        fetch('http://127.0.0.1:8000/api/trip/create/own', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else if (response.status === 400) {
              alert('Failed to create trip');
            }
          })
          .then((data) => {
            // Assuming the response contains the username
            const { trip_id } = data;
            navigation.navigate("ListPOIs", {
              location: destination,
              startDate: startDateString,
              endDate: endDateString,
              trip_id: trip_id
            });
          })
          .catch((error) => {
            console.error('Failed to create trip:', error);
          });
      } else {
        // Handle the case where the username is not found in AsyncStorage
        console.error("Username not found in AsyncStorage");
      }
    })
    .catch((error) => {
      // Handle any errors that occur during data retrieval
      console.error("Error retrieving username:", error);
    });

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

      <Text style={styles.text}>Start Date:</Text>
      <CalendarPicker
        onDateChange={(date) => setSelectedStartDate(date)}
        width={Dimensions.get("window").width - 10}
      />

      <Text style={styles.text}>End Date:</Text>
      <CalendarPicker
        onDateChange={(date) => setSelectedEndDate(date)}
        width={Dimensions.get("window").width - 10}
      />

      <Button title="Create Trip" onPress={handleSearch} />

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

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
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default SearchPage;
