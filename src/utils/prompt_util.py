

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