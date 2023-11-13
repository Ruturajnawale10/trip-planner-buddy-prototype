import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const PreferenceScreen2 = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{ flex: "1", alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ fontSize: 30, marginBottom: 20 }}>
        User preferences configured.
      </Text>

      <Button
        title="Home"
        onPress={() =>
          navigation.navigate("HomePage", { userIsLoggedIn: true })
        }
      />
    </SafeAreaView>
  );
};

export default PreferenceScreen2;
