from pymodm import MongoModel, fields
from pymongo import IndexModel

class City(MongoModel):
    city_id = fields.IntegerField(blank=True)
    city_info = fields.CharField(required = True)

    class Meta:
        indexes = [IndexModel([('city_id', 1)], unique=True)]