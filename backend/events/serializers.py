from rest_framework import serializers
from .models import Event
from users.serializers import UserSerializer

class EventSerializer(serializers.ModelSerializer):
    organizer_details = UserSerializer(source='organizer', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('organizer', 'created_at')

class EventCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('organizer', 'created_at')
