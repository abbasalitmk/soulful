# serializers.py

from rest_framework import serializers
from .models import Messages, ChatRoom
from users.models import Followers


class ChatRoomSerializer (serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    room = ChatRoomSerializer(read_only=True)
    sender_name = serializers.CharField(source='sender.name', read_only=True)

    class Meta:
        model = Messages
        fields = ('sender', 'sender_name', 'receiver',
                  'message', 'timestamp', 'room')


class RetrieveFollowedUserSerializer (serializers.ModelSerializer):
    name = serializers.CharField(
        source='followed_user.name', read_only=True)
    image = serializers.ImageField(
        source='followed_user.images.first.image', read_only=True)

    class Meta:
        model = Followers
        fields = '__all__'
