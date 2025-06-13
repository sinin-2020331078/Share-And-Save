from rest_framework import serializers
from .models import Notification
 
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'read', 'created_at', 'related_item_id']
        read_only_fields = ['created_at'] 