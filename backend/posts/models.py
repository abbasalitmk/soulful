from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


User = get_user_model()


class Image (models.Model):
    image = models.ImageField(upload_to='post-image')


class Comment (models.Model):
    text = models.CharField(max_length=255)
    created_at = models.TimeField(auto_now_add=True)


class Post(models.Model):

    title = models.CharField(max_length=255)
    created = models.DateTimeField(
        auto_now_add=True, null=True, blank=True)
    updated = models.DateTimeField(
        auto_now_add=True, null=True, blank=True)

    likes = models.IntegerField(blank=True, null=True, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    share_count = models.IntegerField(blank=True, null=True)
    image = models.ForeignKey(
        Image, on_delete=models.DO_NOTHING)
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title
