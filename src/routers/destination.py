import json
from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.poi import City
from configs.db import db
import string
from bson import ObjectId
from routers.gpt_recommender import generate_recommnedation_from_city_object

from utils.geo_hash_util import get_nearby_poi_ids
from utils.poi_util import get_coordinate_info_from_address, get_coordinates_from_address_google_api

router = APIRouter(
    tags=['Destination']
)

collection_city = db['city']
collection_poi = db['poi']

@router.get("/api/destination/")
def places_list(destination: str, user_name: Optional[str] = None):
    destination = destination.replace("%", " ")
    destination = string.capwords(destination)
    print(destination)

    try:
        # Find the city by city_name
        city = collection_city.find_one({'city_name': destination}, {'_id': 0})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="City not found")

    # city['_id'] = str(city["_id"])
    gpt_recommendations = ""
    if user_name != None:
        gpt_recommendations = generate_recommnedation_from_city_object(city, user_name)
    city.update({'gpt_recommendations': gpt_recommendations})
    return city

# get city based on city id
@router.get("/api/getcity/{city_id}")
def places_list(city_id: int):
    # destination = destination.replace("%", " ")
    # destination = string.capwords(destination)
    print("fetching city with id: ", city_id)

    try:
        # Find the city by city_id
        city = collection_city.find_one({'city_id': city_id}, {'_id': 0})
        print("city found: ", city)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="City not found")

    # city['_id'] = str(city["_id"])

    return JSONResponse(content=city)

# get nearby points of interest based on users currnet address and radius
@router.get("/api/getnearby/")
def get_nearby(user_address: str, radius: int, user_name: Optional[str] = None):
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
    if len(nearby_poi_ids) == 0:
        print("No nearby pois found")
        raise HTTPException(status_code=404, detail="No nearby pois found")
    nearby_pois = []
    for poi_id in nearby_poi_ids:
        poi = collection_poi.find_one({'poi_id': poi_id} , {'_id': 0})
        if poi != None:
            nearby_pois.append(poi)

    dummy_city = create_dummy_city(nearby_pois, latitude, longitude)
    gpt_recommendations = ""
    if user_name != None:
        gpt_recommendations = generate_recommnedation_from_city_object(dummy_city, user_name)
    dummy_city.update({'gpt_recommendations': gpt_recommendations})
    print("dummy city: ", dummy_city)
    return dummy_city


def create_dummy_city(pois, latitude, longitude):
    dummy_city = {
        "city_id": 0,
        "city_name": "Nearby",
        "country": "Nearby",
        "state": "Nearby",
        "latitude": 0,
        "longitude": 0,
        "pois": pois,
        "geo" : {
            "latitude": latitude,
            "longitude": longitude
        }
    }
    return dummy_city