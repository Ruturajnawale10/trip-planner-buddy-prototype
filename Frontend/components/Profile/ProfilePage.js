import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userName } from "../../components/RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";

const ProfilePage = ({ navigation }) => {
  const [username, setUsername] = useRecoilState(userName);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
    navigation.navigate("Login");
  };

  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/profile.jpg")}
          style={styles.logo}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => handleNavigate("EditProfile")}>
          <Text style={[styles.linkText, styles.editProfile]}>
            Edit Profile{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("PreferenceScreen1")}>
          <Text style={styles.linkText}>Set Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("UpcomingTrips")}>
          <Text style={styles.linkText}>Upcoming Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("PastTrips")}>
          <Text style={styles.linkText}>Past Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("SharedTrips")}>
          <Text style={styles.linkText}>Shared Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.linkText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 40,
  },
  profileContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 60,
    marginBottom: 30,
  },
  username: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },
  linksContainer: {
    width: "100%",
    marginTop: 15,
  },
  linkText: {
    fontSize: 22,
    color: "#232b2b",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#8a8583",
    width: "100%",
    textAlign: "left",
    paddingLeft: 15,
  },

  editProfile: {
    borderTopWidth: 1, // Add border at the top
    paddingTop: 5, // Adjust padding for better spacing
  },
  contactInfo: {
    fontSize: 18, // Adjust the font size as needed
    marginBottom: 5, // Add some space between email and phone number
  },
  logo1: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
    paddingBottom: 50,
  },
});

export default ProfilePage;
