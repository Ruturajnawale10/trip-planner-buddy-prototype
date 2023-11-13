import React, { useEffect, useState, useRef } from "react";

import { View, StyleSheet, ScrollView, Text, Dimensions } from "react-native";

import { SafeAreaView } from "react-native";
import POIsCard from "./POIsCard";

const ListPOIs = ({
  navigation,
  data,
  setData,
  recommendations,
  day,
  removePOI,
  addPOI,
  setScrollX,
  scrollViewRef,
}) => {
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const [load, setLoad] = useState(false);
  const onPress = () => {
    console.log("pressed");
  };

  const integrateRecommendations = () => {
    data.pois.map((item) => {
      if (recommendations.includes(item.poi_id)) {
        item.recommended = true;
      } else {
        item.recommended = false;
      }
    });
    data.pois.sort((a, b) => {
      return b.recommended - a.recommended;
    });
    setData(data);
    setLoad(true);
  };

  useEffect(() => {
    integrateRecommendations();
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      {load ? (
        <ScrollView
          horizontal={true}
          ref={scrollViewRef}
          onScroll={(event) => {
            setScrollX(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={16}
        >
          {data.pois.map((item) => (
            <View key={item.poi_id} style={styles.poiCard}>
              <POIsCard
                imageID={item.images[0]}
                poi_name={item.name}
                poi_id={item.poi_id}
                recommended={item.recommended}
                navigation={navigation}
                addPOI={addPOI}
                removePOI={removePOI}
                item={item}
                onPress={onPress}
                day={day}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
  input: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width - 20,
    borderColor: "#DBD9D9",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    display: "flex",
  },
  text: {
    fontSize: 20,
    textAlign: "left",
    color: "#412a47",
    fontWeight: "bold",
    marginLeft: 20,
  },
  submitButton: {
    backgroundColor: "#F4727F",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
});

export default ListPOIs;
