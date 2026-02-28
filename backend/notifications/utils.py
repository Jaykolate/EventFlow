from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_realtime_notification(user_id, notification_data):
    """
    Utility to send WebSocket notifications via Django Channels 
    from anywhere in the application (like PyMongo models or views).
    """
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"user_notifications_{user_id}",
            {
                "type": "notification_message",
                "notification": notification_data
            }
        )
