from fastapi import APIRouter
from pydantic import BaseModel
from configs.db import db
from routers.route_metrics import get_route
from bson.objectid import ObjectId

router = APIRouter(
    tags=['Route optimize']
)

class TripPOI(BaseModel):
    trip_id: str
    pois: list
    mode: str
    optimize_waypoints: bool
    day: int

collection_trip = db['trip']

@router.post("/api/trip/route/optimize")
def optimize_routes(poi_list: TripPOI):
    print("Inside optimize_routes")
    if poi_list.pois == None or len(poi_list.pois) <= 2:
        print("Not enough POIs to optimize")
        return {"error": "Not enough POIs to optimize"}
    optimized_poi_order = get_route(poi_list)
    day = poi_list.day
    optimized_poi_ids = []
    
    for poi in optimized_poi_order:
        optimized_poi_ids.append(poi["start_poi_id"])
    optimized_poi_ids.append(optimized_poi_order[-1]["end_poi_id"])
    
    try:
        existing_trip = collection_trip.update_one(
            {"_id": ObjectId(poi_list.trip_id)},
            {"$set": {"pois." + str(day - 1): optimized_poi_ids}}
        )
    except Exception as e:
        # Handle the exception here
        print(f"An error occurred: {str(e)}")
        
    return {"optimal_route": optimized_poi_order}
