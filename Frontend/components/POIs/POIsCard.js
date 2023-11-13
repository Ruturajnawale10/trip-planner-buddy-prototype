// A card component with changable data and click event

import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, Text, View, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const POIsCard = ({
  imageID,
  poi_name,
  poi_id,
  recommended,
  navigation,
  addPOI,
  removePOI,
  item,
  day,
}) => {
  const handleAddPress = (poi_id, day) => {
    console.log("add pressed", poi_id);
    addPOI(poi_id, day);
  };

  const handleDetailsPress = (item, day) => {
    navigation.navigate("POIs", { item, addPOI, day, recommended });
  };

  const notRecommendedCard = (
    <TouchableOpacity onPress={() => handleDetailsPress(item)}>
      <View style={styles.card}>
        <Image
          source={{
            uri:
              "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
              imageID,
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.poiName}>{poi_name}</Text>
        </View>
        <TouchableOpacity onPress={() => handleAddPress(poi_id, day)}>
          <AntDesign style={styles.add} name="pluscircle" size={38} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const recommendedCard = (
    <TouchableOpacity onPress={() => handleDetailsPress(item)}>
      <View style={styles.recommendedCard}>
        <Image
          source={{
            uri:
              "https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/" +
              imageID,
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.poiName}>{poi_name}</Text>
        </View>
        <TouchableOpacity onPress={() => handleAddPress(poi_id, day)}>
          <AntDesign style={styles.add} name="pluscircle" size={38} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return <View>{recommended ? recommendedCard : notRecommendedCard}</View>;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    borderStyle: "dashed",
    marginBottom: 16,
    alignItems: "center",
    marginLeft: 10,
  },
  recommendedCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#f9a03f",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  poiName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    width: 150,
  },
  add: {
    marginRight: 10,
    color: "#9b87a1",
  },
});
export default POIsCard;
