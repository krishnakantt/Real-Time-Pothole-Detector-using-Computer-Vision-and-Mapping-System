import cv2
import requests
from ultralytics import YOLO

# Load trained model
model = YOLO("pothole_model.pt")

# Backend API
API_URL = "http://127.0.0.1:8000/api/detect/"

# Fake GPS for now (replace later with real GPS)
latitude = 20.2961
longitude = 85.8245

# Start camera
cap = cv2.VideoCapture(0)

while True:

    ret, frame = cap.read()

    if not ret:
        break

    results = model(frame)

    pothole_detected = False
    confidence = 0

    for r in results:
        for box in r.boxes:
            pothole_detected = True
            confidence = float(box.conf)

    # show detection window
    annotated_frame = results[0].plot()
    cv2.imshow("Pothole Detection", annotated_frame)

    if pothole_detected:

        print("Pothole detected. Sending to server...")

        # save frame temporarily
        image_path = "detected.jpg"
        cv2.imwrite(image_path, frame,[cv2.IMWRITE_JPEG_QUALITY, 95])

        files = {
            "image": open(image_path, "rb")
        }

        data = {
            "latitude": latitude,
            "longitude": longitude
        }

        try:
            response = requests.post(API_URL, files=files, data=data)
            print(response.json())
        except Exception as e:
            print("API error:", e)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()