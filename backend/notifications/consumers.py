import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Allow any connection, we will identify by group
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        user_id = query_params.get('user_id', [None])[0]
        
        if user_id:
            self.room_group_name = f'user_notifications_{user_id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def notification_message(self, event):
        # We now pass the entire notification dict from utils
        notification = event.get('notification', {})
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps(notification))
