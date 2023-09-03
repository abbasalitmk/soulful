from rest_framework import serializers
from .models import Post, Image, Comment, Like
from django.contrib.auth import get_user_model


User = get_user_model()


class CommentSerializer (serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('text')


class PostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validate_data):

        image_data = validate_data.pop('image')
        image_obj = Image.objects.create(image=image_data)
        print(image_data)
        print(image_obj)

        post = Post.objects.create(image=image_obj, **validate_data)

        return post


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class PostRetrieveSerilizer(serializers.ModelSerializer):
    image = ImageSerializer()
    like_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
