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
    poi_id: int
    day: int

class TripDeletePoi(BaseModel):
    trip_id: str
    poi_id: int
    day: int

class TripRequestResponse(BaseModel):
    trip_id: str


class UsernameRequestBody(BaseModel):
    username: str


collection_trip = db['trip']
collection_user = db['user']
collection_city = db['city']


@router.post("/api/trip/create/own", response_model=TripRequestResponse)
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
        user_document = collection_user.find_one({'username': created_by})
        if user_document:
            user_document['upcoming_trips'].append(new_trip._id)
            collection_user.update_one({'_id': user_document['_id']}, {
                                       '$set': {'upcoming_trips': user_document['upcoming_trips']}})
        return TripRequestResponse(
            trip_id=str(new_trip._id),
        )
    except User.DoesNotExist:
        raise HTTPException(
            status_code=404, detail=f"User with username {created_by} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/trip/add/poi")
def add_poi_to_trip(poi_data: TripAddPoi):
    print("add poi to trip api called")
    trip_id = ObjectId(poi_data.trip_id)

    try:
        # find out why this does not work, i.e. why it does not return document. this works similarly for user objects
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
        raise HTTPException(
            status_code=404, detail=f"Trip with trip_id {poi_data.trip_id} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/api/trip/delete/poi")
def delete_poi_from_trip(poi_data: TripDeletePoi):
    try:
        trip_id = ObjectId(poi_data.trip_id)
        poi_id = poi_data.poi_id
        day = poi_data.day
        trip = collection_trip.find_one({'_id': trip_id})
        if not trip:
            raise HTTPException(status_code=404, detail=f"Trip with trip_id {str(trip_id)} not found")

        day_poilist = trip["pois"][day-1]
        print("day pois", day_poilist)
        
        update_day_poilist = []
        for curr_poi_id in day_poilist:
            if curr_poi_id != poi_id:
                update_day_poilist.append(curr_poi_id)

        trip["pois"][day-1] = update_day_poilist
        print("update_day_poilist pois", update_day_poilist)
        print("trip", trip)
        
        update_query = {
            "$set": { f"pois.{day}": update_day_poilist }
        }
        print("update query", update_query)
        collection_trip.save(trip)
        return {"message": "POI deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/trip/list/upcoming")
def get_upcoming_trips_list(user: UsernameRequestBody):
    print("upcoming trips list trip api called")

    existing_user = collection_user.find_one({'username': user.username})
    try:
        trips = collection_trip.find(
            {"_id": {"$in": existing_user['upcoming_trips']}})
    except Trip.DoesNotExist:
        raise HTTPException(
            status_code=404, detail=f"Trip object for  username {user.username} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Convert MongoDB cursor to a list of dictionaries
    trip_list = [trip for trip in trips]
    # Covert ObjectId to string before returning as ObjectId is bson n ot json type
    for trip in trip_list:
        trip['_id'] = str(trip["_id"])

    return trip_list


@router.post("/api/trip/poi_list/")
def get_pois_of_a_trip(trip: TripRequestResponse):
    print("POIs list for a trip api called")
    try:
        existing_trip = collection_trip.find_one(
            {"_id": ObjectId(trip.trip_id)})
        city_name = existing_trip['cityName']
        poi_ids = existing_trip['pois']
        total_pois = len(poi_ids)
        poi_list = [[] for _ in range(total_pois)]
        for i in range(total_pois):
            # Define the aggregation pipeline to match the documents
            pipeline = [
                {
                    "$match": {
                        "city_name": city_name
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "pois": {
                            "$filter": {
                                "input": "$pois",
                                "as": "poi",
                                "cond": {
                                    "$in": ["$$poi.poi_id", poi_ids[i]]
                                }
                            }
                        }
                    }
                }
            ]

            # Execute the aggregation pipeline
            poi_list[i] = list(collection_city.aggregate(pipeline))
    except Trip.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Trip object not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    existing_trip['_id'] = str(existing_trip["_id"])
    return {"pois": poi_list, "trip_details": existing_trip}

@router.post("/api/trip/mark/complete")
def mark_trip_complete(trip: TripRequestResponse):
    print("mark trip complete api called")
    try:
        existing_trip = collection_trip.find_one(
            {"_id": ObjectId(trip.trip_id)})
        existing_trip['isUpcoming'] = False
        collection_trip.save(existing_trip)
        created_by = existing_trip['createdBy']
        try :
            user_document = collection_user.find_one({'username': created_by})
            if user_document:
                user_document['upcoming_trips'].remove(existing_trip['_id'])
                user_document['past_trips'].append(existing_trip['_id'])
                collection_user.update_one({'_id': user_document['_id']}, {
                                        '$set': {'upcoming_trips': user_document['upcoming_trips'], 'past_trips': user_document['past_trips']}})
        except User.DoesNotExist:
            raise HTTPException(
                status_code=404, detail=f"User with username {created_by} not found")
        
        return {"message": "Trip marked complete"}
    except Trip.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Trip object not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
  
@router.post("/api/trip/mark/complete/share")
def mark_trip_complete(trip: TripRequestResponse):
    print("Mark trip as complete and share trip api called")
    try:
        existing_trip = collection_trip.find_one(
            {"_id": ObjectId(trip.trip_id)})
        existing_trip['isUpcoming'] = False
        existing_trip['isPublic'] = True
        collection_trip.save(existing_trip)
        created_by = existing_trip['createdBy']
        try :
            user_document = collection_user.find_one({'username': created_by})
            if user_document:
                user_document['upcoming_trips'].remove(existing_trip['_id'])
                user_document['past_trips'].append(existing_trip['_id'])
                user_document['shared_itineraries'].append(existing_trip['_id'])
                collection_user.update_one({'_id': user_document['_id']}, {
                                        '$set': {'upcoming_trips': user_document['upcoming_trips'], 'past_trips': user_document['past_trips'], 'shared_itineraries': user_document['shared_itineraries']}})
        except User.DoesNotExist:
            raise HTTPException(
                status_code=404, detail=f"User with username {created_by} not found")
        
        return {"message": "Trip marked complete and shared"}
    except Trip.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Trip object not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
