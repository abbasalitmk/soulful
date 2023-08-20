from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Image, Story


User = get_user_model()


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = ('image',)


class StorySerializer(serializers.ModelSerializer):
    image = ImageSerializer(read_only=True)

    class Meta:
        model = Story
        fields = ('title', 'image')
