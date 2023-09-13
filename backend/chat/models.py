# Assuming you're using Django's built-in User model
from django.db import models
from django.contrib.auth import get_user_model
from users.models import MyUser

User = get_user_model()


class ChatRoom(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name='chatroom')

    def __str__(self):
        return self.name


class Messages(models.Model):
    sender = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name='messages', null=True, blank=True)

    def __str__(self):
        return f"From {self.sender.name} to {self.receiver.name}: {self.message}"
