
from rest_framework import serializers
from .models import Notification, FollowRequest
from users.serializer import UserSerializer
from users.models import Images


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class FollowRequestSerializer (serializers.ModelSerializer):
    name = serializers.CharField(source='sender.name', read_only=True)
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        # Fetch the latest profile picture for the sender
        image = Images.objects.filter(user=obj.sender).order_by('-pk').first()
        if image:
            return image.image.url
        return None

    class Meta:
        model = FollowRequest
        fields = ['sender', 'reciever', 'accepted', 'message', 'image', 'name']
