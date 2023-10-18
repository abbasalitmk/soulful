from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from utils import send_verification_mail
from .models import Followers, PasswordReset
import random
from django.core.mail import send_mail

User = get_user_model()


# @receiver(post_save, sender=User)
# def send_verification_email(sender, instance, created, **kwargs):
#     if created:


@receiver(post_save, sender=Followers)
def send_follow_notification(sender, instance, created, **kwargs):
    if created:
        print("follow  signal is working")
        sender = instance.user.name.capitalize()
        receiver_id = instance.followed_user.id
        follower_name = instance.followed_user.name.capitalize()
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        message = {
            "type": "notification_message",
            "receiver_id": receiver_id,
            "message": f"{sender} accept your friend request",
        }
        async_to_sync(channel_layer.group_send)("notifications_group", message)
