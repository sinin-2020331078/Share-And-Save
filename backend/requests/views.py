from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Request
from .serializers import RequestSerializer
import logging
from django.db import models

logger = logging.getLogger(__name__)

# Create your views here.

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authenticated users to create requests
    but allow anyone to view them.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests for any user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Require authentication for other methods
        return request.user and request.user.is_authenticated

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all().order_by('-created_at')
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Request.objects.all()
        logger.info(f"Initial queryset count: {queryset.count()}")
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
            logger.info(f"After category filter count: {queryset.count()}")
        
        # Search by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )
            logger.info(f"After search filter count: {queryset.count()}")
        
        # Search by location
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
            logger.info(f"After location filter count: {queryset.count()}")
        
        return queryset.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Creating request with data: {request.data}")
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger.info(f"Request created successfully: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating request: {str(e)}")
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Check if the user is the owner of the request
            if instance.user != request.user:
                logger.warning(f"User {request.user.email} attempted to delete request {instance.id} but is not the owner")
                return Response(
                    {'error': 'You do not have permission to delete this request'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            logger.info(f"Deleting request {instance.id} by user {request.user.email}")
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting request: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
