from django.urls import path
from .views import SendNotificationView, UserNotificationsView, MarkNotificationReadView, MarkAllNotificationsReadView

urlpatterns = [
    path('', UserNotificationsView.as_view(), name='user-notifications'),
    path('send/', SendNotificationView.as_view(), name='send-notification'),
    path('<str:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('read-all/', MarkAllNotificationsReadView.as_view(), name='mark-all-read'),
]
