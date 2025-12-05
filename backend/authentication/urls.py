from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, UserMeView,
    UserListView, UserDetailView, UserUpdateView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeView.as_view(), name='user_me'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('users/<uuid:pk>/update/', UserUpdateView.as_view(), name='user_update'),
]
