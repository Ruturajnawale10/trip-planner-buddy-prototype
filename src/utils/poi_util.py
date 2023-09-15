import requests

from pymongo.errors import DuplicateKeyError
from src.models.poi import Pois

def add_mongo_entries_from_wanderlog(cname, placeId):
    url = 'https://wanderlog.com/api/placesList/geo/' + placeId
    # Send the request and retrieve the JSON response
    response = requests.get(url).json()
    placeMetadata = response["data"]["placeMetadata"]
    i = 0
    for obj in placeMetadata:
        create_poi(obj,cname)
        print(i)
        i=i+1
    
    print(len(placeMetadata))

def get_coordinate_info_from_address(address, limit=1):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "addressdetails": 1,
        "q": address,
        "format": "jsonv2",
        "limit": limit
    }
    try:
         # Make the GET request to openstreetmap api
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            response_obj = response.json()
            # Extract the lat and lng from the response
            if response_obj and len(response_obj) > 0:
            # Extract the lat and lng from the response
                lat = response_obj[0]["lat"]
                lng = response_obj[0]["lon"]
                return lat, lng
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None
    
def create_poi(obj, cname):
    tname = obj.get("name")
    taddress = obj.get("address")
    temp_review = obj.get("reviews")
    temp_imageKeys = obj.get("imageKeys")
    trating = obj.get("rating")
    tcategories = obj.get("categories")
    temp_website = obj.get("website")
    temp_no = obj.get("internationalPhoneNumber", "test")
    tgeneratedDescription = obj.get("generatedDescription", "test")
    tdescription = obj.get("description", "test")
    lat = 0
    lon = 0
    coordinate_info = get_coordinate_info_from_address(taddress)
    if coordinate_info is not None:
        lat, lon = coordinate_info
    else:
        print("Error: Unable to get coordinates for address:", taddress)
        return

    new_poi = Pois(
            name=tname,
            city=cname,
            address=taddress,
            images=temp_imageKeys,
            type=tcategories,
            rating=trating,
            review=temp_review,
            timeSpent={
                'avgTime': 2.5,
                'minTime': 1.5,
                'maxTime': 4.5
            },
            description=tdescription,
            website=temp_website,
            internationalPhoneNumber=temp_no,
            generatedDescription=tgeneratedDescription,
            lat=lat,
            lon=lon
        )
    try:
        new_poi.save()
        print("New record inserted.")
    except DuplicateKeyError:
        print("Record with the same name and city already exists, skipping.")