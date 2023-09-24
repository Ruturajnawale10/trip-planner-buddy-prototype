// SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = {
    primaryBackground: 'orange', // Change this color to your desired shade of orange
    // Define other theme colors and styles here if needed
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const handleSignup = () => {
    // Prepare the request body
    const requestBody = {
      username: email, // Assuming 'email' is the username
      password: password,
    };

    // Make a POST request to the sign-up API
    fetch('http://127.0.0.1:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.status === 200) {
          // Successful signup
          return response.json();
        } else if (response.status === 400) {
          // Conflict status code (email already exists)
          alert('Email already exists. Please use a different email.');
        } else {
          // Handle other error cases as needed
          alert('Signup failed. Please try again.');
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
        console.error('Signup failed:', error);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryBackground }]}>
      <View style={styles.inputContainer}>
        <Text>Create Account</Text>
        <TextInput
          placeholder="Username"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { width: '80%' }]} // Increase the width
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { width: '80%' }]} // Increase the width
        />
        <Button
          title="Create Account"
          onPress={handleSignup}
          color="blue" // Set the text color to white
          style={styles.loginButton} // Apply custom styles
        />
      </View>
      <Text onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%', // Increase the width of the input container
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  signupButton: {
    backgroundColor: 'orange', // Background color
    borderRadius: 10, // Rounded corners
    padding: 12, // Padding (custom)
    width: '60%', // Button width
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: 18, // Text size
    fontWeight: 'bold', // Bold text
  },
});

export default SignupScreen;
