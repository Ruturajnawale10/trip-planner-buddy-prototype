from pymodm import MongoModel, fields
from pymongo import IndexModel, ASCENDING

class User(MongoModel):
    username = fields.CharField(required=True)
    password = fields.CharField(required=True)
    google_auth = fields.BooleanField(required=False, default=False)
    profile = fields.EmbeddedDocumentField('Profile', required=False)
    upcoming_trips = fields.ListField(field=fields.ObjectIdField(), required=False)
    past_trips = fields.ListField(field=fields.ObjectIdField(), required=False)
    shared_itineraries = fields.ListField(field=fields.ObjectIdField(), required=False)
    # Other user-related data

    class Profile(MongoModel):
        first_name = fields.CharField(required=False)
        last_name = fields.CharField(required=False)
        # Other user profile information

    class Meta:
        indexes = [IndexModel([('username', ASCENDING)], unique=True)]
