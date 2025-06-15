from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, ReputationHistory

User = get_user_model()

class ReputationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReputationHistory
        fields = ['id', 'action', 'points_earned', 'description', 'created_at', 'related_item_id', 'related_item_type']
        read_only_fields = ['created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    profile_picture_url = serializers.SerializerMethodField()
    user_id = serializers.ReadOnlyField(source='user.id')
    
    # Reputation fields
    reputation_points = serializers.ReadOnlyField(source='user.reputation_points')
    reputation_level = serializers.ReadOnlyField(source='user.get_reputation_level')
    reputation_badges = serializers.ReadOnlyField(source='user.get_reputation_badges')
    total_items_shared = serializers.ReadOnlyField(source='user.total_items_shared')
    total_items_received = serializers.ReadOnlyField(source='user.total_items_received')
    successful_transactions = serializers.ReadOnlyField(source='user.successful_transactions')

    class Meta:
        model = UserProfile
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'address', 
                 'profile_picture', 'profile_picture_url', 'bio', 'created_at', 'updated_at', 'user_id',
                 'reputation_points', 'reputation_level', 'reputation_badges', 'total_items_shared',
                 'total_items_received', 'successful_transactions']
        read_only_fields = ['created_at', 'updated_at']

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Flatten the data structure
        return {
            'user_id': instance.user.id,
            'email': data['email'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'phone_number': data['phone_number'],
            'address': data['address'],
            'profile_picture_url': data['profile_picture_url'],
            'bio': data['bio'],
            'reputation_points': data['reputation_points'],
            'reputation_level': data['reputation_level'],
            'reputation_badges': data['reputation_badges'],
            'total_items_shared': data['total_items_shared'],
            'total_items_received': data['total_items_received'],
            'successful_transactions': data['successful_transactions'],
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name', 'profile')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        
        # Award points for profile creation
        from .utils import award_reputation_points
        award_reputation_points(user, 'profile_completed', 10, "Welcome to Share&Save!")
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    reputation_level = serializers.ReadOnlyField(source='get_reputation_level')
    reputation_badges = serializers.ReadOnlyField(source='get_reputation_badges')

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_email_verified', 'profile',
                 'reputation_points', 'reputation_level', 'reputation_badges', 'total_items_shared',
                 'total_items_received', 'successful_transactions')
        read_only_fields = ('id', 'email', 'is_email_verified', 'reputation_points', 'total_items_shared',
                           'total_items_received', 'successful_transactions')

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)

class PublicUserSerializer(serializers.ModelSerializer):
    """Serializer for public user information (for displaying in listings, etc.)"""
    full_name = serializers.SerializerMethodField()
    reputation_level = serializers.ReadOnlyField(source='get_reputation_level')
    reputation_badges = serializers.ReadOnlyField(source='get_reputation_badges')
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'reputation_points',
                 'reputation_level', 'reputation_badges', 'total_items_shared', 'successful_transactions']
    
    def get_full_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return obj.email.split('@')[0]