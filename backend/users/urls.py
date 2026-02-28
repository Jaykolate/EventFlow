from django.urls import path
from .views import RegisterView, LoginView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    # Note: refresh is just an alias for login token right now for simplicity 
    # since we are manually handling JWTs via PyMongo
    path('refresh/', LoginView.as_view(), name='token_refresh'), 
    path('me/', UserProfileView.as_view(), name='user_profile'),
]
