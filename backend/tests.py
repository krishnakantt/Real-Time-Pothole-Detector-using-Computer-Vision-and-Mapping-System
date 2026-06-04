# from django.test import TestCase

# Create your tests here.
import cv2
from ultralytics import YOLO

# Load trained YOLO model
model = YOLO("pothole_model.pt")   # path to your trained model

# Open webcam (0 = default camera)
cap = cv2.VideoCapture(1)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run YOLO detection
    results = model(frame)

    # Plot results on frame
    annotated_frame = results[0].plot()

    # Show frame
    cv2.imshow("YOLO Detection", annotated_frame)

    # Press q to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()