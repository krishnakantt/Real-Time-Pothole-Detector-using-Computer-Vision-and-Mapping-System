from channels.generic.websocket import AsyncWebsocketConsumer
import json

class PotholeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Handle incoming data (e.g., save to database, broadcast to other clients, etc.)
        await self.send(text_data=json.dumps({
            'message': 'Pothole data received',
            'data': data
        }))