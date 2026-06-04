import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Match it with actual backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

export const getPotholes = async () => {
  try {
    const response = await api.get('/potholes/');
    return response.data.potholes;
  } catch (error) {
    console.error('API Error fetching potholes:', error);
    throw error;
  }
};

export const sendCameraFrame = async (blob, latitude, longitude) => {
  const formData = new FormData();
  formData.append('image', blob, 'frame.jpg');
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  console.log('Sending frame with location:', latitude, longitude);

  try {
    await api.post('/detect/', formData); 
    // {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
  } catch (error) {
    console.error('API Error sending camera frame:', error);
  }
};

export default api;
