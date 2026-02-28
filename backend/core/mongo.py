import os
from pymongo import MongoClient
from django.conf import settings

# Initialize PyMongo client
client = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017/'))
db = client[os.environ.get('MONGO_DB_NAME', 'events_db')]

def get_db():
    return db
