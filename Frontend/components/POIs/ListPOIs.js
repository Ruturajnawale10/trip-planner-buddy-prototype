import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";
import POIsCard from "./POIsCard";

const ListPOIs = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [flag, setFlag] = useState(false);

  //   const route = useRoute();
  //   console.log(navigation.state.params.location);
  const [data, setData] = useState([]);
  const { location, startDate, endDate } = navigation.state.params;
  //   const { destination, startDate, endDate } = route.params;
  const onPress = () => {
    console.log("pressed");
  };

  const getPOIs = (location) => {
    fetch("http://127.0.0.1:8000/api/destination/" + location, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setFlag(true);
        // console.log(json);
      })
      .catch((error) => console.error(error));
  };
  getPOIs(location);

  //   useEffect(() => {
  //     console.log(data.city_name);
  //   }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Destination:</Text>
      <TextInput
        placeholder="Enter destination"
        value={data.city_name}
        onChangeText={(text) => setDestination(text)}
        style={styles.input}
      />
      {flag && (
        <ScrollView>
          {data.pois.map((item) => (
            <View key={item.id}>
              <POIsCard
                onPress={onPress}
                bgColor="#F4727F"
                title={item.name}
                imageID={item.images[0]}
                rating={item.rating}
                description={item.description}
              />
            </View>
          ))}
        </ScrollView>
      )}

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E3E4",
    display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  input: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width - 10,
    borderColor: "#DBD9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    display: "flex",
  },
  text: {
    fontSize: 20,
    textAlign: "left",
    color: "#F4727F",
    fontWeight: "bold",
  },
});

export default ListPOIs;
