from datetime import date
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.trip import Trip
from models.user import User
from configs.db import db
from bson.objectid import ObjectId

router = APIRouter(
    tags=['Trip']
)

class TripCreation(BaseModel):
    createdBy: str
    startDate: date
    endDate: date
    cityName: str

class TripAddPoi(BaseModel):
    trip_id: str
    poi_id: str
    day: int

    
class TripResponse(BaseModel):
    trip_id: str

class UsernameRequestBody(BaseModel):
    username: str

collection_trip = db['trip']
collection_user = db['user']

@router.post("/api/trip/create/own", response_model=TripResponse)
def create_trip_own(trip_data: TripCreation):
    print("create trip api called")
    start_date = trip_data.startDate
    end_date = trip_data.endDate
    no_of_days = (end_date - start_date).days + 1
    city_name = trip_data.cityName
    trip_name = "Trip to " + city_name
    created_by = trip_data.createdBy
    pois = [[] for _ in range(no_of_days)]

    # Create a new trip
    new_trip = Trip(
        tripName=trip_name,
        startDate=start_date,
        endDate=end_date,
        noOfDays=no_of_days,
        cityName=city_name,
        createdBy=created_by,
        pois=pois,
    )

    new_trip.save()
    try:
        user = User.objects.get({'username': created_by})
        user.upcoming_trips.append(new_trip._id)
        user.save()
        return TripResponse(
            trip_id=str(new_trip._id),
        )
    except User.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"User with username {created_by} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/api/trip/add/poi")
def add_poi_to_trip(poi_data: TripAddPoi):
    print("add poi to trip api called")
    trip_id = ObjectId(poi_data.trip_id)

    try:
        #find out why this does not work, i.e. why it does not return document. this works similarly for user objects
        # trip = Trip.objects.get({'_id': trip_id})
        trip = collection_trip.find_one({'_id': trip_id})
        print("finally", trip)
        trip["pois"][poi_data.day].append(poi_data.poi_id)

        update_query = {
        "$push": {
            f"pois.{poi_data.day}": poi_data.poi_id
        }
}
        collection_trip.update_one({"_id": trip_id}, update_query)
        # trip.save()
        
        return {"message": "Success"}
    except Trip.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Trip with trip_id {poi_data.trip_id} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/api/trip/list/upcoming")
def add_poi_to_trip(user: UsernameRequestBody):
    print("upcoming trips list trip api called")

    existing_user = collection_user.find_one({'username': user.username})
    try:
        trips = collection_trip.find({"_id": {"$in": existing_user['upcoming_trips']}})
    except Trip.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Trip object for  username {user.username} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Convert MongoDB cursor to a list of dictionaries
    trip_list = [trip for trip in trips]
    # Covert ObjectId to string before returning as ObjectId is bson n ot json type
    for trip in trip_list:
        trip['_id'] = str(trip["_id"])
    
    return trip_list
