from fastapi import APIRouter
import requests
import json
from src.configs.configs import settings
from src.middleware.tsp_solver import SimpleTSP

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

    distance_matrix, places_id_names = get_distance_matrix(place_ids)
    print(distance_matrix)

    tsp = SimpleTSP(distance_matrix)
    min_cost = tsp.runTSP(0)
    shortest_path = tsp.getBestPath()

    shortest_path_names = []
    for i in range(len(shortest_path)):
        shortest_path_names.append(places_id_names[shortest_path[i]])
    
    shortest_path_names.append(places_id_names[shortest_path[0]])

    tsp.printBestPath()

    print("Shortest Path for POIs is ", shortest_path)
    print("Minimum cost is ", min_cost)
    

    return {"Shortest Path for POIs is ": shortest_path_names}



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

    places_id_names = {}
    for i, id in enumerate(place_ids):
        places_id_names[i] = response['destination_addresses'][place_ids.index(id)]

    distance_matrix = [[None] * len(place_ids) for i in range(len(place_ids))]

    for i in range(len(place_ids)):
        for j in range(len(place_ids)):
            distance_matrix[i][j] = response['rows'][i]['elements'][j]['distance']['value']

    return distance_matrix, places_id_names
