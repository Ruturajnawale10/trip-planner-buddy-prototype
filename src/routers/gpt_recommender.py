from fastapi import APIRouter
from openai import OpenAI

import string
from configs.db import db
from configs.configs import settings
from utils import file_util
from utils import prompt_util


client = OpenAI(api_key=settings.gpt_key)

router = APIRouter(
    tags=['GPT Recommender']
)


@router.post("/api/get/gpt/recommendation")
def generate_recommendation(city_name: str, preferences: list):
    print("Generating training data for recommendation of places in city : ", city_name)
    print("Preferences: ", preferences)
    destination = string.capwords(city_name)
    collection_city = db['city']
    city = collection_city.find_one({'city_name': destination})
    poi_list = city['pois']

    gpt_prompt = prompt_util.generate_gpt_prompt(destination, preferences, poi_list)
    print(gpt_prompt)
    response = client.chat.completions.create(
        model= settings.gpt_model,
        messages=[
            {"role": "system", "content": "You are a helpful recommendation engine which returns the array of ids of recommended places based on the given preferences. If possible it will suggest 5 places i.e output will be array of size 5"}, 
            {"role": "user", "content": "Create recommendations for a user based on preferences : ['Museum'] for the places in city :San Jose from the follwoing array of point_of_intrests : point_of_intrests in [ name : Rosicrucian Egyptian Museum id : 47435 type of place : [Museum,Archaeological museum,History Museums,Specialty Museums,] name : San Pedro Square Market Bar id : 112876 type of place : [Bar,Shopping,Flea & Street Markets,]]"},
            {"role": "assistant", "content": "[47435]"},
            {"role": "user", "content": gpt_prompt}
        ]
    )

    gpt_output = str(response.choices[0].message.content)
    print(gpt_output)
    gpt_prompt += 'gpt_response : ' + gpt_output
    print(gpt_prompt)
    file_util.write_string_to_file("prompt.josnl", gpt_prompt)

    return gpt_output
