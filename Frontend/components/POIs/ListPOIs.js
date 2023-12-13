import React, { useEffect, useState, useRef } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native";
import POIsCard from "./POIsCard";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "@rneui/themed";
import { settings } from "../../configs/config";

const ListPOIs = ({
  navigation,
  data,
  setData,
  currentData,
  recommendations,
  day,
  removePOI,
  addPOI,
  setScrollX,
  scrollViewRef,
  address,
  radius,
}) => {
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const [load, setLoad] = useState(false);
  const [tags, setTags] = useState(new Set());
  const [currentTag, setCurrentTag] = useState("All");
  const [tagSearchText, setTagSearchText] = useState("");
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
      item.show = true;
      item.type.map((tag) => {
        tags.add(tag);
      });
    });
    data.pois.sort((a, b) => {
      return b.recommended - a.recommended;
    });
    setData(data);
    setLoad(true);
  };

  const onTagPress = (tag) => () => {
    setCurrentTag(tag);
    if (tag === "All" || tag === currentTag) {
      data.pois.map((item) => {
        item.show = true;
      });
      return;
    }
    data.pois.map((item) => {
      if (item.type.includes(tag)) {
        item.show = true;
      } else {
        item.show = false;
      }
    });
  };

  const tagSearch = (text) => {
    setLoad(false);
    if (text === "") {
      data.pois.map((item) => {
        item.show = true;
      });
      setLoad(true);
      return;
    }
    fetch(
      settings.BACKEND_URL + "/api/get/gpt/runtime/recommendation?user_input=" +
        text +
        "&address=" +
        address +
        "&radius=" +
        radius,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        data.pois.map((item) => {
          if (json.includes(item.poi_id)) {
            item.show = true;
          } else {
            item.show = false;
          }
        });
        setLoad(true);
      })
      .catch((error) => console.error(error));
  };

  const onChangeTagSearch = (e) => {
    setTagSearchText(e.nativeEvent.text);
  };

  const removeExistingPOIs = () => {
    var pois = [];
    Array.from(currentData, ([key, value]) => {
      value.map((item) => {
        pois.push(item.poi_id);
      });
    });
    console.log(pois);
    data.pois.map((item) => {
      if (pois.includes(item.poi_id)) {
        item.added = true;
      }
    });
  };

  useEffect(() => {
    integrateRecommendations();
    removeExistingPOIs();
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true}>
        <TouchableOpacity
          key={"All" + day}
          style={currentTag === "All" ? styles.tagSelected : styles.tag}
          onPress={onTagPress("All")}
        >
          <Text
            style={
              currentTag === "All" ? { color: "white" } : { color: "#412a47" }
            }
          >
            {"All"}
          </Text>
        </TouchableOpacity>
        {Array.from(tags).map((tag) => (
          <TouchableOpacity
            key={tag + day}
            style={currentTag === tag ? styles.tagSelected : styles.tag}
            onPress={onTagPress(tag)}
          >
            <Text
              style={
                currentTag === tag ? { color: "white" } : { color: "#412a47" }
              }
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.taginput}
          placeholder="Type what you want"
          onChange={(e) => onChangeTagSearch(e)}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => tagSearch(tagSearchText)}
        >
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {load ? (
        <ScrollView
          horizontal={true}
          ref={scrollViewRef}
          onScroll={(event) => {
            setScrollX(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={16}
        >
          {data.pois.map(
            (item, index) =>
              item.show &&
              !item.added && (
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
              )
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
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
  taginput: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width * 0.75,
    borderColor: "#DBD9D9",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    marginRight: 0,
    display: "flex",
  },
  tag: {
    backgroundColor: "#E9E3E4",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  tagSelected: {
    backgroundColor: "#412a47",

    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
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
