from django.shortcuts import render
from rest_framework import viewsets
from .models import Messages, ChatRoom
from .serializers import MessageSerializer, RetrieveFollowedUserSerializer
from rest_framework.views import APIView
from users.models import MyUser, Followers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q


class MessageView(APIView):
    def get(self, request):
        try:
            followers = Followers.objects.filter(
                Q(user=request.user) | Q(followed_user=request.user)
            )

            serializer = RetrieveFollowedUserSerializer(followers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)})


class RetrieveMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, sender, receiver):
        user_ids = sorted([sender, receiver])
        char_room_name = f"chat_{user_ids[0]}-{user_ids[1]}"

        try:
            room = ChatRoom.objects.get(name=char_room_name)
            messages = Messages.objects.filter(room=room)
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)})
