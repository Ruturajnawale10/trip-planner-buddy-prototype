import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const TopRatedCard = ({
  imageSource,
  tripName,
  startDate,
  pois,
  rating,
  totalRatings,
}) => {
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
    let starTypeSrc = [];
    for (let i = 0; i < fullStars; i++) {
      starTypeSrc.push(require("../../assets/SingleStar.png"));
    }

    if (halfStars === 1) {
      starTypeSrc.push(require("../../assets/HalfStar.png"));
    }

    const emptyStars = totalStars - fullStars - halfStars;
    for (let i = 0; i < emptyStars; i++) {
      starTypeSrc.push(require("../../assets/EmptyStar.png"));
    }

    return (
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <Text style={{ marginRight: 3 }}>
          {totalRatings > 0 ? averageRating.toFixed(1) : ""}
        </Text>
        <Image
          source={starTypeSrc[0]}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
        <Image
          source={starTypeSrc[1]}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
        <Image
          source={starTypeSrc[2]}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
        <Image
          source={starTypeSrc[3]}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />
        <Image
          source={starTypeSrc[4]}
          style={[styles.starIcon, { width: starSize, height: starSize }]}
        />

        <Text style={{ marginLeft: 3 }}>
          {totalRatings > 0 ? `(${totalRatings})` : "Not yet rated"}
        </Text>
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
            {" "}
            {totalPlaces} {place}
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
