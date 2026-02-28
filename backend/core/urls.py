from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/auth/', include('users.urls')),
    path('api/events/', include('events.urls')),
    path('api/registrations/', include('registrations.urls')),
    path('api/teams/', include('teams.urls')),
    path('api/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
