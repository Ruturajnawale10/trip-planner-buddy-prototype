from fastapi import APIRouter, HTTPException

router = APIRouter(
    tags=['Preference Question']
)

# This function will return a list of questions and list of options for each question for user preferences
@router.get("/api/preference/questions")
def get_preference_questions():
    preference_questions = [{"question": "What type of place do you prefer?", "options": ["Historical", "Religious", "Adventure", "Nature", "Shopping", "Food"]},
                            {"question": "What type of adventure do you prefer?", "options": ["Water Sports", "Hiking", "Camping", "Skiing", "Paragliding", "Bungee Jumping"]},
                            {"question": "What type of nature do you prefer?", "options": ["Beach", "Mountains", "Desert", "Forest", "Lake", "River"]},
                            {"question": "What type of shopping do you prefer?", "options": ["Clothes", "Souvenirs", "Electronics", "Food", "Accessories"]},

                            ]

    return preference_questions