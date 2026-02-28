from core.mongo import db
from bson.objectid import ObjectId

class EventModel:
    collection = db['events']

    @classmethod
    def get_all(cls, filters=None):
        filters = filters or {}
        return list(cls.collection.find(filters))

    @classmethod
    def get_by_id(cls, event_id):
        try:
            return cls.collection.find_one({'_id': ObjectId(event_id)})
        except:
            return None

    @classmethod
    def create(cls, data):
        result = cls.collection.insert_one(data)
        data['_id'] = result.inserted_id
        return data

    @classmethod
    def update(cls, event_id, data):
        try:
            cls.collection.update_one({'_id': ObjectId(event_id)}, {'$set': data})
            return cls.get_by_id(event_id)
        except:
            return None

    @classmethod
    def delete(cls, event_id):
        try:
            result = cls.collection.delete_one({'_id': ObjectId(event_id)})
            return result.deleted_count > 0
        except:
            return False
