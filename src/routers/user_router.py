from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.models.user import User  # Import your User model
from src.configs.db import db

router = APIRouter(
    tags=['User']
)

class UserSignupRequest(BaseModel):
    username: str
    password: str
    
class UserResponse(BaseModel):
    username: str

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