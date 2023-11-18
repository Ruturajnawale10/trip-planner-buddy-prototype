from pymongo import MongoClient
import geohash2
from models.geo_info import GeoInfo
from pymongo.errors import DuplicateKeyError
from configs.db import db

def generate_geohash(latitude, longitude, precision=7):
    """
    Generate GeoHash for given latitude and longitude.
    Precision parameter determines the length of the GeoHash.
    """
    latitude = float(latitude)
    longitude = float(longitude)
    return geohash2.encode(latitude, longitude, precision=precision)

# this function will be used to populate the geohash collection in mogogdb i.e it will store the geohash of given poi in the database.
def pouplate_geohash_entry(latitude, longitude, poi_id):
    geohash = generate_geohash(latitude, longitude)
    print("-------------------------------------------")
    print("geohash: ", geohash)
    print("type of geohash: ", type(geohash))
    loc = {'type': 'Point', 'coordinates': [longitude, latitude]}
    new_geohash = GeoInfo(
        poi_id=poi_id,
        latitude=latitude,
        longitude=longitude,
        geohash=geohash,
        location= loc
    )
    try:
        new_geohash.save()
        print("Record for new geohash inserted.")
    except DuplicateKeyError:
        print("Record with the same geohash already exists, skipping.")
    return new_geohash

# this function will be used to get all the poi_ids which is close to a user's location from geo_hash collection in mongodb.
# it will take the user's location i.e latitude and longitude and the radius in which the pois should be returned
def get_poi_ids(latitude, longitude, radius):
    geohash = generate_geohash(latitude, longitude)
    # print("geohash: ", geohash)
    # print("radius: ", radius)
    geohash_list = geohash2.expand(geohash)
    # print("geohash_list: ", geohash_list)
    poi_ids = []
    for geohash in geohash_list:
        geohash_obj = GeoInfo.objects.raw({"geohash": geohash})
        for obj in geohash_obj:
            poi_ids.append(obj.poi_id)
    return poi_ids

def get_nearby_poi_ids(latitude : float, longitude : float, radius : int):
    print("get_nearby_poi_ids called")
    collection_geo = db['geo_info']
    # Generate GeoHash for the user's location
    # user_geohash = geohash2.encode(latitude, longitude)
    # Query for nearby entries using $geoWithin and $centerSphere
    max_distance = 5000  # 5 kilometers
    nearby_entries = collection_geo.find({
        "location": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude],
                },
                "$maxDistance": radius,
            }
        }
    })
    print("nearby_entries: ", nearby_entries)
    nearby_entries_list = []
    for entry in nearby_entries:
        print(entry)
        nearby_entries_list.append(entry['poi_id'])

    # nearby_entries_list = list(nearby_entries)
    print("nearby_entries_list: ", nearby_entries_list)


    return nearby_entries_list