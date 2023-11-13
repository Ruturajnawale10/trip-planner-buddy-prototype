

def generate_gpt_prompt(destination, preferences, poi_list):
    gpt_prompt = '{"user": "Create recommendations for a user based on preferences : ' + str(preferences)
    gpt_prompt += ' for the places in city :' + destination
    gpt_prompt += ' from the follwoing array of point_of_intrests : point_of_intrests in ['
    for poi in poi_list:
        gpt_prompt += ' name : ' + poi['name'] + ' id : ' + str(poi['poi_id']) 
        gpt_prompt += ' type of place : ' + '['
        for type_itr in poi['type']:
            gpt_prompt += type_itr + ',' 
        gpt_prompt +=  ']'
    gpt_prompt += ']"}'
    return gpt_prompt

def generate_gpt_prompt_for_personalized_description(destination, preferences, poi):
    gpt_prompt = 'Generate a personalized descrition why the user would like to vist this place who has the following preference : ' + str(preferences)
    gpt_prompt += '. place : ' + poi['name'] + ' in city : ' + destination
    gpt_prompt += ' with the following details : ' + ' name : ' + poi['name'] + ', id : ' + str(poi['poi_id'])
    gpt_prompt += ', type of place : ' + '['
    for type_itr in poi['type']:
        gpt_prompt += type_itr + ','
    gpt_prompt += ']'
    gpt_prompt += ', description : ' + poi['description'] + poi['generatedDescription'] + ', address : ' + poi['address']
    gpt_prompt += ' Limit the output to 2-3 lines. and start with you will like this place as your preference .. '
    return gpt_prompt

