from django.contrib.auth.hashers import make_password, check_password
from core.mongo import db

# This class replaces Django ORM queries for the user collection
class UserModel:
    collection = db['users']

    @classmethod
    def create_user(cls, email, name, password, role='participant'):
        user_data = {
            'email': email,
            'name': name,
            'password': make_password(password),
            'role': role,
            'is_active': True,
        }
        result = cls.collection.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
        return user_data

    @classmethod
    def get_by_email(cls, email):
        return cls.collection.find_one({'email': email})

    @classmethod
    def get_by_id(cls, user_id):
        from bson.objectid import ObjectId
        try:
            return cls.collection.find_one({'_id': ObjectId(user_id)})
        except:
            return None

    @classmethod
    def check_password(cls, raw_password, hashed_password):
        return check_password(raw_password, hashed_password)
