import json
from fastapi import APIRouter, HTTPException
from models.poi import City
from configs.db import db
import string

router = APIRouter(
    tags=['Destination']
)

collection_city = db['city']

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