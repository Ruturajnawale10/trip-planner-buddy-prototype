from pymodm import MongoModel, fields
from pymongo import IndexModel
from typing import Optional
import geohash2

class GeoLocation(MongoModel):
    type = fields.CharField(default='Point')
    coordinates = fields.ListField(field=fields.FloatField())

class GeoInfo(MongoModel):
    poi_id = fields.IntegerField(blank=True)
    latitude = fields.FloatField()
    longitude = fields.FloatField()
    geohash = fields.CharField()
    # location = fields.ListField(fields.FloatField())
    location = fields.EmbeddedDocumentField('GeoLocation')

    class Meta:
        indexes = [
            IndexModel([('location', '2dsphere')])
        ]
    
    def calculate_geohash(self):
        """
        Calculate and populate the geohash field based on latitude and longitude.
        """
        self.geohash = geohash2.encode(self.latitude, self.longitude)