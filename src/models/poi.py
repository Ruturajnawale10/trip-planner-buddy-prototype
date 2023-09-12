from pymodm import MongoModel, fields

class Pois(MongoModel):
    # placeId = fields.ObjectIdField(primary_key=True)
    name = fields.CharField()
    city = fields.CharField()
    address = fields.CharField()
    location = fields.EmbeddedDocumentField('Location')
    openHrs = fields.EmbeddedDocumentField('OpeningHours')
    type = fields.ListField(fields.CharField())
    rating = fields.FloatField()
    review = fields.ListField(required=False)
    price = fields.FloatField(required=False)
    isFree = fields.BooleanField()
    timeSpent = fields.EmbeddedDocumentField('TimeSpent')
    description = fields.CharField()
    pincode = fields.IntegerField()
    images = fields.ListField(fields.CharField())
    # tripadvisorRating = fields.FloatField()
    website = fields.CharField()
    internationalPhoneNumber = fields.CharField()
    generatedDescription = fields.CharField()

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
