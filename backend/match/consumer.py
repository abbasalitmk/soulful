# notifications/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Notification
from .serializers import NotificationSerializer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def send_notification(self, event):
        notification = event['notification']
        await self.send(json.dumps(notification))

    @staticmethod
    def get_notification_data(notification):
        serializer = NotificationSerializer(notification)
        return serializer.data

    @async_to_sync
    async def new_notification(self, data):
        await self.send_notification({'notification': data})

    @async_to_sync
    async def user_notifications(self, event):
        user = self.scope['user']
        notifications = Notification.objects.filter(
            receiver=user, is_read=False)
        for notification in notifications:
            data = self.get_notification_data(notification)
            await self.new_notification(data)
            notification.is_read = True
            notification.save()
