// LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error storing data:', error);
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
      fetch('http://127.0.0.1:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (response.status === 200) {
            // Successful login, parse the response JSON
            return response.json();
          } else {
            // Invalid credentials or other error, show an alert
            alert('Invalid credentials');
            throw new Error('Invalid credentials');
          }
        })
        .then((data) => {
          // Assuming the response contains the username
          const { username } = data;
          storeData('username', username);
          // Navigate to the "HomePage" with the username
          navigation.navigate('HomePage', { userIsLoggedIn: true });
        })
        .catch((error) => {
          console.error('Login failed:', error);
        });
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Sign up
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
  input: {
    width: "80%",
    height: 40,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default LoginScreen;
