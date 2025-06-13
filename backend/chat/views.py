from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from django.db import transaction
import threading

User = get_user_model()

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']  # Add delete to allowed methods

    def get_queryset(self):
        # Only return chat rooms where the user is a participant
        return ChatRoom.objects.filter(participants=self.request.user).prefetch_related(
            'participants',
            'messages',
            'messages__sender'
        ).distinct()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the requesting user is a participant
        if request.user not in instance.participants.all():
            raise PermissionDenied("You don't have permission to access this chat room")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the requesting user is a participant
        if request.user not in instance.participants.all():
            raise PermissionDenied("You don't have permission to delete this chat room")
        
        # Delete all messages in the chat room
        Message.objects.filter(chat_room=instance).delete()
        # Delete the chat room
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def get_or_create_chat(self, request):
        other_user_id = request.data.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Prevent users from creating a chat with themselves
        if other_user == request.user:
            return Response({'error': 'Cannot create chat with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # First, try to find an existing chat room
        existing_chat = ChatRoom.objects.filter(
            participants=request.user
        ).filter(
            participants=other_user
        ).prefetch_related(
            'participants',
            'messages',
            'messages__sender'
        ).first()

        if existing_chat:
            # Return the existing chat room
            serializer = self.get_serializer(existing_chat)
            return Response(serializer.data)

        # If no existing chat room found, create a new one
        chat_room = ChatRoom.objects.create()
        chat_room.participants.add(request.user, other_user)
        
        # Fetch the newly created chat room with all related data
        chat_room = ChatRoom.objects.filter(id=chat_room.id).prefetch_related(
            'participants',
            'messages',
            'messages__sender'
        ).first()
        
        serializer = self.get_serializer(chat_room)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']  # Only allow GET and POST methods

    def get_queryset(self):
        chat_room_id = self.request.query_params.get('chat_room')
        if not chat_room_id:
            return Message.objects.none()  # Return empty queryset if no chat_room specified

        # Verify the user is a participant in the chat room
        try:
            chat_room = ChatRoom.objects.get(id=chat_room_id, participants=self.request.user)
        except ChatRoom.DoesNotExist:
            return Message.objects.none()

        # Return messages for the specific chat room
        return Message.objects.filter(
            chat_room=chat_room
        ).select_related('sender').order_by('created_at')

    @transaction.atomic
    def perform_create(self, serializer):
        chat_room_id = self.request.data.get('chat_room')
        if not chat_room_id:
            raise PermissionDenied("Chat room ID is required")

        try:
            chat_room = ChatRoom.objects.get(id=chat_room_id, participants=self.request.user)
        except ChatRoom.DoesNotExist:
            raise PermissionDenied("Chat room not found or you don't have permission to access it")

        serializer.save(sender=self.request.user, chat_room=chat_room)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def mark_read(self, request):
        chat_room_id = request.data.get('chat_room')
        if not chat_room_id:
            return Response({'error': 'chat_room is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the user is a participant in the chat room
        try:
            chat_room = ChatRoom.objects.get(id=chat_room_id, participants=request.user)
        except ChatRoom.DoesNotExist:
            raise PermissionDenied("Chat room not found or you don't have permission to access it")

        # Mark messages as read
        Message.objects.filter(
            chat_room=chat_room,
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)

        return Response({'status': 'messages marked as read'})
