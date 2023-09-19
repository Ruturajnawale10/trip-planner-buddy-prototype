from datetime import date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.models.trip import Trip
from src.models.user import User

router = APIRouter(
    tags=['Trip']
)

class TripCreation(BaseModel):
    createdBy: str
    startDate: date
    endDate: date
    cityName: str

    
class TripResponse(BaseModel):
    trip_id: str

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
        print(new_trip._id, type(new_trip._id))
        return TripResponse(
            trip_id=str(new_trip._id),
        )
    except User.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"User with username {created_by} not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))