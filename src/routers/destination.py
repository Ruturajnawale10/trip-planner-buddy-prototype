import json
from fastapi import APIRouter, HTTPException
from models.poi import City
from configs.db import db
import string
from bson import ObjectId

from utils.geo_hash_util import get_nearby_poi_ids
from utils.poi_util import get_coordinate_info_from_address, get_coordinates_from_address_google_api

router = APIRouter(
    tags=['Destination']
)

collection_city = db['city']
collection_poi = db['poi']

@router.get("/api/destination/{destination}")
def places_list(destination: str):
    destination = destination.replace("%", " ")
    destination = string.capwords(destination)
    print(destination)

    try:
        # Find the city by city_name
        city = collection_city.find_one({'city_name': destination})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="City not found")

    city['_id'] = str(city["_id"])

    return city

# get city based on city id
@router.get("/api/getcity/{city_id}")
def places_list(city_id: str):
    # destination = destination.replace("%", " ")
    # destination = string.capwords(destination)
    print("fetching city with id: ", city_id)

    try:
        # Find the city by city_id
        city = collection_city.find_one({'city_id': city_id})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="City not found")

    city['_id'] = str(city["_id"])

    return city

# get nearby points of interest based on users currnet address and radius
@router.get("/api/getnearby/{user_address}/{radius}")
def get_nearby(user_address: str, radius: int):
    print("get nearby entries api called")

    latitude, longitude = get_coordinate_info_from_address(user_address)
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
    nearby_poi_ids = get_nearby_poi_ids(latitude, longitude, radius)
    nearby_pois = []
    for poi_id in nearby_poi_ids:
        poi = collection_poi.find_one({'poi_id': poi_id})
        if poi != None:
            print(f"poi found {poi}" )
            poi['_id'] = str(poi["_id"])
            # nearby_pois.append(convert_to_dict_with_objectid(poi))
            nearby_pois.append(poi)

    dummy_city = create_dummy_city(nearby_pois)
    return dummy_city

def convert_to_dict_with_objectid(obj):
    if obj:
        if isinstance(obj, dict):
            return obj
        data = obj.to_mongo()
        data['_id'] = str(data['_id'])
        return data
    else:
        return None

def create_dummy_city(pois):
    dummy_city = City(
        city_name="Nearby",
        pois=pois,
        geo=None,
        stateName=None,
        countryName=None,
        city_id=None,
        nearby=None,
        categories=None
    )
    return dummy_city