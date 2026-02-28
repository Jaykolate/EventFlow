import os
from rest_framework import authentication
from rest_framework import exceptions
import jwt
from django.conf import settings
from .models import UserModel

class PyMongoUser:
    def __init__(self, user_dict):
        self.is_authenticated = True
        self.id = str(user_dict['_id'])
        self._id = str(user_dict['_id'])
        self.email = user_dict.get('email')
        self.name = user_dict.get('name')
        self.role = user_dict.get('role', 'participant')
        self.is_active = True
        
    def __str__(self):
        return self.email
        
    def get(self, key, default=None):
        return getattr(self, key, default)

    def __getitem__(self, key):
        if key == '_id': return self.id
        return getattr(self, key)
from rest_framework import exceptions
import jwt
from django.conf import settings
from .models import UserModel

class PyMongoJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
            
        user = UserModel.get_by_id(payload.get('user_id'))
        if not user:
            raise exceptions.AuthenticationFailed('User not found')
            
        mongo_user = PyMongoUser(user)
            
        return (mongo_user, token)
