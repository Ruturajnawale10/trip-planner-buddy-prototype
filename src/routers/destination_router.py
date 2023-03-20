from fastapi import APIRouter
import requests
import json
from src.configs.configs import settings

router = APIRouter(
    tags = ['Destination']
)

@router.get("/destination/{destination}")
def places_list(destination: str):
    destination_coordinates = get_coordinates(destination)
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"

    payload={"location": destination_coordinates, "radius": "50000", "type": "tourist_attraction", "key": settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()
    place_ids = []

    for place in response['results'][:10]:
        place_ids.append(place['place_id'])

    print(place_ids)

    distance_matrix = get_distance_matrix(place_ids)
    

    return {"poi": "wow"}


def get_coordinates(destination: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json?"

    payload={"address": destination, "key": settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()
    coordinates = response['results'][0]['geometry']['location']
    coordinates_str = str(coordinates['lat']) + ', ' + str(coordinates['lng'])

    return coordinates_str

def get_distance_matrix(place_ids):
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?"

    place_ids_prefixed= ['place_id:' + place_id for place_id in place_ids]
    places = "|".join(place_ids_prefixed)

    payload={'origins': places, 'destinations': places, 'key': settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()
    print(json.dumps(response, indent = 3))
