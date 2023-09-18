from pymodm import MongoModel, fields, EmbeddedMongoModel

class Trip(MongoModel):
    trip_name = fields.CharField(required=True)
    startDate = fields.DateTimeField(required=True)
    endDate = fields.DateTimeField(required=True)
    cityName = fields.CharField(required=True)
    #stores poi_id of pois. It is list of lists, where 1st list has poi_ids of day 1, 2nd list of day 2 etc...
    pois = fields.ListField()
    createdBy = fields.ObjectIdField(required=True)
    isUpcoming = fields.BooleanField(default=True)
    isPublic = fields.BooleanField(default=False)
    selfReview = fields.CharField()
    rating = fields.FloatField()
    comments = fields.EmbeddedDocumentListField('Comment')

    class Comment(EmbeddedMongoModel):
        userId = fields.ObjectIdField()
        comment = fields.CharField()