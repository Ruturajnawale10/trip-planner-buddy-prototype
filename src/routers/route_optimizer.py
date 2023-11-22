from fastapi import HTTPException
from pydantic import BaseModel
from configs.configs import settings
import googlemaps
from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

class TripPOI(BaseModel):
    trip_id: str
    pois: list
    mode: str
    optimize_waypoints: bool
    
def get_route(poi_list: TripPOI):
    # Initialize the Google Maps API client
    gmaps = googlemaps.Client(key=settings.google_api_key)
    pois = poi_list.pois
    # Extracting locations from pois
    locations = [(poi[1], poi[2]) for poi in pois]
    mode = poi_list.mode
    optimize_waypoints = poi_list.optimize_waypoints

    # Use the Google Directions API to get the optimal route
    try:
        route = gmaps.directions(
            origin=locations[0],
            destination=locations[-1],
            waypoints=locations[1:-1],
            mode=mode,
            optimize_waypoints=optimize_waypoints,
            departure_time=datetime.now()
        )

        optimized_poi_order = [
        {
            "start_address": location["start_address"],
            "end_address": location["end_address"],
            "distance": location["distance"]["text"],
            "duration": location["duration"]["text"],
            "start_location": location["start_location"],
            "end_location": location["end_location"]
        }
        for location in route[0]["legs"]
        ]

        for i, path in enumerate(optimized_poi_order):
            startFound = False
            endFound = False
            for poi in pois:
                if startFound and endFound:
                    break
                if not startFound:
                    dist = haversine((path["start_location"]["lat"], path["start_location"]["lng"]), (poi[1], poi[2]))
                    if dist < 0.1:
                        optimized_poi_order[i]["start_poi_id"] = poi[0]
                        startFound = True
                if not endFound:
                    dist = haversine((path["end_location"]["lat"], path["end_location"]["lng"]), (poi[1], poi[2]))
                    if dist < 0.1:
                        optimized_poi_order[i]["end_poi_id"] = poi[0]
                        endFound = True                
        return optimized_poi_order

    except googlemaps.exceptions.ApiError as e:
        raise HTTPException(status_code=500, detail=f"Google Maps API Error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def haversine(coord1, coord2):
    # Radius of the Earth in kilometers
    R = 6371.0

    # Convert latitude and longitude from degrees to radians
    lat1, lon1 = radians(coord1[0]), radians(coord1[1])
    lat2, lon2 = radians(coord2[0]), radians(coord2[1])

    # Calculate the differences between latitudes and longitudes
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # Calculate the distance
    distance = R * c

    return distance