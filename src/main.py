from typing import Union
from fastapi import FastAPI
import requests
from src.configs.configs import settings
from src.configs.db import db

#alternate way to import file objects from other folder
# import sys
# sys.path.append('src/configs') 
#from configs import settings

from src.routers.destination_router import router as destination_router
from src.routers.user_router import router as user_router

# Allow CORS
from fastapi.middleware.cors import CORSMiddleware

from src.models.user import User

origins = [
    "http://localhost",
    "http://localhost:19006",
    "http://localhost:3000"]





app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

#test api for adding entry in mongodb
@app.get("/addEntry")
def add_mongo_test_entry():
    mycollection = db['users']
    result = mycollection.insert_one({'name': 'John', 'age': 30})
    print(result.inserted_id)
    return {"Hello": "World"}

#test api for adding entry in mongodb
@app.get("/addUser")
def add_mongo_user_entry():
    new_user = User(first_name='johndoe', email='johndoe@example.com', password='password123')
    new_user.save()
    return {"user": "created"}


app.include_router(destination_router)
app.include_router(user_router)