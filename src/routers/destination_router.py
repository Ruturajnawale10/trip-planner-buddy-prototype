from fastapi import APIRouter
import requests
import json
from src.configs.configs import settings
from src.middleware.tsp_solver import SimpleTSP
import googlemaps


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
    response_dict = {'results': sorted(response['results'], key=lambda x: x.get('user_ratings_total', 0), reverse=True)}
    response_json = json.dumps(response_dict)

    # Filter the results by minimum user_ratings_total and extract the top 5
    filtered_results = []
    for result in response_dict['results']:
        print(result['name'], result['user_ratings_total'])
        #filter out results that are not tourist attractions such as stadiums
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

    # Print the names and user_ratings_total of the filtered results
    for result in filtered_results:
        print(result['name'], result['user_ratings_total'])

    starting_point = find_current_location()
    print(starting_point)

    # place_ids = []
    
    # print(x)

    # for place in response['results'][:10]:
    #     place_ids.append(place['place_id'])

    # print(place_ids)

    # distance_matrix, places_id_names = get_distance_matrix(place_ids)
    # print(distance_matrix)

    # tsp = SimpleTSP(distance_matrix)
    # min_cost = tsp.runTSP(0)
    # shortest_path = tsp.getBestPath()

    # shortest_path_names = []
    # for i in range(len(shortest_path)):
    #     shortest_path_names.append(places_id_names[shortest_path[i]])

    # shortest_path_names.append(places_id_names[shortest_path[0]])

    # tsp.printBestPath()

    # print("Shortest Path for POIs is ", shortest_path)
    # print("Minimum cost is ", min_cost)

    return {"Famous places are ": filtered_results}


def get_coordinates(destination: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json?"

    payload = {"address": destination, "key": settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()
    coordinates = response['results'][0]['geometry']['location']
    coordinates_str = str(coordinates['lat']) + ', ' + str(coordinates['lng'])

    return coordinates_str


def get_distance_matrix(place_ids):
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?"

    place_ids_prefixed = ['place_id:' + place_id for place_id in place_ids]
    places = "|".join(place_ids_prefixed)

    payload = {'origins': places, 'destinations': places,
               'key': settings.google_api_key}

    response = requests.request("GET", url, params=payload).json()

    places_id_names = {}
    for i, id in enumerate(place_ids):
        places_id_names[i] = response['destination_addresses'][place_ids.index(
            id)]

    distance_matrix = [[None] * len(place_ids) for i in range(len(place_ids))]

    for i in range(len(place_ids)):
        for j in range(len(place_ids)):
            distance_matrix[i][j] = response['rows'][i]['elements'][j]['distance']['value']

    return distance_matrix, places_id_names

def find_current_location():
    url = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + settings.google_api_key

    payload = {}
    headers = {}

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text.encode('utf8'))

    return response.text.encode('utf8')

