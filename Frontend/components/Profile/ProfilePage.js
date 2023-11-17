import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EditProfile from "./EditProfile"; // Import your EditProfile component
import UpcomingTrips from "../POIs/UpcomingTrips";
import PastTrips from "../POIs/PastTrips";
import SharedTrips from "../POIs/SharedTrips";
import NavigationBar from "../NavigationButton/NavigationBar";
const Tab = createMaterialTopTabNavigator();

const ProfilePage = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("CurrentTrips"); // Default selected tab

  // Sample user information
  const userProfile = {
    photo: ("./Capture.JPG"), // Use your actual image path
    username: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
  };

  const handleEditProfile = () => {
    // Navigate to the "Edit Profile" page
    navigation.navigate("EditProfile");
  };

  const handleSignOut = () => {
    // Perform sign-out logic here (e.g., clear user session, navigate to login screen)
    // For demonstration purposes, let's just navigate to the login screen
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image source={userProfile.photo} style={styles.profilePhoto} />
        <Text style={styles.username}>{userProfile.username}</Text>
        <Text>{userProfile.email}</Text>
        <Text>{userProfile.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <UpcomingTrips></UpcomingTrips>
      <PastTrips></PastTrips>
      <SharedTrips></SharedTrips>
      
      <NavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: "#412a47",
    fontWeight: "bold",
    marginLeft: 10,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
export default ProfilePage;
