import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {color} from "../custom_colors/colors";

const IconWithNumber = ({ iconName, number }) => {
  return (
    <View style={styles.container}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{number}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  numberContainer: {
    position: "absolute",
    top: -2,
    marginTop: 0,
    backgroundColor: color.purple,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  number: {
    fontSize: 14,
    color: "#fff",
  },
});

export default IconWithNumber;
