from django.db import models

# Create your models here.
class Pothole(models.Model):
    """
    Represents a detected pothole stored in the database.
    Each record captures location, confidence, image evidence, and repair status."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('repaired','Repaired'),
    ]
    #Auto-generated primary key (id)
    latitude = models.FloatField(help_text="GPS latitude of the detected pothole")
    longitude = models.FloatField(help_text="GPS longitude of the detected pothole")
    confidence = models.FloatField(help_text="Model Confidence score(0.0 to 1.0)")
    image = models.ImageField(upload_to='pothole_images/', help_text="Uploaded image with pothole")
    timestamp = models.DateTimeField(auto_now_add=True, help_text="Detection timestamp")
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pending', 
        help_text="Repair status of the pothole")
    class Meta:
        ordering = ['-timestamp']  # Newest detections first
        verbose_name = "Pothole"
        verbose_name_plural = "Potholes"
    def __str__(self):
        return f"Pothole # {self.id} at ({self.latitude}, {self.longitude}) - {self.status}"