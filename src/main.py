from typing import Union
from fastapi import FastAPI
import requests
from src.configs.configs import settings
#alternate way to import file objects from other folder
# import sys
# sys.path.append('src/configs') 
#from configs import settings

from src.routers.destination_router import router as destination_router

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

app.include_router(destination_router)