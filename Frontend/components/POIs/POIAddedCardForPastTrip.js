import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import IconWithNumber from "../IconWithNumber";
import CarIcon from "react-native-vector-icons/AntDesign";
import WalkIcon from "react-native-vector-icons/FontAwesome5";
import BicycleIcon from "react-native-vector-icons/FontAwesome";

const POIAddedCardForPastTrip = ({
  item,
  index,
  day,
  removePOI,
  route_transport,
  route_loading,
}) => {
  var icon;
  if (route_transport == "driving") {
    icon = (
      <CarIcon name="car" size={25} color="grey" style={{ marginRight: 2 }} />
    );
  } else if (route_transport == "walking") {
    icon = (
      <WalkIcon
        name="walking"
        size={25}
        color="grey"
        style={{ marginRight: 2 }}
      />
    );
  } else {
    icon = (
      <BicycleIcon
        name="bicycle"
        size={25}
        color="grey"
        style={{ marginRight: 2 }}
      />
    );
  }
  return (
    <View>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <IconWithNumber iconName="map-marker" number={index + 1} />
          <Text style={styles.tripName}>{item.name}</Text>
          <Text style={styles.description}>
            {item.description != null && item.description.length < 90
              ? `${item.description}`
              : item.description != null
              ? `${item.description.substring(0, 90)}...`
              : ""}
          </Text>
          <View style={{ marginLeft: 50 }}>
            {/* <TouchableOpacity onPress={() => removePOI(item.poi_id, day)}>
              <Icon name="remove" size={25} color="#900" />
            </TouchableOpacity> */}
          </View>
        </View>
        <Image
          source={{
            uri:
              "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
              item.images[0],
          }}
          style={styles.image}
        />
      </View>
      {/* Add a horizontal line below the card */}
      {!route_loading ? (
        item.nextStep ? (
          <View style={styles.container}>
            <View style={styles.separator} />
            {icon}
            {/* <Text style={styles.text}></Text> */}
            <View style={styles.separator} />
            <Text style={styles.text}>
              Distance {item.nextStep ? item.nextStep.distance : ""}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.text}>
              Time {item.nextStep ? item.nextStep.duration : ""}
            </Text>
            <View style={styles.separator} />
          </View>
        ) : (
          <View style={styles.separator_full} />
        )
      ) : (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 8,
    marginBottom: 18,
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    justifyContent: "center",
  },
  tripName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 28,
    width: Dimensions.get("window").width - 150,
  },
  description: {
    flex: 1,
    fontSize: 16,
    color: "#767282",
    width: Dimensions.get("window").width - 150,
    numberOfLines: 2,
  },
  separator_full: {
    height: 1,
    backgroundColor: "#D3D3D3",
    borderRadius: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  toprow: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-between", // Space evenly between children
    paddingHorizontal: 30, // Add padding if needed
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    marginRight: 5, // Adjust the spacing between texts
    color: "#767282",
  },
  separator: {
    height: 1,
    width: "10%",
    backgroundColor: "#D3D3D3",
    borderRadius: 1,
    marginHorizontal: 5,
  },
});

export default POIAddedCardForPastTrip;
