from rest_framework import serializers
from .models import Team
from users.serializers import UserSerializer
from events.serializers import EventSerializer

class TeamSerializer(serializers.ModelSerializer):
    leader_details = UserSerializer(source='leader', read_only=True)
    members_details = UserSerializer(source='members', many=True, read_only=True)
    event_details = EventSerializer(source='event', read_only=True)

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ('leader', 'members', 'created_at')

class TeamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ('event', 'team_name', 'max_size')
