from django.db import models
from django.conf import settings

# Create your models here.

class ChatRoom(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Chat Room {self.id}"

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.username} in {self.chat_room}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Award reputation points for community interaction
        if is_new:
            from users.utils import award_reputation_points, get_reputation_points_for_action
            points = get_reputation_points_for_action('community_interaction')
            award_reputation_points(
                user=self.sender,
                action='community_interaction',
                points=points,
                description="Sent a message in community chat"
            )