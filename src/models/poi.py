from pymodm import MongoModel, fields
from pymongo import IndexModel

class Pois(MongoModel):
    name = fields.CharField(blank=True)
    city = fields.CharField(blank=True)
    address = fields.CharField(blank=True)
    location = fields.EmbeddedDocumentField('Location', blank=True)
    openHrs = fields.EmbeddedDocumentField('OpeningHours', blank=True)
    type = fields.ListField(fields.CharField(), blank=True)
    rating = fields.FloatField(blank=True)
    review = fields.ListField(blank=True)
    price = fields.FloatField(blank=True)
    isFree = fields.BooleanField(blank=True)
    timeSpent = fields.EmbeddedDocumentField('TimeSpent', blank=True)
    description = fields.CharField(blank=True)
    pincode = fields.IntegerField(blank=True)
    images = fields.ListField(fields.CharField(), blank=True)
    website = fields.CharField(blank=True)
    internationalPhoneNumber = fields.CharField(blank=True)
    generatedDescription = fields.CharField(blank=True)
    lat = fields.FloatField(blank=True)
    lon = fields.FloatField(blank=True)
    

    class Meta:
        indexes = [IndexModel([("name", 1), ("city", 1)], unique=True)]

class Address(MongoModel):
    city = fields.CharField(required=False)
    country = fields.CharField(required=False)
    state = fields.CharField(required=False)

class Location(MongoModel):
    latitude = fields.FloatField()
    longitude = fields.FloatField()

class OpeningHours(MongoModel):
    Mon = fields.EmbeddedDocumentField('Day')
    Tue = fields.EmbeddedDocumentField('Day')
    Wed = fields.EmbeddedDocumentField('Day')
    Thu = fields.EmbeddedDocumentField('Day')
    Fri = fields.EmbeddedDocumentField('Day')
    Sat = fields.EmbeddedDocumentField('Day')
    Sun = fields.EmbeddedDocumentField('Day')

class Day(MongoModel):
    startTime = fields.CharField()
    endTime = fields.CharField()

class TimeSpent(MongoModel):
    avgTime = fields.FloatField()
    minTime = fields.FloatField()
    maxTime = fields.FloatField()
