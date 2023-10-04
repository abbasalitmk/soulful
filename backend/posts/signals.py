from .models import Like
from django.dispatch import receiver
from django.db.models.signals import post_save


@receiver(post_save, sender=Like)
def send_like_notification(sender, instance, created, **kwargs):
    if created:
        print("signal called")
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        message = {
            "type": "notification_message",
            "message": "Someone liked something.",
        }
        async_to_sync(channel_layer.group_send)("notifications_group", message)
