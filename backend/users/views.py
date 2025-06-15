from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework import viewsets
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import secrets
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    EmailVerificationSerializer,
    UserProfileSerializer,
    ReputationHistorySerializer,
    PublicUserSerializer
)
from .models import User, UserProfile, ReputationHistory
from .utils import award_reputation_points, calculate_user_trust_score
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, permission_classes

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate email verification token
        user.email_verification_token = secrets.token_urlsafe(32)
        user.save()
        
        # TODO: Send verification email
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserLoginView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle user data
        user_data = request.data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Handle profile data
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

class EmailVerificationView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = EmailVerificationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = User.objects.get(email_verification_token=serializer.validated_data['token'])
            user.is_email_verified = True
            user.email_verification_token = None
            user.save()
            
            return Response({
                'message': 'Email has been verified successfully.'
            })
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid verification token.'
            }, status=status.HTTP_400_BAD_REQUEST)

class ReputationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReputationHistorySerializer
    
    def get_queryset(self):
        return ReputationHistory.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get reputation summary for the current user"""
        user = request.user
        trust_score = calculate_user_trust_score(user)
        
        return Response({
            'reputation_points': user.reputation_points,
            'reputation_level': user.get_reputation_level(),
            'reputation_badges': user.get_reputation_badges(),
            'trust_score': round(trust_score, 1),
            'total_items_shared': user.total_items_shared,
            'total_items_received': user.total_items_received,
            'successful_transactions': user.successful_transactions,
        })

class PublicUserView(generics.RetrieveAPIView):
    """View for getting public user information"""
    permission_classes = [AllowAny]
    serializer_class = PublicUserSerializer
    queryset = User.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Add trust score
        trust_score = calculate_user_trust_score(instance)
        data['trust_score'] = round(trust_score, 1)
        
        return Response(data)