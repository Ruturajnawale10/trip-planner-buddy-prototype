from pymodm import MongoModel, fields, EmbeddedMongoModel

class Trip(MongoModel):
    tripName = fields.CharField(required=True)
    startDate = fields.DateTimeField(required=True)
    endDate = fields.DateTimeField(required=True)
    noOfDays = fields.IntegerField(required=True)
    cityName = fields.CharField(required=True)
    #stores poi_id of pois. It is list of lists, where 1st list has poi_ids of day 1, 2nd list of day 2 etc...
    pois = fields.ListField(required=True)
    createdBy = fields.CharField(required=True)
    isUpcoming = fields.BooleanField(default=True)
    isPublic = fields.BooleanField(default=False)
    selfReview = fields.CharField()
    rating = fields.FloatField(default=0.0)
    userRatings = fields.ListField(default=[])
    comments = fields.EmbeddedDocumentListField('Comment')
    address = fields.CharField()
    radius = fields.IntegerField()

    class Comment(EmbeddedMongoModel):
        userId = fields.ObjectIdField()
        comment = fields.CharField()