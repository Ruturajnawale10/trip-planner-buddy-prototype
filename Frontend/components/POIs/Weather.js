import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { settings } from "../../configs/config.js";
import { DateFormat } from "../../utils/dateFormat.js";

const Weather = ({ navigation }) => {
  const { location, startDate, endDate, trip_id } = navigation.state.params;
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const startDate2 = new Date();
    const formatted_start_date = DateFormat.format2(startDate2);
    const start_date = new Date(formatted_start_date);

    const currentDate = new Date();
    const four_day_from_now = new Date(currentDate);
    four_day_from_now.setDate(currentDate.getDate() + 4);

    if (start_date > four_day_from_now) {
      console.log("Weather is not available for the next 4 days.");
      setLoading(false);
      return;
    } else {
      console.log("Fetching weather data...");
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${settings.openweather_api_key}`
    )
      .then((response) => response.json())
      .then((weatherData) => {
        console.log("Weather data fetched successfully.");
        setWeatherData(weatherData.list);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching weather data: ", error));
  }, [location, startDate]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    // Render weather data as needed
    return (
      <View style={styles.container}>
        {/* Render weather data here */}
        {weatherData.map((data, index) => (
          <Text key={index}>
            {data.dt_txt}: {data.weather[0].main}
          </Text>
        ))}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Weather;
