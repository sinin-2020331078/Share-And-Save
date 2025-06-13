from rest_framework import serializers
from .models import FoodItem, FreeProduct, DiscountProduct, CartItem

class FoodItemSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    user_id = serializers.ReadOnlyField(source='user.id')
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FoodItem
        fields = [
            'id', 'title', 'description', 'category', 'price',
            'is_free', 'location', 'expiry_date', 'image',
            'image_url', 'created_at', 'updated_at', 'user', 'user_id'
        ]
        read_only_fields = ['user', 'user_id', 'created_at', 'updated_at']

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
        
        # Ensure price is an integer
        if data.get('price') is not None:
            try:
                data['price'] = int(data['price'])
            except (ValueError, TypeError):
                raise serializers.ValidationError("Price must be a whole number")
        
        return data

    def create(self, validated_data):
        if validated_data.get('is_free'):
            validated_data['price'] = None
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('is_free'):
            validated_data['price'] = None
        return super().update(instance, validated_data)

class FreeProductSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FreeProduct
        fields = [
            'id', 'title', 'description', 'category', 'condition',
            'location', 'image', 'image_url', 'created_at', 
            'updated_at', 'user', 'is_available'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email
        }

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

class DiscountProductSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    user_id = serializers.ReadOnlyField(source='user.id')
    image_url = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = DiscountProduct
        fields = [
            'id', 'title', 'description', 'category', 'condition',
            'original_price', 'discount_price', 'discount_percentage',
            'location', 'image', 'image_url', 'created_at', 
            'updated_at', 'user', 'user_id', 'is_available'
        ]
        read_only_fields = ['user', 'user_id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        try:
            if obj.image:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return obj.image.url
            return None
        except Exception as e:
            print(f"Error getting image URL: {str(e)}")
            return None

    def get_discount_percentage(self, obj):
        try:
            if obj.original_price and obj.discount_price:
                discount = ((obj.original_price - obj.discount_price) / obj.original_price) * 100
                return round(discount, 1)
            return 0
        except Exception as e:
            print(f"Error calculating discount percentage: {str(e)}")
            return 0

    def to_representation(self, instance):
        try:
            data = super().to_representation(instance)
            # Ensure image_url is always a string or null
            if data.get('image_url') is None:
                data['image_url'] = None
            return data
        except Exception as e:
            print(f"Error in to_representation: {str(e)}")
            raise

    def validate(self, data):
        try:
            # Convert prices to integers
            if 'original_price' in data:
                data['original_price'] = int(data['original_price'])
            if 'discount_price' in data:
                data['discount_price'] = int(data['discount_price'])

            # Validate required fields
            required_fields = ['title', 'description', 'category', 'condition', 'location', 'original_price', 'discount_price']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f"{field} is required")
            
            # Validate discount price is less than original price
            if data.get('discount_price') and data.get('original_price'):
                if data['discount_price'] >= data['original_price']:
                    raise serializers.ValidationError("Discount price must be less than original price")
            
            return data
        except ValueError:
            raise serializers.ValidationError("Prices must be whole numbers")
        except Exception as e:
            print(f"Error in validation: {str(e)}")
            raise

    def create(self, validated_data):
        try:
            validated_data['is_available'] = True
            return super().create(validated_data)
        except Exception as e:
            print(f"Error in create: {str(e)}")
            raise

    def update(self, instance, validated_data):
        try:
            # Log the update data
            print("Updating discount product with data:", validated_data)
            
            # Update the product
            product = super().update(instance, validated_data)
            
            # Log the updated product
            print("Updated discount product:", product)
            return product
        except Exception as e:
            print(f"Error in update: {str(e)}")
            raise

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = [
            'id', 'item_type', 'item_id', 'title', 'description',
            'price', 'quantity', 'image_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        # Ensure price is an integer
        if data.get('price') is not None:
            try:
                data['price'] = int(data['price'])
            except (ValueError, TypeError):
                raise serializers.ValidationError("Price must be a whole number")
        
        # Ensure quantity is positive
        if data.get('quantity', 1) < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        
        return data 