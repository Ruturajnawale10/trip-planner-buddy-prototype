import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import NavigationBar from "../NavigationButton/NavigationBar";

const ProfilePage = ({ navigation }) => {
  const handleEditProfile = () => {
    // Navigate to the "Edit Profile" page
    navigation.navigate("EditProfile");
  };

  const handleSignOut = () => {
    // Perform sign-out logic here (e.g., clear user session, navigate to login screen)
    // For demonstration purposes, let's just navigate to the login screen
    navigation.navigate("Login");
  };

  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.profileContainer}>
      <Image
        source={require("../../assets/profile.png")} // Update the path to your logo image
        style={styles.logo}
      />
        <Text style={styles.username}>Roshan</Text>
        <Text>roshan.chokshi@gmail.com</Text>
        <Text>123-456-7890</Text>
        <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => handleNavigate("EditProfile")}>
          <Text style={styles.linkText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity onPress={() => handleNavigate("PreferenceScreen1")}>
          <Text style={styles.linkText}>Set Preferences</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity onPress={() => handleNavigate("UpcomingTrips")}>
          <Text style={styles.linkText}>Upcoming Trips</Text>
        </TouchableOpacity>
        <View style={styles.line} />

        <TouchableOpacity onPress={() => handleNavigate("PastTrips")}>
          <Text style={styles.linkText}>Past Trips</Text>
        </TouchableOpacity>
        <View style={styles.line} />

        <TouchableOpacity onPress={() => handleNavigate("SharedTrips")}>
          <Text style={styles.linkText}>Shared Trips</Text>
        </TouchableOpacity>
        <View style={styles.line} />

        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.linkText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={styles.line} />
      </View>
      </View>

      

      <NavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  profileContainer: {
    alignItems: "center",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  linksContainer: {
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  linkText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ce7e00",
    paddingVertical: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
    marginVertical: 5,
  },
});

export default ProfilePage;
