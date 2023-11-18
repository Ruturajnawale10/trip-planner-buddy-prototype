from pymodm import MongoModel, fields
from pymongo import IndexModel

class City(MongoModel):
    city_name = fields.CharField(required = True)
    city_id = fields.CharField(required = True)
    pois = fields.ListField(field=fields.EmbeddedDocumentField('Poi'), blank=True)
    geo = fields.DictField()
    stateName = fields.CharField(required = True)
    countryName = fields.CharField(required = True)
    nearby = fields.ListField(fields.DictField())
    categories = fields.ListField(fields.DictField())

    class Meta:
        indexes = [IndexModel([('city_id', 1)], unique=True)]

class Poi(MongoModel):
    poi_id = fields.IntegerField(blank=True)
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
    minMinutesSpent = fields.IntegerField(blank=True)
    maxMinutesSpent = fields.IntegerField(blank=True)
    description = fields.CharField(blank=True)
    pincode = fields.IntegerField(blank=True)
    images = fields.ListField(fields.CharField(), blank=True)
    website = fields.CharField(blank=True)
    internationalPhoneNumber = fields.CharField(blank=True)
    generatedDescription = fields.CharField(blank=True)

    class Meta:
        indexes = [IndexModel([('poi_id', 1)], unique=True)]

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
