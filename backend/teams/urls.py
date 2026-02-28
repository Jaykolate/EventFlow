from django.urls import path
from .views import TeamCreateView, EventTeamsView, JoinTeamView, LeaveTeamView, MyTeamView

urlpatterns = [
    path('', TeamCreateView.as_view(), name='create-team'),
    path('event/<str:event_id>/', EventTeamsView.as_view(), name='event-teams'),
    path('<str:pk>/join/', JoinTeamView.as_view(), name='join-team'),
    path('<str:pk>/leave/', LeaveTeamView.as_view(), name='leave-team'),
    path('my-team/<str:event_id>/', MyTeamView.as_view(), name='my-team'),
]
