from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from .models import FoodItem, FreeProduct
from .serializers import FoodItemSerializer, FreeProductSerializer
from django.db import models
import logging

logger = logging.getLogger(__name__)

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        logger.info(f"Creating food item with data: {serializer.validated_data}")
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Received request data: {request.data}")
            response = super().create(request, *args, **kwargs)
            logger.info(f"Created food item: {response.data}")
            return response
        except Exception as e:
            logger.error(f"Error creating food item: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get_queryset(self):
        queryset = FoodItem.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter free items
        free_only = self.request.query_params.get('free_only', None)
        if free_only == 'true':
            queryset = queryset.filter(is_free=True)
        
        # Search by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )
        
        logger.info(f"Filtered queryset count: {queryset.count()}")
        return queryset

    @action(detail=False, methods=['get'])
    def my_items(self, request):
        """Get food items listed by the current user"""
        items = FoodItem.objects.filter(user=request.user)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)

class FreeProductViewSet(viewsets.ModelViewSet):
    queryset = FreeProduct.objects.filter(is_available=True)
    serializer_class = FreeProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        logger.info(f"Creating free product with data: {serializer.validated_data}")
        try:
            product = serializer.save(user=self.request.user)
            logger.info(f"Successfully created free product with ID: {product.id}")
            return product
        except Exception as e:
            logger.error(f"Error creating free product: {str(e)}")
            raise

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Received request data: {request.data}")
            response = super().create(request, *args, **kwargs)
            logger.info(f"Created free product: {response.data}")
            return response
        except Exception as e:
            logger.error(f"Error creating free product: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get_queryset(self):
        queryset = FreeProduct.objects.filter(is_available=True)
        logger.info(f"Initial queryset count: {queryset.count()}")
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
            logger.info(f"After category filter count: {queryset.count()}")
        
        # Filter by condition
        condition = self.request.query_params.get('condition', None)
        if condition:
            queryset = queryset.filter(condition=condition)
            logger.info(f"After condition filter count: {queryset.count()}")
        
        # Search by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )
            logger.info(f"After search filter count: {queryset.count()}")
        
        # Log all products in queryset
        logger.info("Products in queryset:")
        for product in queryset:
            logger.info(f"Product ID: {product.id}, Title: {product.title}, Available: {product.is_available}")
        
        return queryset

    def list(self, request, *args, **kwargs):
        logger.info("Listing free products")
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Returning {len(serializer.data)} products")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error listing free products: {str(e)}")
            return Response(
                {'error': 'Failed to list free products'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def my_items(self, request):
        """Get free products listed by the current user"""
        logger.info(f"Getting items for user: {request.user.email}")
        try:
            items = FreeProduct.objects.filter(user=request.user)
            logger.info(f"Found {items.count()} items for user")
            serializer = self.get_serializer(items, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error getting user items: {str(e)}")
            return Response(
                {'error': 'Failed to get user items'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def mark_unavailable(self, request, pk=None):
        """Mark a free product as unavailable"""
        try:
            product = self.get_object()
            product.is_available = False
            product.save()
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error marking product as unavailable: {str(e)}")
            return Response(
                {'error': 'Failed to mark product as unavailable'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 