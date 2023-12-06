from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models.user import User
from configs.db import db
from bson import ObjectId
from fastapi.responses import JSONResponse
from bson import json_util
import redis

router = APIRouter(
    tags=['User']
)

def get_redis():
    rd = redis.Redis(host='localhost', port=6379, db=0)
    return rd

router_dependency = Depends(get_redis)

class UserSignupRequest(BaseModel):
    username: str
    password: str
    
class UserResponse(BaseModel):
    username: str

class UserUpdatePreferencesRequest(BaseModel):
    preferences: list

@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserSignupRequest):
    print("signup api called", user_data.username)
    collection = db['user']
    # Check if the username is already taken
    existing_user = collection.find_one({'username': user_data.username})

    # Use the result directly without 'await'
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create a new user
    new_user = User(
        username=user_data.username,
        password=user_data.password,  # You should hash the password here
        google_auth=False,
        profile={
            'first_name': '',
            'last_name': '',
        },
        upcoming_trips=[],
        past_trips=[],
        shared_itineraries=[],
    )

    new_user.save()
    return UserResponse(
        username=new_user.username,
    )

@router.post("/signin", response_model=UserResponse)
def signin(user_data: UserSignupRequest):
    print("signin api called", user_data.username)
    collection = db['user']
    # Check if the username is already taken
    existing_user = collection.find_one({'username': user_data.username})

    # Use the result directly without 'await'
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new user
    user_valid = collection.find_one({'username': user_data.username, 'password': user_data.password})

    if not user_valid:
        raise HTTPException(status_code=400, detail="Invalid password")

    return UserResponse(
        username=user_valid['username'],
    )

def clear_cache_with_prefix(redis_client, prefix):
    print("Attempting to clear cache with prefix: ", prefix)
    count = 0
    
    ns_keys = redis_client.keys(prefix + '*')
    for key in ns_keys:
        count += 1
        print("key: ", key)
        redis_client.delete(key)
    
    return count
        
@router.put("/update/preferences/{username}", response_model=UserResponse)
def update_preferences(username: str, preferences_data: UserUpdatePreferencesRequest, rd: redis.Redis = router_dependency):
    collection = db['user']
    existing_user = collection.find_one({'username': username})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_query = {
        "$set": {
            "preferences": preferences_data.preferences
        }
    }
    collection.update_one({'username': username}, update_query)
    updated_user = collection.find_one({'username': username})
    
    # clear cache
    cnt = clear_cache_with_prefix(rd, username)
    print("Cleared cache for ", cnt, " keys")
    
    return UserResponse(
        username=updated_user['username'],
    )

@router.get("/getUser")
def get_user_data(user_name: str):
    collection = db['user']
    # Check if the username is already taken
    existing_user = collection.find_one({'username': user_name})
    print("existing_user", existing_user)
    if existing_user:
        existing_user['_id'] = json_util.dumps(existing_user['_id'])
        return JSONResponse(content=existing_user, status_code=200)
    return None
