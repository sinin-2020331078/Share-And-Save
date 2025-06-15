from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    EmailVerificationView,
    ReputationViewSet,
    PublicUserView
)

router = DefaultRouter()
router.register(r'reputation', ReputationViewSet, basename='reputation')

urlpatterns = [
    # Authentication endpoints
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoint
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Email verification endpoint
    path('verify-email/', EmailVerificationView.as_view(), name='verify_email'),
    
    # Public user info
    path('public/<int:pk>/', PublicUserView.as_view(), name='public_user'),
    
    # Reputation endpoints
    path('', include(router.urls)),
]