from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
import jwt
import datetime

from .models import UserModel

def generate_tokens(user_id):
    access_payload = {
        'user_id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow()
    }
    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')
    return {'access': access_token, 'refresh': access_token} # Simplified for manual PyMongo implementation

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        password = request.data.get('password')
        role = request.data.get('role', 'participant')
        
        if not email or not name or not password:
            return Response({'error': 'Please provide email, name, and password.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if UserModel.get_by_email(email):
            return Response({'error': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = UserModel.create_user(email=email, name=name, password=password, role=role)
        tokens = generate_tokens(user['_id'])
        
        return Response({
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user['role']
            },
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = UserModel.get_by_email(email)
        if not user or not UserModel.check_password(password, user['password']):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
        tokens = generate_tokens(user['_id'])
        return Response(tokens, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    # We will need to set our custom auth class in settings or view
    def get(self, request):
        user = request.user
        return Response({
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'role': user['role'],
            'is_active': user.get('is_active', True)
        })
