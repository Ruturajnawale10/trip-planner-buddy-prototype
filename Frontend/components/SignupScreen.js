// SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    fetch('http://192.168.56.1:8000/signup', {
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
    <View style={styles.container}>
      <Text>Signup</Text>
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
      <Button title="Sign up" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default SignupScreen;
