import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }
    return 'Unknown Location';
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return 'Location unavailable';
  }
};

export const searchLocation = async (query) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }
    return null;
  } catch (error) {
    console.error('Search Geocoding Error:', error);
    return null;
  }
};
