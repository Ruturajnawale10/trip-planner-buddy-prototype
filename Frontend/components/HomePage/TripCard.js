import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const TripCard = ({ imageSource, tripName, startDate, pois }) => {
  let startDateString = "";
  if (startDate == null || startDate == undefined || startDate == "") {
    startDateString = "";
  } else {
    const date = new Date(startDate);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    startDateString =
      date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
  }

  let totalPlaces = 0;
  let place = "places";
  if (pois != null) {
    for (let i = 0; i < pois.length; i++) {
      totalPlaces += pois[i].length;
    }
    if (totalPlaces == 1) {
      place = "place";
    }
  }

  return (
    <View>
      <View style={styles.card}>
        <Image
          source={{
            uri: imageSource,
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.tripName}>{tripName}</Text>
          <Text style={styles.startDate}>{startDateString}</Text>
          <Text style={styles.startDate}>
            {totalPlaces} {place}
          </Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  startDate: {
    fontSize: 16,
    color: "#837b85",
  },
  separator: {
    height: 1,
    backgroundColor: "#D3D3D3", // Color of the separator line
    marginVertical: 16, // Adjust the margin as needed
  },
});

export default TripCard;
