from rest_framework import serializers
from .models import Registration
from events.serializers import EventSerializer
from users.serializers import UserSerializer

class RegistrationSerializer(serializers.ModelSerializer):
    event_details = EventSerializer(source='event', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = ('user', 'status', 'registered_at')

class RegistrationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ('event',)
