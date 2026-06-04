from multiprocessing import context
import os
import math
import uuid
import logging
import numpy as np
import cv2

from PIL import Image

from django.conf import settings
from django.core.files.base import ContentFile

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from ultralytics import YOLO

from .models import Pothole
from .serializers import PotholeSerializer, PotholeMapSerializer

logger = logging.getLogger(__name__)

# Create your views here.

#Loading the YOLOv8 model once at server startup to avoid reloading it for every request, which can be time-consuming and inefficient. The model is loaded from a specified path, and any errors during loading are logged appropriately.
model_path = os.path.join(settings.BASE_DIR, 'pothole_model.pt')

try:
    model = YOLO(model_path)
    logger.info(f"YOLOv8 model loaded successfully from: {model_path}")
except Exception as e:
    model = None
    logger.error(f"Error loading YOLOv8 model from: {model_path}: {e}")

#Utility function to convert YOLOv8 detection results into a format suitable for saving in the database. It extracts the bounding box coordinates, confidence score, and class label from the detection results and formats them into a dictionary that can be easily stored in the Pothole model.
def haversine_distance(lat1:float, lon1:float, lat2:float, lon2:float) -> float:
    """Calculate the great-circle distance (in metres) between two GPS coordinates
    using the Haversine formula."""
    R = 6_371_000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c
def is_duplicate_pothole(lat:float, lon:float, radius_m:float=5.0) -> bool:
    """Check if a pothole at the given GPS coordinates is a duplicate based on proximity."""
    existing_potholes = Pothole.objects.filter(
        latitude__range=(lat - 0.00005, lat + 0.00005),
        longitude__range=(lon - 0.00005, lon + 0.00005)
    )
    for pothole in existing_potholes:
        distance = haversine_distance(lat, lon, pothole.latitude, pothole.longitude)
        if distance <= radius_m:
            return True
    return False

#View 1 - Pothole Detection API
class PotholeDetectionView(APIView):
    """POST /api/detect/
    Accepts an image file + GPS coordinates.
    Runs YOLOv8 inference, saves detected potholes to DB(with duplicating filtering),
    and returns detection results as JSON.
    """
    parser_classes = (MultiPartParser, FormParser)
    def post(self,request,*args,**kwargs):
        #1. Validate input data
        image_file = request.FILES.get('image')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        if not image_file:
            return Response({'error': 'Image file is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if latitude is None or longitude is None:
            return Response({'error': 'Latitude and longitude are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return Response({'error': 'Invalid latitude or longitude format.'}, status=status.HTTP_400_BAD_REQUEST)
        #2. Check model availability
        if model is None:
            return Response({'error': 'YOLOv8 model is not available.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        #3. Decode image with opencv
        try:
            pil_image = Image.open(image_file).convert('RGB')
            #Convert PIL -> NumPy array (BGR for OpenCV compatibility)
            image_array = cv2.cvtColor(np.array(pil_image),cv2.COLOR_RGB2BGR)
            # cv2.imwrite("frontend_frame.jpg", image_array)
        except Exception as e:
            logger.error(f"Error processing image file: {e}")
            return Response({'error': 'Invalid image file.'}, status=status.HTTP_400_BAD_REQUEST)
        #4. Run YOLOv8 inference
        try:
            results = model(image_array,verbose=False)
        except Exception as e:
            logger.error(f"Error during YOLOv8 inference: {e}")
            return Response({'error': 'Error processing image with YOLOv8 model.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        #5. Process detection results
        pothole_detected = False
        best_confidence = 0.0
        best_bbox = None
        for result in results:
            boxes = result.boxes
            print("Detection: ", boxes)
            if boxes is None or len(boxes) == 0:
                continue
            for box in boxes:
                confidence = float(box.conf[0])
                #Only accept detections above confidence threshold
                if confidence > best_confidence:
                    best_confidence = confidence
                    #boudning box as [x_min, y_min, x_max, y_max]
                    xyxy = box.xyxy[0].tolist()
                    best_bbox = {
                        'x_min': round(xyxy[0],2),
                        'y_min': round(xyxy[1],2),
                        'x_max': round(xyxy[2],2),
                        'y_max': round(xyxy[3],2),
                    }
                    pothole_detected = True
        #6. Save to DB if pothole detected and not duplicate
        saved_pothole = None
        if pothole_detected:
            if is_duplicate_pothole(latitude, longitude):
                logger.info(f"Duplicate pothole detected at lat:{latitude}, lon:{longitude}. Skipping save.")
                return Response({
                    'pothole_detected': True,
                    'confidence': round(best_confidence,4),
                    'bounding_box': best_bbox,
                    'latitude': latitude,
                    'longitude': longitude,
                    'message': 'Pothole detected but not saved due to proximity to existing pothole.',
                    'saved': False,
                }, status=status.HTTP_200_OK)
            #Re-seek the file before saving so Django can read it fully
            image_file.seek(0)
            unique_name = f"{uuid.uuid4().hex}_{image_file.name}"
            pothole_instance = Pothole(
                latitude=latitude,
                longitude=longitude,
                confidence=round(best_confidence,4),
            )
            pothole_instance.image.save(unique_name, ContentFile(image_file.read()), save=True)
            saved_pothole = PotholeSerializer(pothole_instance,context={'request': request}).data
            logger.info(f"New pothole saved: ID={pothole_instance.id}, lat:{latitude}, lon:{longitude}, confidence:{best_confidence}")
        #7. Return response
        response_data = {
            'pothole_detected': pothole_detected,
            'confidence': round(best_confidence,4) if pothole_detected else 0.0,
            'bounding_box': best_bbox,
            'latitude': latitude,
            'longitude': longitude,
            'saved': saved_pothole is not None,
        }
        if saved_pothole:
            response_data['pothole'] = saved_pothole
        return Response(response_data, status=status.HTTP_200_OK)

#View 2 - Pothole List API /api/potholes/
class PotholeListView(APIView):
    """GET /api/potholes/
    Returns a list of all detected potholes with their details.
    """
    def get(self,request,*args,**kwargs):
        queryset = Pothole.objects.all()
        #Filter by status
        filter_status = request.query_params.get('status')
        if filter_status in ['pending','repaired']:
            queryset = queryset.filter(status=filter_status)
        serializer = PotholeSerializer(queryset,many=True,context={'request': request})
        return Response({
            'count': queryset.count(),
            'potholes': serializer.data,
        }, status=status.HTTP_200_OK)

#View 3 - Pothole Map API /api/map/
class PotholeMapView(APIView):
    """GET /api/map/
    Returns all pothole coordinates in a lightweight JSON format optimised for plotting Google Maps markers on the frontend.
    Example marker object returned:
    {
    "id": 1,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "confidence": 0.85,
    "status": "pending"
    "timestamp": "2024-06-01T12:34:56Z"}
    """
    def get(self,request,*args,**kwargs):
        queryset = Pothole.objects.all()
        serializer = PotholeMapSerializer(queryset,many=True)
        return Response({
            'count': queryset.count(),
            'potholes': serializer.data,
        }, status=status.HTTP_200_OK)
    
#View 4 - Pothole Status Update API /api/potholes/<int:pk>/
class PotholeDetailView(APIView):
    """
    GET /api/potholes/<id>/ -> Retrieve a single pothole record.
    PATCH /api/potholes/<id>/ -> Update the status of a pothole (e.g., mark as repaired).
    DELETE /api/potholes/<id>/ -> Delete a pothole record if needed.
    """
    def _get_object(self,pk):
        try:
            return Pothole.objects.get(pk=pk)
        except Pothole.DoesNotExist:
            return None
    
    def get(self,request,pk,*args,**kwargs):
        pothole = self._get_object(pk)
        if pothole is None:
            return Response({'error': 'Pothole not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PotholeSerializer(pothole,context={'request': request})
        return Response(serializer.data)

    def patch(self,request,pk,*args,**kwargs):
        pothole = self._get_object(pk)
        if pothole is None:
            return Response({'error': 'Pothole not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PotholeSerializer(pothole,data=request.data,partial = True,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk,*args,**kwargs):
        pothole = self._get_object(pk)
        if pothole is None:
            return Response({'error': 'Pothole not found.'}, status=status.HTTP_404_NOT_FOUND)
        pothole.delete()
        return Response({'message':f'Pothole #{pk} deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)