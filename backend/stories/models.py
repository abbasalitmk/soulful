from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Image(models.Model):
    image = models.ImageField(upload_to='status-image')


class Comment (models.Model):
    text = models.CharField(max_length=255)


class Story (models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)
    image = models.ForeignKey(
        Image, on_delete=models.CASCADE,  blank=True, null=True)
    likes = models.IntegerField(blank=True, null=True)
    share = models.IntegerField(blank=True, null=True)
    comment = models.ForeignKey(
        Comment, blank=True, null=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
