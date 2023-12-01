import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
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
  const [weatherIconURL, setWeatherIconURL] = useState(null);
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
        let main_weather_icon = json.main_weather_icon;
        let main_weather_icon_url =
          "https://openweathermap.org/img/wn/" + main_weather_icon + "@4x.png";
        setWeatherIconURL(main_weather_icon_url);
        console.log(
          "HEreeee",
          json.weatherData.main_weather_icon,
          main_weather_icon_url,
          weatherIconURL
        );
        const patterns = [
          "Weather Summary",
          "Weather summary",
          "weather Summary",
          "weather summary",
        ];

        // Create a regular expression pattern by joining the phrases with the OR operator (|) and using the 'i' flag for case-insensitivity
        const pattern = new RegExp(
          patterns
            .map((p) => "(" + p.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")")
            .join("|"),
          "i"
        );

        // Find the index of the first match
        const match = json.weatherData.match(pattern);

        if (match) {
          setWeatherData(json.weatherData.slice(match.index));
        } else {
          setWeatherData(json.weatherData);
        }
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
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={{ height: 0, width: 0 }}>{weatherIconURL}</Text>
          <Image source={{ uri: weatherIconURL }} style={styles.image} />
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
    backgroundColor: "#87CEEB",
  },
  text: {
    fontSize: 20,
  },
  forecast_msg_txt: {
    color: "gray",
  },
  image: {
    width: 130,
    height: 130,
    alignSelf: "center",
  },
});

export default Weather;
