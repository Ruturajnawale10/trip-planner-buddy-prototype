from typing import Union
from fastapi import FastAPI
import uvicorn

from routers.google_api import router as google_api
from routers.user_router import router as user_router
from routers.destination import router as destination
from routers.trip_router import router as trip
from routers.trip_ai import router as trip_ai
from routers.weather import router as weather
from routers.fine_tune_model import router as fine_tune_model
from routers.test_apis import router as test_apis
from routers.preference_question import router as preference_question
from routers.gpt_recommender import router as gpt_recommender

# Allow CORS
from fastapi.middleware.cors import CORSMiddleware

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


app.include_router(google_api)
app.include_router(user_router)
app.include_router(destination)
app.include_router(trip)
app.include_router(trip_ai)
app.include_router(weather)
app.include_router(fine_tune_model)
app.include_router(test_apis)
app.include_router(preference_question)
app.include_router(gpt_recommender)
