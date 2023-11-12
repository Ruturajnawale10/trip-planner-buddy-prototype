from pymodm import MongoModel, fields
from pymongo import IndexModel, ASCENDING

class User(MongoModel):
    username = fields.CharField(required=True)
    password = fields.CharField(required=True)
    google_auth = fields.BooleanField(required=False, default=False)
    profile = fields.EmbeddedDocumentField('Profile', required=False)
    upcoming_trips = fields.ListField(field=fields.ObjectIdField(), blank=True)
    past_trips = fields.ListField(field=fields.ObjectIdField(), blank=True)
    shared_itineraries = fields.ListField(field=fields.ObjectIdField(), blank=True)
    preferences = fields.ListField(required=False, blank=True)
    # Other user-related data

    class Profile(MongoModel):
        first_name = fields.CharField(required=False, blank=True)
        last_name = fields.CharField(required=False, blank=True)
        # Other user profile information

    class Meta:
        indexes = [IndexModel([('username', ASCENDING)], unique=True)]
