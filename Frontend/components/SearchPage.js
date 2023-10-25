import React, { useState, useEffect, useRef } from "react";
import { Text, Button, StyleSheet, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import NavigationBar from "./NavigationButton/NavigationBar";
import { Dimensions } from "react-native";
import CalendarPicker from "react-native-calendar-picker"; // Import the calendar picker
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const SearchPage = ({ navigation }) => {
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [destination, setDestination] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [validationError, setValidationError] = useState("");
  const destinationInputRef = useRef(null);

  const toggleStartDatePicker = () => {
    setStartDatePickerVisible(!isStartDatePickerVisible);
  };

  const toggleEndDatePicker = () => {
    setEndDatePickerVisible(!isEndDatePickerVisible);
  };

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

  const formatDate = (date) => {
    return moment(date).format("DD MMMM YYYY");
  };

  const handleStartDateSelect = (date) => {
    setSelectedStartDate(date);
    setStartDatePickerVisible(false); // Collapse the calendar picker
  };

  const handleEndDateSelect = (date) => {
    setSelectedEndDate(date);
    setEndDatePickerVisible(false); // Collapse the calendar picker
  };

  const handleSearch = () => {
    if (!destination) {
      setValidationError("Please enter a destination.");
      return;
    }
    if (!selectedStartDate) {
      setValidationError("Please select a start date.");
      return;
    }

    if (!selectedEndDate) {
      setValidationError("Please select an end date.");
      return;
    }

    const startMoment = moment(selectedStartDate);
    const endMoment = moment(selectedEndDate);
    const currentMoment = moment();

    if (startMoment.isBefore(currentMoment)) {
      setValidationError("Start date must be the current date or later.");
      return;
    }

    if (endMoment.isSameOrBefore(startMoment)) {
      setValidationError("End date must be later than the start date.");
      return;
    }

    setValidationError("");

    retrieveData("username")
      .then((username) => {
        if (username) {
          const startDateString = selectedStartDate.toISOString().split("T")[0];
          const endDateString = selectedEndDate.toISOString().split("T")[0];
          setCreatedBy(retrieveData("username"));
          const requestBody = {
            startDate: startDateString,
            endDate: endDateString,
            cityName: destination,
            createdBy: username,
          };
          fetch("http://127.0.0.1:8000/api/trip/create/own", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          })
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else if (response.status === 400) {
                alert("Failed to create trip");
              }
            })
            .then((data) => {
              // Assuming the response contains the username
              const { trip_id } = data;
              navigation.navigate("ItineraryHome", {
                location: destination,
                startDate: startDateString,
                endDate: endDateString,
                trip_id: trip_id,
              });
            })
            .catch((error) => {
              console.error("Failed to create trip:", error);
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

  useEffect(() => {
    // Automatically focus on the destination input field when the page is opened
    destinationInputRef.current.focus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search destination. Eg. San Francisco"
        value={destination}
        onChangeText={(text) => setDestination(text)}
        style={styles.input}
        placeholderTextColor={"#381b42"}
        ref={destinationInputRef}
      />

      <Button
        title="Start Date"
        color="#8130b3"
        onPress={toggleStartDatePicker}
      />
      {isStartDatePickerVisible && (
        <CalendarPicker
          onDateChange={(date) => {
            handleStartDateSelect(date);
          }}
          width={Dimensions.get("window").width - 10}
        />
      )}
      {selectedStartDate && (
        <Text style={styles.dateText}>{formatDate(selectedStartDate)}</Text>
      )}

      <Button title="End Date" color="#8130b3" onPress={toggleEndDatePicker} />
      {isEndDatePickerVisible && (
        <CalendarPicker
          onDateChange={(date) => handleEndDateSelect(date)}
          width={Dimensions.get("window").width - 10}
        />
      )}
      {selectedEndDate && (
        <Text style={styles.dateText}>{formatDate(selectedEndDate)}</Text>
      )}

      <Pressable style={styles.button} onPress={handleSearch}>
        <Text style={styles.text}>Start Planning</Text>
      </Pressable>

      {validationError && (
        <Text style={styles.errorText}>{validationError}</Text>
      )}

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 90,
  },
  input: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width - 10,
    borderColor: "#381b42",
    shadowColor: "#381b42",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ebdcf5",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#381b42",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  date: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
  },
  dateText: {
    color: "black",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SearchPage;
