import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native";
import { ActivityIndicator } from "react-native";
import { userName } from "../RecoilStore/RecoilStore";
import NavigationBar from "../NavigationButton/NavigationBar";
import { useRecoilState } from "recoil";

const PreferenceScreen1 = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0); // Index of the current question
  // const [selectedAnswers, setSelectedAnswers] = useState([]); // Array of the selected answers
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useRecoilState(userName);

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // Function to handle answer selection
  const handleAnswerSelection = (answer) => {
    // Check if the answer is already selected
    const isAnswerSelected = selectedAnswers.includes(answer);

    if (isAnswerSelected) {
      // If selected, remove the answer from the selected answers array
      setSelectedAnswers((prevSelectedAnswers) =>
        prevSelectedAnswers.filter((selectedAnswer) => selectedAnswer !== answer)
      );
    } else {
      // If not selected, add the answer to the selected answers array
      setSelectedAnswers((prevSelectedAnswers) => {
        // Check if the answer is already present to avoid duplication
        if (!prevSelectedAnswers.includes(answer)) {
          return [...prevSelectedAnswers, answer];
        }
        return prevSelectedAnswers;
      });
    }
  };

  // Function to check if an answer is selected
  const isAnswerSelected = (answer) => {
    return selectedAnswers.includes(answer);
  };

  const flattenArray = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
  };
  
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

  // const handleAnswerSelection = (answer) => {
  //   setSelectedAnswer(answer);
  // };

  const handleNext = (index, selectedAnswer) => {
    // Add the selected answer to the array of selected answers
    setSelectedAnswers((selectedAnswers) => [
      ...selectedAnswers,
      selectedAnswer,
    ]);
    const updatedSelectedAnswers = flattenArray([...selectedAnswers, selectedAnswer]);
    const uniqueSelectedAnswers = [...new Set(flattenArray([...updatedSelectedAnswers, updatedSelectedAnswers]))];
    // If there are more questions, go to the next question
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      console.log(uniqueSelectedAnswers);
      fetch("http://127.0.0.1:8000/update/preferences/" + username, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: uniqueSelectedAnswers,
        }),
      })
        .then((response) => response.json()
        )
        .then((json) => {
          navigation.navigate("PreferenceScreen2");
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <Image
        source={require("../../assets/logo.png")} // Update the path to your logo image
        style={styles.logo}
      />
      {loaded ? (
        <View style={styles.content}>
          <Text style={styles.question}>{questions[index]}</Text>

          {answers[index].map((answer) => (
            <TouchableOpacity
              key={answer}
              style={[
                styles.answerOption,
                isAnswerSelected(answer) && styles.selectedAnswer, // Apply selected style if answer is selected
              ]}
              onPress={() => handleAnswerSelection(answer)}
            >
              <Text style={styles.answerText}>{answer}</Text>
            </TouchableOpacity>
          ))}

      <TouchableOpacity
        style={[styles.button, { width: 200 }]} // Adjust the width as needed
        disabled={selectedAnswers.length === 0}
        onPress={() => {
          handleNext(index, selectedAnswers);
        }}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 40,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 22,
    marginBottom: 20,
    alignSelf: "center", 
  },
  answerOption: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ce7e00",
    padding: 10,
    width: 200,
    alignItems: "center",
    marginVertical: 10,
  },
  selectedAnswer: {
    borderColor: "#ce7e00", // Color for the border around the selected answer
    borderWidth: 2, // Border width
    borderRadius: 8,    

  },
  answerText: {
    color: "#000",
    fontSize: 17,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
  button: {
    color: "#000",
    marginTop: 20, // Add some space above the button
    width: 300, // Set the width of the button
    borderRadius: 5, // Add border radius
    backgroundColor: "#ce7e00", // Change button background color
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },

});

export default PreferenceScreen1;
