from pymongo import MongoClient
from configs.db import db

def get_user(user_name: str):
    collection = db['user']
    # Check if the username is already taken
    existing_user = collection.find_one({'username': user_name})
    return existing_user

def get_user_preferences(user_name: str):
    user = get_user(user_name)
    return user['preferences']