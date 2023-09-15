import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const DateRangePicker = () => {
  const [selectedDates, setSelectedDates] = useState({});

  const onDayPress = (day) => {
    // Determine whether to set the selected date as the start or end date
    const updatedDates = { ...selectedDates };
    if (!updatedDates.start) {
      updatedDates.start = day.dateString;
    } else {
      updatedDates.end = day.dateString;
    }
    setSelectedDates(updatedDates);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={selectedDates}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default DateRangePicker;
