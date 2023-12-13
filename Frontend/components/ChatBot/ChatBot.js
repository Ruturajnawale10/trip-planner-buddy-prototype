import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";

import { SafeAreaView } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Icon } from "@rneui/themed";
import { settings } from "../../configs/config";

const ChatBot = ({ navigation }) => {
  const { poi_name } = navigation.state.params;
  const [messages, setMessages] = useState([
    {
      _id: Math.round(Math.random() * 1000000),
      text: "Ask me anything about " + poi_name,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Trippy",
        // avatar: "https://placeimg.com/140/140/any",
      },
    },
  ]);

  const onSend = (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
    console.log(messages);
    // Handle sending messages to your chatbot backend here
    fetch(
      settings.BACKEND_URL + "/api/gpt/response?input=" +
        newMessages[0].text +
        +"\nIn context of " +
        poi_name,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("Message" + json);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.round(Math.random() * 1000000),
              text: json,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "Trippy",
                // avatar: "https://placeimg.com/140/140/any",
              },
            },
          ])
        );
      })
      .catch((error) => console.error(error));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{poi_name}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1, // Replace with a unique user id
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 50,
    backgroundColor: "#ffffff",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  chatbot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatbotText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ChatBot;
