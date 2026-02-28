from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import EventModel
from users.models import UserModel
from core.permissions import IsOrganizer
import datetime

# Helper to serialize MongoDB documents securely
def serialize_event(event):
    if not event: return None
    
    # Resolve Organizer Name
    organizer = UserModel.get_by_id(event.get('organizer'))
    organizer_details = {
        'id': str(organizer['_id']),
        'name': organizer.get('name'),
        'email': organizer.get('email')
    } if organizer else None

    return {
        'id': str(event.get('_id')),
        'title': event.get('title'),
        'description': event.get('description'),
        'category': event.get('category'),
        'date': event.get('date'),
        'time': event.get('time'),
        'location': event.get('location'),
        'banner_image': event.get('banner_image'),
        'max_participants': event.get('max_participants'),
        'organizer': event.get('organizer'), # store as string 
        'organizer_details': organizer_details,
        'status': event.get('status'),
        'created_at': event.get('created_at')
    }

class EventListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsOrganizer()]
        return [AllowAny()]

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        status_filter = request.query_params.get('status')

        filters = {}
        if category: filters['category'] = category
        if status_filter: filters['status'] = status_filter
        if search: filters['title'] = {'$regex': search, '$options': 'i'}

        events = EventModel.get_all(filters)
        return Response([serialize_event(e) for e in events])

    def post(self, request):
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data.copy()
        data['organizer'] = str(request.user['_id'])
        data['created_at'] = datetime.datetime.utcnow().isoformat()
        
        # In a real app we'd upload banner_image to S3/Cloudinary here, 
        # but for simplicity we'll just ignore binary file handling for now in direct PyMongo
        if 'banner_image' in data and hasattr(data['banner_image'], 'name'):
            # Just mocking file upload logic for PyMongo conversion demo
            data['banner_image'] = "https://via.placeholder.com/800x400?text=Event+Banner"
            
        event = EventModel.create(data)
        return Response(serialize_event(event), status=status.HTTP_201_CREATED)

class EventDetailView(APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsOrganizer()]
        return [AllowAny()]
        
    def get(self, request, pk):
        event = EventModel.get_by_id(pk)
        if not event: return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_event(event))
        
    def put(self, request, pk):
        event = EventModel.get_by_id(pk)
        if not event: return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if event['organizer'] != str(request.user['_id']):
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data.copy()
        
        # Mock file handling
        if 'banner_image' in data and hasattr(data['banner_image'], 'name'):
             data['banner_image'] = "https://via.placeholder.com/800x400?text=Event+Banner"
        elif 'banner_image' in data and not data['banner_image']:
             del data['banner_image']
             
        updated_event = EventModel.update(pk, data)
        return Response(serialize_event(updated_event))
        
    def delete(self, request, pk):
        event = EventModel.get_by_id(pk)
        if not event: return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if event['organizer'] != str(request.user['_id']):
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        EventModel.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrganizerEventsView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizer]
    
    def get(self, request):
        events = EventModel.get_all({'organizer': str(request.user['_id'])})
        return Response([serialize_event(e) for e in events])
