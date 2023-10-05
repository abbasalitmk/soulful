from .models import FollowRequest
from django.dispatch import receiver
from django.db.models.signals import post_save


@receiver(post_save, sender=FollowRequest)
def send_friend_request(sender, instance, created, **kwargs):
    if created:
        sender = instance.sender.name.capitalize()
        receiver_id = instance.reciever.id
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        message = {
            "type": "notification_message",
            "receiver_id": receiver_id,
            "message": f"{sender} send a friend request.",
        }
        async_to_sync(channel_layer.group_send)("notifications_group", message)
