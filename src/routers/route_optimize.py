from fastapi import APIRouter
from pydantic import BaseModel
from configs.db import db
from routers.route_optimizer import get_route


router = APIRouter(
    tags=['Route optimize']
)

class TripPOI(BaseModel):
    trip_id: str
    pois: list
    mode: str
    optimize_waypoints: bool

collection_trip = db['trip']

@router.post("/api/trip/route/optimize")
def optimize_routes(poi_list: TripPOI):
    print("Inside optimize_routes")
    return {"optimal_route": get_route(poi_list)}
