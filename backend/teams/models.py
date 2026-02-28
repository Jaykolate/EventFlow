from core.mongo import db
from bson.objectid import ObjectId

class TeamModel:
    collection = db['teams']

    @classmethod
    def get_all(cls, filters=None):
        return list(cls.collection.find(filters or {}))

    @classmethod
    def get_by_id(cls, team_id):
        try:
            return cls.collection.find_one({'_id': ObjectId(team_id)})
        except:
            return None

    @classmethod
    def create(cls, data):
        result = cls.collection.insert_one(data)
        data['_id'] = result.inserted_id
        return data

    @classmethod
    def update(cls, team_id, data):
        try:
            cls.collection.update_one({'_id': ObjectId(team_id)}, {'$set': data})
            return cls.get_by_id(team_id)
        except:
            return None

    @classmethod
    def get_user_team_for_event(cls, user_id, event_id):
        return cls.collection.find_one({
            'event': str(event_id),
            'members': str(user_id)
        })

    @classmethod
    def add_member(cls, team_id, user_id):
        try:
            cls.collection.update_one(
                {'_id': ObjectId(team_id)},
                {'$addToSet': {'members': str(user_id)}}
            )
            return True
        except:
            return False

    @classmethod
    def remove_member(cls, team_id, user_id):
        try:
            cls.collection.update_one(
                {'_id': ObjectId(team_id)},
                {'$pull': {'members': str(user_id)}}
            )
            return True
        except:
            return False
