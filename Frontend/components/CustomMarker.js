import { View, Text, StyleSheet } from "react-native";

function CustomMarker({ rank, name }) {
  return (
    <View style={styles.numberTop}>
      <Text style={styles.text}>{rank}</Text>
    </View>
  );
}
//styles for our custom marker.
const styles = StyleSheet.create({
  numberTop: {
    // paddingVertical: 3,
    // paddingHorizontal: 3,
    backgroundColor: "#d1c9d4",
    borderColor: "#eee",
    borderRadius: 100,
    width: 20,
    height: 20,
  },
  text: {
    color: "#000",
    textAlign: "center",
  },
});

export default CustomMarker;
