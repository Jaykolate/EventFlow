from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import NotificationModel
from events.models import EventModel
from core.permissions import IsOrganizer
from registrations.models import RegistrationModel
import datetime

# Helper to serialize Notification PyMongo dictionary
def serialize_notification(notif):
    if not notif: return None
    return {
        'id': str(notif['_id']),
        'user': notif.get('user'),
        'message': notif.get('message'),
        'type': notif.get('type', 'info'),
        'is_read': notif.get('is_read', False),
        'created_at': notif.get('created_at')
    }

class SendNotificationView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizer]

    def post(self, request):
        event_id = request.data.get('event_id')
        message = request.data.get('message')
        notif_type = request.data.get('type', 'info')

        if not event_id or not message:
            return Response({'error': 'Event ID and message required'}, status=status.HTTP_400_BAD_REQUEST)

        event = EventModel.get_by_id(event_id)
        if not event or event.get('organizer') != str(request.user['_id']):
            return Response({'error': 'Event not found or permission denied'}, status=status.HTTP_403_FORBIDDEN)

        regs = RegistrationModel.get_all({'event': event_id})
        
        # In a real app we'd bulk insert or use a background task like Celery
        for reg in regs:
            NotificationModel.create({
                'user': reg.get('user'),
                'message': message,
                'type': notif_type,
                'is_read': False,
                'created_at': datetime.datetime.utcnow().isoformat()
            })

        return Response({'message': f'Notification sent to {len(regs)} participants.'}, status=status.HTTP_200_OK)

class UserNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user['_id'])
        notifs = NotificationModel.get_user_notifications(user_id)
        return Response([serialize_notification(n) for n in notifs][:50]) # Limit to 50 for performance

class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        notif = NotificationModel.get_by_id(pk)
        if not notif:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if notif.get('user') != str(request.user['_id']):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        NotificationModel.mark_read(pk)
        return Response({'message': 'Marked read'}, status=status.HTTP_200_OK)

class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user_id = str(request.user['_id'])
        NotificationModel.mark_all_read(user_id)
        return Response({'message': 'All marked read'}, status=status.HTTP_200_OK)
