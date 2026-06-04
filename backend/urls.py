from django.urls import path
from .views import(
    PotholeDetailView,
    PotholeListView,
    PotholeMapView,
    PotholeDetectionView,
)

urlpatterns = [
    path('detect/', PotholeDetectionView.as_view(), name='detect_pothole'),
    path('potholes/', PotholeListView.as_view(), name='pothole_list'),
    path('map/', PotholeMapView.as_view(), name='pothole_map'),
    path('potholes/<int:pk>/', PotholeDetailView.as_view(), name='pothole_detail'),
]