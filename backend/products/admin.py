from django.contrib import admin
from .models import FoodItem, FreeProduct, DiscountProduct

@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'is_free', 'location', 'user', 'created_at')
    list_filter = ('category', 'is_free', 'created_at')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'created_at'

@admin.register(FreeProduct)
class FreeProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'condition', 'location', 'user', 'is_available', 'created_at')
    list_filter = ('category', 'condition', 'is_available', 'created_at')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'created_at'

@admin.register(DiscountProduct)
class DiscountProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'condition', 'original_price', 'discount_price', 'location', 'user', 'is_available', 'created_at')
    list_filter = ('category', 'condition', 'is_available', 'created_at')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'created_at' 