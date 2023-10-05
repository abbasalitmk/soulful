import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Connect to the WebSocket
        await self.accept()
        await self.channel_layer.group_add("notifications_group", self.channel_name)

    async def disconnect(self, close_code):
        # Disconnect from the WebSocket
        await self.channel_layer.group_discard("notifications_group", self.channel_name)

    async def receive(self, text_data):
        # Receive a notification message from the WebSocket
        message_data = json.loads(text_data)
        notification_type = message_data.get("type", None)

        if notification_type == "notification":
            notification_message = message_data.get("message", "")

            await self.channel_layer.group_send(
                "notifications_group",
                {
                    "type": "notification_message",
                    "message": notification_message,
                    "receiver_id": receiver_id,
                },
            )

    async def notification_message(self, event):
        notification_message = event["message"]
        receiver_id = event["receiver_id"]
        await self.send(
            text_data=json.dumps(
                {
                    "type": "notification",
                    "receiver_id": receiver_id,
                    "message": notification_message,
                    "channel": self.channel_name,
                }
            )
        )
