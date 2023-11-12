import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { DateFormat } from "../../utils/dateFormat.js";
import { ScrollView } from "react-native-gesture-handler";

const Weather = ({ navigation }) => {
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  const startDate2 = new Date();
  const formatted_start_date = DateFormat.format2(startDate2);
  const formatted_end_date = DateFormat.format2(endDate);
  const start_date = new Date(formatted_start_date);
  const [isForecastAvailable, setIsForecastAvailable] = useState(false);
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/trip/weather?location=${location}&start_date=${formatted_start_date}&end_date=${formatted_end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("HEre", json);
        setWeatherData(json.weatherData);
        setIsForecastAvailable(json.isForecastAvailable);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    // Render weather data as needed
    return (
      <View style={styles.container}>
        <ScrollView>
          {!isForecastAvailable && (
            <Text style={styles.forecast_msg_txt}>
              {" "}
              Forecast upto next 5 days from current date is available. Check 4
              days before start date of your trip for weather forcast data.
              Here's some information that you can use based on past data.
            </Text>
          )}
          <Text style={styles.text}>{weatherData}</Text>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 15,
  },
  forecast_msg_txt: {
    color: "gray",
  },
});

export default Weather;