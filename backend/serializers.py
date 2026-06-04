from rest_framework import serializers
from .models import Pothole

class PotholeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    """Serializer for the pothole model.
    Used for listing all potholes and returning detection results."""
    
    class Meta:
        model = Pothole
        fields = [
            'id',
            'latitude',
            'longitude',
            'confidence',
            'image',
            'timestamp',
            'status',
        ]
        read_only_fields = ['id', 'timestamp']
    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request._request.build_absolute_uri(obj.image.url)
        return obj.image.url
    
class PotholeMapSerializer(serializers.ModelSerializer):
    """Serializer for the pothole model.
    Used for listing all potholes on the map."""
    class Meta:
        model = Pothole
        fields = [
            'id',
            'latitude',
            'longitude',
            'confidence',
            'status',
            'timestamp',
        ]