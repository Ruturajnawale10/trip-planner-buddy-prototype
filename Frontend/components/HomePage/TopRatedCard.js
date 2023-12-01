import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const TopRatedCard = ({ imageSource, tripName, startDate, pois, rating }) => {
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

  const calculateAverageRating = () => {
    return rating;
  };
  
  

  const renderStars = (averageRating) => {
    const totalStars = 5;
    const fullStars = Math.floor(averageRating);
    const halfStars = Math.ceil(averageRating - fullStars);
    const stars = [];
    const starSize = 20; // Set the desired size for your stars
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={i}
          source={require('../../assets/SingleStar.png')}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }
  
    if (halfStars === 1) {
      stars.push(
        <Image
          key="half"
          source={require('../../assets/HalfStar.png')}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }
  
    const emptyStars = totalStars - fullStars - halfStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty${i}`}
          source={require('../../assets/EmptyStar.png')}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
      );
    }
  
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars}
      </View>
    );
  };
  
  
  const averageRating = calculateAverageRating();
  const stars = renderStars(averageRating);

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
          <Text style={styles.startDate}>
             {" "}{totalPlaces} {place}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{stars}</View>
          </View>
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

export default TopRatedCard;
