from rest_framework import serializers
from .models import FoodItem, FreeProduct

class FoodItemSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FoodItem
        fields = [
            'id', 'title', 'description', 'category', 'price',
            'is_free', 'location', 'expiry_date', 'image',
            'image_url', 'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate(self, data):
        if not data.get('is_free') and not data.get('price'):
            raise serializers.ValidationError("Price is required for non-free items")
        
        if data.get('is_free') and data.get('price'):
            raise serializers.ValidationError("Price should not be set for free items")
        
        return data

    def create(self, validated_data):
        # Ensure price is None for free items
        if validated_data.get('is_free'):
            validated_data['price'] = None
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ensure price is None for free items
        if validated_data.get('is_free'):
            validated_data['price'] = None
        return super().update(instance, validated_data)

class FreeProductSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FreeProduct
        fields = [
            'id', 'title', 'description', 'category', 'condition',
            'location', 'image', 'image_url', 'created_at', 
            'updated_at', 'user', 'is_available'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate(self, data):
        # Log the validation data
        print("Validating free product data:", data)
        
        # Validate required fields
        required_fields = ['title', 'description', 'category', 'condition', 'location']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required")
        
        return data

    def create(self, validated_data):
        # Log the creation data
        print("Creating free product with data:", validated_data)
        
        # Ensure is_available is True for new products
        validated_data['is_available'] = True
        
        # Create the product
        product = super().create(validated_data)
        
        # Log the created product
        print("Created free product:", product)
        return product

    def update(self, instance, validated_data):
        # Log the update data
        print("Updating free product with data:", validated_data)
        
        # Update the product
        product = super().update(instance, validated_data)
        
        # Log the updated product
        print("Updated free product:", product)
        return product 