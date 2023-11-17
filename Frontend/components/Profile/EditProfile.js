import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSaveChanges = () => {
    // Implement logic to save changes to user profile
    // For demonstration purposes, log the changes to the console
    console.log("Changes saved:", { username, email, phoneNumber });
    // Navigate back to the profile page
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        style={styles.input}
      />

      <Button title="Save Changes" onPress={handleSaveChanges} />

      {/* Add a cancel or go back button if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default EditProfile;
