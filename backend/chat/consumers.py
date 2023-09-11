import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

from .models import ChatRoom


User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    room_group_name = None

    async def connect(self):
        sender_id = self.scope["url_route"]["kwargs"]["sender_id"]
        recipient_id = self.scope["url_route"]["kwargs"]["recipient_id"]

        sender, recipient = await self.get_users(sender_id, recipient_id)

        if not sender or not recipient:
            await self.close()
            return

        self.room_name = await self.create_or_get_room(sender, recipient)
        self.room_group_name = f"chat_{self.room_name}"

        print(f"Connected to room group: {self.room_group_name}")
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if self.room_group_name:  # Check if room_group_name is assigned
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender_id = text_data_json["sender_id"]
        recipient_id = text_data_json["recipient_id"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message",
                                   "message": message,
                                   "sender_id": sender_id,
                                   "recipient_id": recipient_id
                                   }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        sender_id = event.get("sender_id", "")
        recipient_id = event.get("recipient_id", "")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"sender_id": sender_id, "message": message, "recipient_id": recipient_id}))

    @database_sync_to_async
    def get_users(self, sender_id, recipient_id):
        try:
            print(sender_id)
            print(recipient_id)
            sender = User.objects.get(id=sender_id)
            recipient = User.objects.get(id=recipient_id)
            return sender, recipient
        except User.DoesNotExist:
            print("user does not exist")
            return None, None

    @database_sync_to_async
    def create_or_get_room(self, sender, recipient):
        try:
            user_ids = sorted([sender.id, recipient.id])
            room_name = f"chat_{user_ids[0]}-{user_ids[1]}"
            room, created = ChatRoom.objects.get_or_create(name=room_name)
            room.members.add(sender, recipient)
            return room_name  # Return the room_name as a valid string
        except Exception as e:
            print(f"Error creating or getting room: {e}")
            return None
