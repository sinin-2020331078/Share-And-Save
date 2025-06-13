from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FoodItemViewSet, FreeProductViewSet, DiscountProductViewSet, CartItemViewSet

router = DefaultRouter()
router.register(r'food', FoodItemViewSet)
router.register(r'free-products', FreeProductViewSet)
router.register(r'discount-products', DiscountProductViewSet)
router.register(r'cart', CartItemViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
] 