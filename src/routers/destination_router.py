from fastapi import APIRouter
import requests
from src.configs.configs import settings

router = APIRouter(
    tags = ['Destination']
)

@router.get("/destination/{destination}")
def places_list(destination: str):
    destination_coordinates = get_coordinates(destination)
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"

    payload={"location": destination_coordinates, "radius": "1500", "type": "restaurant", "key": settings.google_api_key}

    response = requests.request("GET", url, params=payload)

    print(response.text)
    return {"poi": response.text}
    return {"hello": "world"}

def get_coordinates(destination: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json?"

    payload={"address": destination, "key": settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()
    coordinates = response['results'][0]['geometry']['location']
    coordinates_str = str(coordinates['lat']) + ', ' + str(coordinates['lng'])

    return coordinates_str