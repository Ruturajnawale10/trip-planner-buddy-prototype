from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.user import User
from configs.db import db
from bson import ObjectId
from fastapi.responses import JSONResponse
from bson import json_util
router = APIRouter(
    tags=['User']
)

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

@router.put("/update/preferences/{username}", response_model=UserResponse)
def update_preferences(username: str, preferences_data: UserUpdatePreferencesRequest):
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
