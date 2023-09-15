import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import DateRangePicker from './DateRangePicker'; // Import your custom DateRangePicker component

const SearchPage = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    // Implement your search logic here, using destination and selectedDates
    // You can use selectedDates.start and selectedDates.end for the date range
    console.log('Destination:', destination);
    console.log('Selected Start Date:', selectedDates.start);
    console.log('Selected End Date:', selectedDates.end);
    // Perform the search based on user input
  };

  return (
    <View style={styles.container}>
      <Text>Destination:</Text>
      <TextInput
        placeholder="Enter destination"
        value={destination}
        onChangeText={(text) => setDestination(text)}
        style={styles.input}
      />

      <Text>Select Start and End Dates:</Text>
      <DateRangePicker selectedDates={selectedDates} setSelectedDates={setSelectedDates} />

      <Button title="Search Plans" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default SearchPage;
