from fastapi import APIRouter
import utils.file_util as file_util
from configs.db import db
import string

from utils.geo_hash_util import get_nearby_poi_ids

router = APIRouter(
    tags=['Test']
)

# This code will generate a file which will contain a set of all the type filters present in a particular city.
@router.post("/api/test/create/filter/file") 
def create_filter_list(city_list : list):
    print("create filter list api called for city list: ", city_list)
    collection_city = db['city']
    filter_list = []
    for city_name in city_list:

        city = collection_city.find_one({'city_name': string.capwords(city_name)})
        if city == None:
            print("City not found for " + city_name + ". Skipping...")
            continue
        poi_list = city['pois']
        for poi in poi_list:
            if poi['type'] != None:
                types = poi['type']
                for type1 in types:
                    filter_list.append(type1)
    filter_list = list(set(filter_list))
    file_util.write_to_file("filter_list.txt", filter_list)
    return filter_list

# this code will call get_nearby_entries api and return the output to frontend.
@router.get("/api/test/get/nearby/entries")
def get_nearby_entries(latitude: float, longitude: float, radius: int):
    print("get nearby entries api called")
    nearby = get_nearby_poi_ids(latitude, longitude, radius)
    return nearby