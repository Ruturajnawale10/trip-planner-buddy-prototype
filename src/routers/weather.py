from datetime import date
from fastapi import APIRouter
from configs.configs import settings
from datetime import datetime, timedelta
import requests

import openai

openai.api_key = settings.gpt_key

router = APIRouter(
    tags=['Trip Weather']
)

@router.get("/api/trip/weather")
def weather_recommendation(location: str, start_date: date, end_date: date):
    print("Inside Weather API.")
    print(location, start_date, end_date)
    current_date = datetime.now().date()
    four_days_from_now = current_date + timedelta(days=4)
    is_forecast_available = False

    if start_date > four_days_from_now:
        print("Weather is not available for the next 4 days.")
        prompt_str = f"Considering past weather conditions in {location} city from {start_date} tp {end_date}, write weather summary, clothing recommendations for the trip, and any other suggestions for the trip.\n "
        gpt_response = gpt(prompt_str)       

        return {"isForecastAvailable": is_forecast_available,"weatherData":gpt_response}
    else:
        is_forecast_available = True
        print("Fetching weather data...")
        url = "https://api.openweathermap.org/data/2.5/forecast?"

        payload = {"q": location, "appid": settings.openweather_api_key}
        print(location, start_date, end_date)

        weather_data = requests.request("GET", url, params=payload).json()
        filtered_data = []

        for forecast in weather_data['list']:
            forecast_date = datetime.utcfromtimestamp(forecast['dt']).date()
            if start_date <= forecast_date <= end_date:
                filtered_data.append(forecast)
        
        prompt_str = f"Given weather forecast data for the dates in {location} city, write weather summary, clothing recommendations for the trip, and any other suggestions for the trip.\n The weather forecast data is as follows: {filtered_data}"
        gpt_response = gpt(prompt_str)       

        return {"isForecastAvailable": is_forecast_available,"weatherData":gpt_response}

def gpt(prompt_str):
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt_str,
        temperature=0.7,
        max_tokens=800,
    )

    return response.choices[0].text