import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";

const PreferenceScreen1 = ({ navigation }) => {
  // Sample data for the question and answer options
  const question = "What type of Places do you like?";
  const answerOptions = ["Monuments", "Parks", "Beaches", "Mountains"];

  // State to store the selected answer
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{question}</Text>
      
      {answerOptions.map((answer, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAnswerSelection(answer)}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: selectedAnswer === answer ? "blue" : "gray",
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <Text>{answer}</Text>
        </TouchableOpacity>
      ))}
      
      <Button
        title="Next"
        disabled={selectedAnswer === null} // Disable the button if no answer is selected
        onPress={() => navigation.navigate("PreferenceScreen2")}
      />
    </View>
  );
};

export default PreferenceScreen1;
