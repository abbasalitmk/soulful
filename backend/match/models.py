
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='received_notifications')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)


class FollowRequest(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="requeset_sender")
    reciever = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="request_reciever")
    message = models.CharField(max_length=100, null=True, blank=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} requested to {self.reciever}"
