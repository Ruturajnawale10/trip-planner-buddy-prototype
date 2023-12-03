import requests

from pymongo.errors import DuplicateKeyError
from configs.configs import settings
from models.poi import Poi, City
from utils.file_util import write_to_file
from utils.geo_hash_util import pouplate_geohash_entry
from configs.db import db

def add_mongo_entries_from_wanderlog(cname, placeId):
    url = 'https://wanderlog.com/api/placesList/geo/' + placeId
    # Send the request and retrieve the JSON response
    response = requests.get(url).json()
    placeMetadata = response["data"]["placeMetadata"]
    i = 0
    pois_list = []
    for obj in placeMetadata:
        poi = create_poi(obj,cname)
        print("Fetching poi ", i, "..." )
        if poi:
            pois_list.append(poi)
        i=i+1
    
    new_city = City(city_name=cname, pois=pois_list)
    try:
        new_city.save()
        print("Record for new city inserted.")
    except DuplicateKeyError:
        print("Record with the same city already exists, skipping.")
    
def get_coordinate_info_from_address_open_street_map(address, limit=1):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "addressdetails": 1,
        "q": address,
        "format": "jsonv2",
        "limit": limit
    }
    try:
         # Make the GET request to openstreetmap api
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            response_obj = response.json()
            # Extract the lat and lng from the response
            if response_obj and len(response_obj) > 0:
            # Extract the lat and lng from the response
                lat = response_obj[0]["lat"]
                lng = response_obj[0]["lon"]
                return lat, lng
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None
    
def get_coordinates_from_address_google_api(address: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json?"

    payload = {"address": address, "key": settings.google_api_key}
    
    try:
        # Send an HTTP GET request to the Geocoding API
        response = requests.request("GET", url, params=payload).json()
        # Check if the request was successful
        if response['status'] == "OK":
            # Extract latitude and longitude
            location = response['results'][0]['geometry']['location']
            latitude = location['lat']
            longitude = location['lng']
            return latitude, longitude
        else:
            print(f'HTTP request failed')
    except Exception as e:
        print(f'An error occurred: {e}')
    
    return None


def create_poi(obj, cname):
    poi_id = obj.get("id")
    if poi_already_exists(poi_id):
        print("poi already exists in the database.")
        return None
    poi_address = obj.get("address")
    placeId=obj.get("placeId")

    coordinate_info = get_coordinate_info_from_address(poi_address)
    if coordinate_info == None:
        coordinate_info = get_coordinate_info_from_placeId(placeId)

    if coordinate_info == None:
        coordinate_info = get_coordinates_from_address_google_api(poi_address)

    if coordinate_info is not None:
        lat, lon = coordinate_info
    else:
        print("Error: Unable to get coordinates for address:", poi_address)
        return None
    
    temp_poi = get_poi_object_from_wanderlog_object(obj, cname, poi_address, lat, lon)

    new_poi = get_poi_object_from_wanderlog_object(obj, cname, poi_address, lat, lon)
    
    try:
        new_poi.save()
        pouplate_geohash_entry(lat, lon, obj.get("id"))
        # print("Record for new city inserted.")
    except DuplicateKeyError:
        print("Record with the same poi already exists, skipping.")
    return temp_poi

def get_poi_by_id_from_poi_list(pois, poi_id):
    for poi in pois:
        if poi["poi_id"] == poi_id:
            return poi
    return None

def get_poi_list(placeId, cname):
    url = 'https://wanderlog.com/api/placesList/geo/' + str(placeId)
    # Send the request and retrieve the JSON response
    response = requests.get(url).json()
    placeMetadata = response["data"]["placeMetadata"]
    i = 0
    pois_list = []
    for obj in placeMetadata:
        poi = create_poi(obj,cname)
        print("Fetching poi ", i, "..." )
        if poi:
            pois_list.append(poi)
        i=i+1
    return pois_list


def add_city_mongo_entries_from_wanderlog(placeId):

    if city_already_exists(placeId):
        print("City already exists in the database.")
        return
    url = 'https://wanderlog.com/api/geo/' + str(placeId) + '/explorePage'
    # Send the request and retrieve the JSON response
    print(url)
    response = requests.get(url).json()
    print("api called")
    # print(response)
    cname = response["data"]["geo"]["name"]
    pois_list = get_poi_list(placeId, cname)
    
    stateName = response["data"]["geo"]["stateName"]
    countryName = response["data"]["geo"]["countryName"]
    city_id = response["data"]["geo"]["id"]

    new_city = City(
        city_name=cname,
        pois=pois_list,
        geo=response["data"]["geo"],
        stateName=stateName,
        countryName=countryName,
        city_id=city_id,
        nearby=response["data"]["nearby"],
        # categories=response["data"]["categories"]
        )
    try:
        new_city.save()
        print("Record for new city inserted.")
        city_address = cname + ", " + stateName + ", " + countryName
        city_dict = { "city_info" : city_address, "city_id" : city_id}
        add_city_metadata(city_dict)
        nearby_cities = response["data"]["nearby"]
        nearby_cities_ids = []
        for nearby_city in nearby_cities:
            nearby_cities_ids.append(nearby_city["id"])
        write_to_file("nearby_cities_ids.jsonl", nearby_cities_ids)
        write_to_file("city_array.jsonl", city_dict)

    except DuplicateKeyError:
        print("Record with the same city already exists, skipping.")

def get_coordinate_info_from_placeId(placeId):
    url = 'https://wanderlog.com/api/placesAPI/getPlaceDetails/v2?placeId=' + placeId + '&language=en-GB'
    # Send the request and retrieve the JSON response
    response = requests.get(url).json()
    lat = response["data"]["geometry"]["location"]["lat"]
    lng = response["data"]["geometry"]["location"]["lng"]
    print(f"using placeId lat: {lat}, lng: {lng}")
    if lat == None or lng == None:
        return None
    return lat, lng

def city_already_exists(placeId):
    collection_city = db['city']
    city = collection_city.find_one({'city_id': placeId})
    if city != None:
        return True
    else:
        return False
    
def poi_already_exists(poi_id):
    collection_city = db['poi']
    city = collection_city.find_one({'poi_id': poi_id})
    if city != None:
        return True
    else:
        return False

def add_city_metadata(city_dict):
    collection_city = db['city_metadata']
    try:
        collection_city.insert_one(city_dict)
        print("Record for new city inserted.")
    except DuplicateKeyError:
        print("Record with the same city already exists, skipping.")

def get_poi_object_from_wanderlog_object(obj, cname, poi_address, lat, lon):
    temp_poi = Poi(
            poi_id=obj.get("id"),
            placeId=obj.get("placeId"),
            name=obj.get("name"),
            city=cname,
            address=poi_address,
            images=obj.get("imageKeys"),
            type=obj.get("categories"),
            rating=obj.get("rating"),
            minMinutesSpent=obj.get("minMinutesSpent"),
            maxMinutesSpent=obj.get("maxMinutesSpent"),
            description=obj.get("description", "test"),
            website=obj.get("website"),
            internationalPhoneNumber=obj.get("internationalPhoneNumber", "test"),
            generatedDescription=obj.get("generatedDescription", "test"),
            location={
                'latitude': lat,
                'longitude': lon
            }
        )
    return temp_poi

def get_poi_from_poi_id(poi_id):
    collection_poi = db['poi']
    poi = collection_poi.find_one({'poi_id': poi_id}, {'_id': 0})
    return poi

def get_coordinates_from_address(user_address):
    latitude, longitude = get_coordinate_info_from_address_open_street_map(user_address)
    if latitude == None or longitude == None:
        print("Address not found from open street map")
        print("getting address from google api")
        latitude, longitude = get_coordinates_from_address_google_api(user_address)
    if latitude == None or longitude == None:
        print("Address not found")
        return "Address not found"
    print("latitude: ", latitude, "longitude: ", longitude)
    latitude = float(latitude)
    longitude = float(longitude)
    return latitude, longitude