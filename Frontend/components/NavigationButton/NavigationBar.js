import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { SafeAreaView } from "react-native";
import NavigationButton from "./NavigationButton";

const NavigationBar = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.navButtons}>
      <NavigationButton
        bgColor="#F4727F"
        iconName="home"
        title="Home"
        page="HomePage"
        navigation={navigation}
      />
      <NavigationButton
        bgColor="#F4727F"
        iconName="search"
        title="Search"
        page="SearchPage"
        navigation={navigation}
      />
      <NavigationButton
        bgColor="#F4727F"
        iconName="person"
        title="Profile"
        page="ProfilePage"
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E9E3E4",
  },
});

export default NavigationBar;
