from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import TeamModel
from events.models import EventModel
from users.models import UserModel
from registrations.models import RegistrationModel
import datetime

# Helper to serialize Team with hydrated member info
def serialize_team(team):
    if not team: return None
    
    event = EventModel.get_by_id(team.get('event'))
    event_details = {
        'id': str(event['_id']),
        'title': event.get('title')
    } if event else None

    members_details = []
    for m_id in team.get('members', []):
        u = UserModel.get_by_id(m_id)
        if u:
            members_details.append({
                'id': str(u['_id']),
                'name': u.get('name')
            })

    return {
        'id': str(team['_id']),
        'event': team.get('event'),
        'event_details': event_details,
        'team_name': team.get('team_name'),
        'leader': team.get('leader'),
        'members': team.get('members', []),
        'members_details': members_details,
        'max_size': team.get('max_size', 4),
        'created_at': team.get('created_at')
    }

class TeamCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data.copy()
        user_id = str(request.user['_id'])
        event_id = data.get('event')

        # Check if already in a team for this event
        if TeamModel.get_user_team_for_event(user_id, event_id):
             return Response({'error': 'You are already in a team for this event'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user is actually registered for the event before creating a team
        if not RegistrationModel.check_exists(user_id, event_id):
            return Response({'error': 'You must register for the event before forming a team'}, status=status.HTTP_400_BAD_REQUEST)

        data['leader'] = user_id
        data['members'] = [user_id]
        data['created_at'] = datetime.datetime.utcnow().isoformat()
        
        # Default max size if not provided or invalid
        try:
           data['max_size'] = int(data.get('max_size', 4))
        except ValueError:
           data['max_size'] = 4
           
        team = TeamModel.create(data)
        return Response(serialize_team(team), status=status.HTTP_201_CREATED)

class EventTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        teams = TeamModel.get_all({'event': str(event_id)})
        return Response([serialize_team(t) for t in teams])

class JoinTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user_id = str(request.user['_id'])
        team = TeamModel.get_by_id(pk)

        if not team:
            return Response({'error': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)

        event_id = team.get('event')

        # Verify Registration
        if not RegistrationModel.check_exists(user_id, event_id):
            return Response({'error': 'You must register for the event first'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify not already in a team
        if TeamModel.get_user_team_for_event(user_id, event_id):
             return Response({'error': 'You are already in a team for this event'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify capacity
        if len(team.get('members', [])) >= team.get('max_size', 4):
             return Response({'error': 'Team is full'}, status=status.HTTP_400_BAD_REQUEST)

        TeamModel.add_member(pk, user_id)
        
        # trigger notification manual via PyMongo
        from notifications.models import NotificationModel
        NotificationModel.create({
            'user': user_id,
            'message': f"You joined team '{team.get('team_name')}'",
            'type': 'success',
            'created_at': datetime.datetime.utcnow().isoformat(),
            'is_read': False
        })
        NotificationModel.create({
            'user': team.get('leader'),
            'message': f"{request.user.get('name')} joined your team '{team.get('team_name')}'",
            'type': 'info',
            'created_at': datetime.datetime.utcnow().isoformat(),
            'is_read': False
        })

        return Response({'message': 'Joined successfully'}, status=status.HTTP_200_OK)

class LeaveTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        user_id = str(request.user['_id'])
        team = TeamModel.get_by_id(pk)

        if not team:
            return Response({'error': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)

        if user_id not in team.get('members', []):
             return Response({'error': 'You are not in this team'}, status=status.HTTP_400_BAD_REQUEST)
             
        if user_id == team.get('leader'):
             return Response({'error': 'Leader cannot leave. Delete team instead or transfer leadership (not implemented).'}, status=status.HTTP_400_BAD_REQUEST)

        TeamModel.remove_member(pk, user_id)
        
        # Notify leader
        from notifications.models import NotificationModel
        NotificationModel.create({
            'user': team.get('leader'),
            'message': f"{request.user.get('name')} left your team '{team.get('team_name')}'",
            'type': 'warning',
            'created_at': datetime.datetime.utcnow().isoformat(),
            'is_read': False
        })
        
        return Response({'message': 'Left team successfully'}, status=status.HTTP_200_OK)

class MyTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        user_id = str(request.user['_id'])
        team = TeamModel.get_user_team_for_event(user_id, event_id)

        if not team:
            return Response({'error': 'You are not in a team for this event'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serialize_team(team))
