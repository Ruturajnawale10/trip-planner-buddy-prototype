from pymodm import MongoModel, fields

class User(MongoModel):
    email = fields.EmailField(required=True)
    first_name = fields.CharField(required=True)
    last_name = fields.CharField(required=False)
    password = fields.CharField(required=False)