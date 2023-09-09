# serializers.py

from rest_framework import serializers
from .models import Messages
from users.models import Followers


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ('sender', 'receiver', 'content', 'timestamp')


class RetrieveFollowedUserSerializer (serializers.ModelSerializer):
    name = serializers.CharField(
        source='followed_user.name', read_only=True)
    image = serializers.ImageField(
        source='followed_user.images.first.image', read_only=True)

    class Meta:
        model = Followers
        fields = '__all__'
