from rest_framework import serializers
from .models import Request
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    time = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = ['id', 'user', 'title', 'description', 'category', 'location', 'status', 'created_at', 'time']
        read_only_fields = ['user', 'status', 'created_at']

    def get_time(self, obj):
        if not obj.created_at:
            return "Unknown"
            
        now = timezone.now()
        diff = now - obj.created_at

        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            minutes = diff.seconds // 60
            return f"{minutes}m ago"
        elif diff < timedelta(days=1):
            hours = diff.seconds // 3600
            return f"{hours}h ago"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days}d ago"
        else:
            return obj.created_at.strftime("%b %d, %Y")

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to create a request")
            
        validated_data['user'] = request.user
        validated_data['status'] = 'Active'
        return super().create(validated_data) 