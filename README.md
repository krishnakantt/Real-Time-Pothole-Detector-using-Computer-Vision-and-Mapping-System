# Real-Time Pothole Detection and Mapping System Using Computer Vision

## Overview

The Real-Time Pothole Detection and Mapping System is an intelligent road monitoring solution that combines Computer Vision, Deep Learning, GPS Tracking, and Web Technologies to automatically detect potholes from live camera feeds and map their locations in real time.

The system uses a custom-trained YOLOv8 object detection model to identify potholes from captured video frames. When a pothole is detected, the system records its GPS coordinates, stores the detection information in a PostgreSQL database, and displays the location as a marker on an interactive map dashboard.

This project aims to assist municipal authorities and road maintenance departments in identifying and prioritizing road repairs efficiently.

---

## Features

* Real-time pothole detection using YOLOv8
* Live camera frame capture
* Automatic GPS coordinate collection
* Interactive map visualization
* Duplicate pothole filtering using geographical distance calculation
* Image evidence storage
* RESTful API architecture
* PostgreSQL database integration
* Real-time frontend dashboard using React
* WebSocket support using Django Channels

---

## System Architecture

```text
Mobile Camera
      │
      ▼
React Frontend
      │
      ▼
Frame Capture + GPS Coordinates
      │
      ▼
Django REST API
      │
      ▼
YOLOv8 Inference Engine
      │
      ▼
Pothole Detection
      │
      ▼
Duplicate Filtering
      │
      ▼
PostgreSQL Database
      │
      ▼
Interactive Map Dashboard
```

---

## Technology Stack

### Frontend

* React.js
* Axios
* Leaflet Maps
* WebSockets

### Backend

* Python 3.10
* Django
* Django REST Framework
* Django Channels
* Daphne

### Machine Learning

* YOLOv8
* Ultralytics
* OpenCV
* NumPy
* Pillow

### Database

* PostgreSQL

---

## Hardware Requirements

| Component        | Specification            |
| ---------------- | ------------------------ |
| Processor        | Intel Core i5-9300H      |
| RAM              | 8 GB DDR4                |
| GPU              | NVIDIA GTX 1650 Ti Max-Q |
| Camera           | Mobile Camera            |
| Operating System | Windows 10               |

---

## Software Requirements

| Software    | Version   |
| ----------- | --------- |
| Python      | 3.10.11   |
| Django      | 4.2.30    |
| Node.js     | v25.9.0   |
| React       | 19.2.5    |
| OpenCV      | 4.13.0.92 |
| Ultralytics | 8.4.35    |
| PostgreSQL  | 18.3      |

---

## Dataset Information

* Source: Kaggle Pothole Dataset
* Total Images: 1581
* Annotation Type: Bounding Boxes
* Average Resolution: 720 × 528
* Annotation Format: Pre-Annotated Dataset

---

## Model Training Configuration

| Parameter         | Value                            |
| ----------------- | -------------------------------- |
| Model             | YOLOv8                           |
| Epochs            | 50                               |
| Batch Size        | 2                                |
| Image Size        | 416 × 416                        |
| Optimizer         | AdamW                            |
| Training Platform | Local Machine (Jupyter Notebook) |

---

## Project Structure

```text
PotholeDetector/
│
├── backend/
│   ├── migrations/
│   ├── consumers.py
│   ├── models.py
│   ├── routing.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   └── apps.py
│
├── PotholeDetector/
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── media/
├── frontend/
├── pothole_model.pt
├── requirements.txt
└── manage.py
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/krishnakantt/Real-Time-Pothole-Detector-using-Computer-Vision-and-Mapping-System
cd pothole-detector
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE pothole_db;
```

Update database credentials in:

```python
settings.py
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Running Backend

Using Daphne:

```bash
daphne PotholeDetector.asgi:application
```

Or for development:

```bash
python manage.py runserver
```

---

## Running Frontend

Navigate to frontend directory:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start React application:

```bash
npm run dev
```

---

## API Endpoints

### Detect Pothole

```http
POST /api/detect/
```

Parameters:

* image
* latitude
* longitude

Response:

```json
{
  "pothole_detected": true,
  "confidence": 0.90,
  "saved": true
}
```

---

### Fetch All Potholes

```http
GET /api/potholes/
```

Returns all stored pothole records.

---

## Duplicate Detection Logic

To prevent repeated reporting of the same pothole, the system calculates the geographical distance between newly detected potholes and existing records using the Haversine Formula.

If the distance is less than a predefined threshold radius, the detection is marked as a duplicate and is not stored again.

---

## Future Enhancements

* Severity classification (Low, Medium, High)
* Mobile application integration
* Automatic road maintenance notifications
* Cloud deployment
* Real-time municipal dashboard
* Multi-camera support
* Road quality analytics

---

## Author

**Krishna Kant Das and Deepak Ranjan Sahoo**

## Acknowledgements

* Kaggle Pothole Dataset
* Ultralytics YOLOv8
* Django Documentation
* React Documentation
* OpenCV Documentation
* PostgreSQL Documentation
* freeCodeCamp
* PyResearch

---

## License

This project is developed for academic and educational purposes.
