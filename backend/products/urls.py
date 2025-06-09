from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FoodItemViewSet, FreeProductViewSet

router = DefaultRouter()
router.register(r'food', FoodItemViewSet)
router.register(r'free-products', FreeProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 