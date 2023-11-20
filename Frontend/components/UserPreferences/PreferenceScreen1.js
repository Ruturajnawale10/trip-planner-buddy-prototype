import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import { ActivityIndicator } from "react-native";
import { userName } from "../RecoilStore/RecoilStore";
import { useRecoilState } from "recoil";

const PreferenceScreen1 = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0); // Index of the current question
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Array of the selected answers
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useRecoilState(userName);

  // Sample data for the question and answer options
  useEffect(() => {
    if (questions.length === 0) {
      fetch("http://127.0.0.1:8000/api/preference/questions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          for (let i = 0; i < json.length; i++) {
            setQuestions((questions) => [...questions, json[i]["question"]]);
            setAnswers((answers) => [...answers, json[i]["options"]]);
          }
          setLoaded(true);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  // State to store the selected answer
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = (index, selectedAnswer) => {
    // Add the selected answer to the array of selected answers

    setSelectedAnswers((selectedAnswers) => [
      ...selectedAnswers,
      selectedAnswer,
    ]);
    // If there are more questions, go to the next question
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      fetch("http://127.0.0.1:8000/update/preferences/" + username, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: selectedAnswers,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          navigation.navigate("PreferenceScreen2", {
            selectedAnswers: selectedAnswers,
          });
        })
        .catch((error) => console.error(error));

      // Else, go to the next screen
    }
  };

  return (
    <SafeAreaView>
      {loaded ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 20 }}>
            {questions[index]}
          </Text>

          {answers[index].map((answer) => (
            <TouchableOpacity
              key={answer}
              style={{
                backgroundColor: selectedAnswer === answer ? "#00ff00" : "#fff",
                padding: 10,
                width: 200,
                alignItems: "center",
                marginVertical: 10,
              }}
              onPress={() => handleAnswerSelection(answer)}
            >
              <Text>{answer}</Text>
            </TouchableOpacity>
          ))}

          <Button
            title="Next"
            disabled={selectedAnswer === null} // Disable the button if no answer is selected
            onPress={() => {
              handleNext(index, selectedAnswer);
            }}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </SafeAreaView>
  );
};

export default PreferenceScreen1;
