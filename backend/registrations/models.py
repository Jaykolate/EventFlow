from core.mongo import db
from bson.objectid import ObjectId

class RegistrationModel:
    collection = db['registrations']

    @classmethod
    def get_all(cls, filters=None):
        return list(cls.collection.find(filters or {}))
        
    @classmethod
    def get_by_id(cls, reg_id):
        try:
            return cls.collection.find_one({'_id': ObjectId(reg_id)})
        except:
            return None

    @classmethod
    def create(cls, data):
        data['status'] = 'confirmed'
        result = cls.collection.insert_one(data)
        data['_id'] = result.inserted_id
        return data

    @classmethod
    def delete(cls, reg_id):
        try:
            result = cls.collection.delete_one({'_id': ObjectId(reg_id)})
            return result.deleted_count > 0
        except:
            return False

    @classmethod
    def check_exists(cls, user_id, event_id):
        return cls.collection.find_one({'user': str(user_id), 'event': str(event_id)}) is not None
