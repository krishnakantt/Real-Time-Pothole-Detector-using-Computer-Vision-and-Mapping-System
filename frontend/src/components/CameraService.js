import { sendCameraFrame } from '../services/api';

class CameraService {
  constructor() {
    this.videoElement = document.createElement('video');
    this.videoElement.style.position = 'absolute';
    this.videoElement.style.top = '-9999px';
    this.videoElement.style.left = '-9999px';
    this.videoElement.style.opacity = '0';
    this.videoElement.style.pointerEvents = 'none';
    this.videoElement.autoplay = true;
    this.videoElement.muted = true;
    this.videoElement.setAttribute('playsinline', '');
    this.canvasElement = document.createElement('canvas');
    this.stream = null;
    this.intervalId = null;
    this.isDetecting = false;
    document.body.appendChild(this.videoElement);
  }

  async start() {
    if (this.isDetecting) return true;

    try {
      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
      
      //Wait for video to be ready
      while (this.videoElement.videoWidth === 0)
      {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Give the browser a moment to actually render the first frame and remove any placeholders
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(
        this.videoElement.videoWidth,
        this.videoElement.videoHeight
      );

      this.isDetecting = true;
      this.startCapturing();
      return true;
    } catch (error) {
      console.error("Camera access denied or error:", error);
      return false;
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isDetecting = false;
  }

  startCapturing() {
    // Capture a frame every 3 seconds
    this.intervalId = setInterval(() => this.captureAndSendFrame(), 1500);
  }

  captureAndSendFrame() {
  if (!this.videoElement || !this.isDetecting) return;
  if (this.videoElement.videoWidth === 0 || this.videoElement.videoHeight === 0) {
    console.log("Camera not ready for capturing.");
    return;
  }
  console.log(
  this.videoElement.videoWidth,
  this.videoElement.videoHeight
);

  try {
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    const ctx = this.canvasElement.getContext("2d");
    ctx.drawImage(this.videoElement, 0, 0);

    this.canvasElement.toBlob(async (blob) => {
      if (!blob) return;
      const img = URL.createObjectURL(blob);
      console.log("Captured frame blob:", img);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Captured frame with location:", latitude, longitude);

          try {
            await sendCameraFrame(blob, latitude, longitude);
          } catch (err) {
            console.error("Frame send error:", err);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }, "image/jpeg", 0.8);

  } catch (error) {
    console.error("Error capturing frame:", error);
  }
}
}

const cameraService = new CameraService();
export default cameraService;
