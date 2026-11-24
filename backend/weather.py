import requests
import os
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

def get_ski_weather(destination: str) -> dict:
    if not WEATHER_API_KEY:
        return {"error": "Na strežniku manjka WEATHER_API_KEY."}
    try:
        geo_url = "https://api.openweathermap.org/geo/1.0/direct"
        geo_params = {
            "q": destination.split(",")[0].strip(),  # just use city name
            "limit": 1,
            "appid": WEATHER_API_KEY
        }
        response = requests.get(geo_url, params=geo_params, timeout=10)
        response.raise_for_status()
        geo_response = response.json()

        if not geo_response or len(geo_response) == 0:
            return {"error": f"Location '{destination}' not found"}

        lat = geo_response[0]["lat"]
        lon = geo_response[0]["lon"]

        weather_url = "https://api.openweathermap.org/data/2.5/forecast"
        weather_params = {
            "lat": lat,
            "lon": lon,
            "appid": WEATHER_API_KEY,
            "units": "metric",
            "cnt": 5
        }

        response = requests.get(weather_url, params=weather_params, timeout=10)
        response.raise_for_status()
        weather_data = response.json()

        forecasts = []
        for item in weather_data.get("list", [])[:5]:
            forecasts.append({
                "date": item["dt_txt"],
                "temp": item["main"]["temp"],
                "feels_like": item["main"]["feels_like"],
                "condition": item["weather"][0]["description"],
                "snow": item.get("snow", {}).get("3h", 0),
                "wind_speed": item["wind"]["speed"]
            })

        return {"location": destination, "forecasts": forecasts}

    except (requests.RequestException, ValueError, KeyError, TypeError):
        return {"error": "Vremenska storitev trenutno ni dosegljiva. Preveri ključ in poskusi znova."}
