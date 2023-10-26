// LoginScreen.js
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const usernameInputRef = useRef(null);

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("Data stored successfully");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const handleLogin = () => {
    // Static user data for demonstration
    // Prepare the request body
    const requestBody = {
      username: email, // Assuming 'email' in your state corresponds to the username
      password: password,
    };
    console.log(requestBody);
    // Make a POST request to the sign-in API
    fetch("http://127.0.0.1:8000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.status === 200) {
          // Successful login, parse the response JSON
          return response.json();
        } else {
          // Invalid credentials or other error, show an alert
          alert("Invalid credentials");
          throw new Error("Invalid credentials");
        }
      })
      .then((data) => {
        // Assuming the response contains the username
        const { username } = data;
        storeData("username", username);
        // Navigate to the "HomePage" with the username
        navigation.navigate("HomePage", { userIsLoggedIn: true });
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  handleUsernameChange = (text) => {
    // Convert the input to lowercase before setting it in the state.
    setEmail(text.toLowerCase());
  };

  return (
    <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/logo.png")} // Update the path to your logo image
          style={styles.logo}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Login</Text>
        <TextInput
          placeholder="Username"
          value={email}
          onChangeText={this.handleUsernameChange}
          ref={usernameInputRef}
          style={[styles.input, { width: "80%" }]} // Increase the width
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { width: "80%" }]} // Increase the width
        />
        <Button
          title="Login"
          onPress={handleLogin}
          color="blue" // Set the text color to white
          style={styles.loginButton} // Apply custom styles
        />
      </View>
      <Text onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Create Account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    width: "80%", // Increase the width of the input container
    marginTop: 20, // Adjust this margin to create a space between the image and the form
  },
  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    marginVertical: 10,
    fontSize: 16,
  },
  loginButton: {
    // Define your custom button styles here
    backgroundColor: "orange", // Background color
    borderRadius: 10, // Rounded corners
    padding: 8, // Padding (smaller)
    width: "60%", // Decrease the width of the button
    alignSelf: "center", // Center the button horizontally
  },
  logo: {
    width: 300,
    height: 120,
  },
});
export default LoginScreen;
