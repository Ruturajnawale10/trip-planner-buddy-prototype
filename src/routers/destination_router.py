from fastapi import APIRouter
import requests
import json
from src.configs.configs import settings
from src.middleware.tsp_solver import SimpleTSP
import googlemaps
from datetime import datetime

router = APIRouter(
    tags=['Destination']
)


@router.get("/destination/{destination}")
def places_list(destination: str):
    API_KEY = settings.google_api_key
    query = "tourist attractions in " + destination

    # Define the base URL and request parameters
    url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    params = {
        'query': query,
        'key': API_KEY,
        'type': 'tourist_attraction|point_of_interest|establishment',
    }

    # Send the request and retrieve the JSON response
    response = requests.get(url, params=params).json()
    # Sort the results by user_ratings_total in descending order
    response_dict = {'results': sorted(response['results'], key=lambda x: x.get(
        'user_ratings_total', 0), reverse=True)}

    # Filter the results by minimum user_ratings_total and extract the top 5
    filtered_results = filter_results(response_dict)

    # Use the Google Directions API to get the optimal route
    route, destinations = find_shortest_route(filtered_results)

    print("Shortest Path for POIs is ", shortest_path)
    print("Minimum cost is ", min_cost)
    

    return {"shortest_path": shortest_path_names}

    return {"Follow the optimal route ": final_path}


def get_coordinates(destination: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json?"

    payload = {"address": destination, "key": settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()
    coordinates = response['results'][0]['geometry']['location']
    coordinates_str = str(coordinates['lat']) + ', ' + str(coordinates['lng'])

    return coordinates_str


def find_current_location():
    url = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + \
        settings.google_api_key

    response = requests.post(url).json()
    location = response["location"]
    origin = (location["lat"], location["lng"])

    return origin


def filter_results(response_dict):
    filtered_results = []
    for result in response_dict['results']:
        # filter out results that are not tourist attractions such as stadiums
        isTouristAttraction = True
        for type in result['types']:
            if type in ['stadium', 'amusement_park', 'aquarium', 'art_gallery', 'casino', 'movie_theater', 'museum', 'night_club', 'shopping_mall', 'zoo']:
                isTouristAttraction = False
                break

        if not isTouristAttraction:
            continue

        filtered_results.append(result)
        if len(filtered_results) == 5:
            break

    return filtered_results


def find_shortest_route(filtered_results):
    # Define the Google Maps API key
    gmaps = googlemaps.Client(key=settings.google_api_key)

    # Define the starting location (your current location)
    origin = find_current_location()

    # Define the list of destinations (tourist attractions)
    destinations = []
    for result in filtered_results:
        destinations.append(result['name'])

    gmaps = googlemaps.Client(key=settings.google_api_key)

    # Define the starting location (your current location)
    origin = find_current_location()

    # Define the list of destinations (tourist attractions)
    destinations = []
    for result in filtered_results:
        destinations.append(result['name'])

    # Use the Google Directions API to get the optimal route
    route = gmaps.directions(
        origin=origin,
        destination=origin,
        waypoints=destinations,
        mode="walking",
        optimize_waypoints=True,
        departure_time=datetime.now()
    )

    return route, destinations


def extract_path(route, destinations):
    # Print the order of the destinations in the optimal route
    waypoint_order = route[0]['waypoint_order']
    optimal_route = [destinations[i] for i in waypoint_order]

    # Get the start and end locations from the directions response
    start_location = route[0]['legs'][0]['start_location']
    end_location = route[0]['legs'][0]['end_location']

    # Get the start and end locations
    start_location_tuple = "Start Location: ({}, {})".format(
        start_location['lat'], start_location['lng'])
    end_location_tuple = "End Location: ({}, {})".format(
        end_location['lat'], end_location['lng'])

    return [start_location_tuple] + optimal_route + [end_location_tuple]
