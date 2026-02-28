from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import RegistrationModel
from events.models import EventModel
from users.models import UserModel
from core.permissions import IsOrganizer, IsParticipant
import datetime

# Helper to serialize and enrich registration with related document details
def serialize_registration(reg):
    if not reg: return None
    
    event = EventModel.get_by_id(reg.get('event'))
    event_details = {
        'id': str(event['_id']),
        'title': event.get('title'),
        'date': event.get('date'),
        'time': event.get('time'),
        'location': event.get('location'),
        'banner_image': event.get('banner_image'),
        'status': event.get('status')
    } if event else None

    user = UserModel.get_by_id(reg.get('user'))
    user_details = {
        'id': str(user['_id']),
        'name': user.get('name'),
        'email': user.get('email')
    } if user else None

    return {
        'id': str(reg['_id']),
        'user': reg.get('user'),
        'user_details': user_details,
        'event': reg.get('event'),
        'event_details': event_details,
        'status': reg.get('status'),
        'registered_at': reg.get('registered_at')
    }

class EventRegisterView(APIView):
    permission_classes = [IsAuthenticated, IsParticipant]

    def post(self, request):
        event_id = request.data.get('event')
        user_id = str(request.user['_id'])

        event = EventModel.get_by_id(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        if RegistrationModel.check_exists(user_id, event_id):
            return Response({'error': 'Already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)

        # Capacity check
        current_count = len(RegistrationModel.get_all({'event': event_id}))
        max_cap = event.get('max_participants', 0)
        
        # Make sure it's int for comparison
        try:
           max_cap = int(max_cap)
        except ValueError:
           pass
           
        if isinstance(max_cap, int) and current_count >= max_cap:
            return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'user': user_id,
            'event': event_id,
            'registered_at': datetime.datetime.utcnow().isoformat()
        }
        reg = RegistrationModel.create(data)
        
        # trigger notification manual via PyMongo (signals removed)
        from notifications.models import NotificationModel
        NotificationModel.create({
            'user': user_id,
            'message': f"Successfully registered for {event.get('title')}",
            'type': 'success',
            'created_at': datetime.datetime.utcnow().isoformat(),
            'is_read': False
        })

        return Response(serialize_registration(reg), status=status.HTTP_201_CREATED)

class MyRegistrationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user['_id'])
        regs = RegistrationModel.get_all({'user': user_id})
        return Response([serialize_registration(r) for r in regs])

class EventParticipantsView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizer]

    def get(self, request, event_id):
        event = EventModel.get_by_id(event_id)
        if not event or event.get('organizer') != str(request.user['_id']):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        regs = RegistrationModel.get_all({'event': event_id})
        return Response([serialize_registration(r) for r in regs])

class RegistrationCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        reg = RegistrationModel.get_by_id(pk)
        if not reg:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if reg['user'] != str(request.user['_id']):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        RegistrationModel.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
