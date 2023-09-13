import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

from .models import ChatRoom, Messages


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
        sender = text_data_json["sender"]
        receiver = text_data_json["receiver"]

        sender, receiver = await self.get_users(sender, receiver)

        if sender and receiver:
            await self.save_message(sender, receiver, message)
            sender_profile_pic = await self.get_sender_profile_pic(sender)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat.message",
                    "message": message,
                    "sender": sender.id,
                    "sender_name": sender.name,
                    "receiver": receiver.id,
                    "receiver_name": receiver.name,
                    "profile_pic": sender_profile_pic
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        sender = event.get("sender", "")
        receiver = event.get("receiver", "")
        sender_name = event.get("sender_name", "")
        receiver_name = event.get("receiver_name", "")
        profile_pic = event.get("sender_profile_pic", "")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"sender": sender, "sender_name": sender_name, "message": message, "receiver": receiver, "receiver_name": receiver_name, "profile_pic": profile_pic}))

    @database_sync_to_async
    def get_users(self, sender, receiver):
        try:
            print(sender)
            print(receiver)
            sender = User.objects.get(id=sender)
            receiver = User.objects.get(id=receiver)
            return sender, receiver
        except User.DoesNotExist:
            print("user does not exist")
            return None, None

    @database_sync_to_async
    def create_or_get_room(self, sender, receiver):
        try:
            user_ids = sorted([sender.id, receiver.id])
            room_name = f"chat_{user_ids[0]}-{user_ids[1]}"
            room, created = ChatRoom.objects.get_or_create(name=room_name)
            room.members.add(sender, receiver)
            return room_name  # Return the room_name as a valid string
        except Exception as e:
            print(f"Error creating or getting room: {e}")
            return None

    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        try:
            room, created = ChatRoom.objects.get_or_create(name=self.room_name)
            msg = Messages(room=room, sender=sender,
                           receiver=receiver, message=message)
            msg.save()
        except Exception as e:
            print(f"Error saving message: {e}")

    @database_sync_to_async
    def get_sender_profile_pic(self, sender):
        try:
            # Check if the sender has associated images
            if sender.images.exists():
                # Assuming you want to get the first image associated with the sender
                sender_image = sender.images.first()
                return sender_image.image.url
        except Exception as e:
            print(f"Error fetching profile pic for sender {sender.email}: {e}")
        return ''
