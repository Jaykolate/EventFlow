from django.urls import path
from .views import EventRegisterView, MyRegistrationsView, EventParticipantsView, RegistrationCancelView

urlpatterns = [
    path('', EventRegisterView.as_view(), name='register-event'),
    path('my/', MyRegistrationsView.as_view(), name='my-registrations'),
    path('event/<str:event_id>/', EventParticipantsView.as_view(), name='event-participants'),
    path('<str:pk>/', RegistrationCancelView.as_view(), name='cancel-registration'),
]
