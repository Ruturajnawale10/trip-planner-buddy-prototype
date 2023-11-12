from fastapi import APIRouter, HTTPException

router = APIRouter(
    tags=['Destination']
)

# This function will return a list of questions and list of options for each question for user preferences
@router.get("/api/preference/questions")
def get_preference_questions():
    preference_questions = [{"question": "What type of place do you prefer?", "options": ["Historical", "Religious", "Adventure", "Nature", "Shopping", "Food"]},
                            {"question": "What type of food do you prefer?", "options": ["Vegetarian", "Non-Vegetarian"]},
                            {"question": "What type of adventure do you prefer?", "options": ["Water Sports", "Hiking", "Camping", "Skiing", "Paragliding", "Bungee Jumping"]},
                            {"question": "What type of shopping do you prefer?", "options": ["Clothes", "Souvenirs", "Electronics", "Food", "Accessories"]},
                            {"question": "What type of nature do you prefer?", "options": ["Beach", "Mountains", "Desert", "Forest", "Lake", "River"]},
                            ]

    return preference_questions