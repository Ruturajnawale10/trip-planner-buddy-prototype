import json
from fastapi import APIRouter, HTTPException
from src.models.poi import City
import string

router = APIRouter(
    tags=['Destination']
)


@router.get("/api/destination/{destination}")
def places_list(destination: str):
    destination = destination.replace("%", " ")
    destination = string.capwords(destination)

    try:
        # Find the city by city_name
        city = City.objects.get({'city_name': destination})
    except City.DoesNotExist:
        raise HTTPException(status_code=404, detail="City not found")

    # Convert the City object to a dictionary, excluding the _id field
    city_dict = city.to_son().to_dict()
    del city_dict['_id']

    # Return the City object as JSON
    return json.loads(json.dumps(city_dict))