from django.urls import path
from .views import EventListCreateView, EventDetailView, OrganizerEventsView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'),
    path('my-events/', OrganizerEventsView.as_view(), name='organizer-events'),
    path('<str:pk>/', EventDetailView.as_view(), name='event-detail'),
]
