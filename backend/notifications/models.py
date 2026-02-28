from core.mongo import db
from bson.objectid import ObjectId

class NotificationModel:
    collection = db['notifications']

    @classmethod
    def get_user_notifications(cls, user_id):
        return list(cls.collection.find({'user': str(user_id)}).sort('created_at', -1))

    @classmethod
    def get_by_id(cls, notif_id):
        try:
            return cls.collection.find_one({'_id': ObjectId(notif_id)})
        except:
            return None

    @classmethod
    def create(cls, data):
        result = cls.collection.insert_one(data)
        data['_id'] = result.inserted_id
        
        # trigger socket
        try:
            from notifications.utils import send_realtime_notification
            send_realtime_notification(data['user'], {
                'id': str(data['_id']),
                'message': data.get('message'),
                'type': data.get('type'),
                'is_read': data.get('is_read', False),
                'created_at': data.get('created_at')
            })
        except Exception as e:
            print("WebSocket notification omitted/failed:", str(e))
            
        return data

    @classmethod
    def mark_read(cls, notif_id):
        try:
            cls.collection.update_one({'_id': ObjectId(notif_id)}, {'$set': {'is_read': True}})
            return True
        except:
            return False

    @classmethod
    def mark_all_read(cls, user_id):
        cls.collection.update_many({'user': str(user_id), 'is_read': False}, {'$set': {'is_read': True}})
