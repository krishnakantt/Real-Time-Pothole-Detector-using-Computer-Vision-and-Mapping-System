import { useState, useEffect, useCallback } from 'react';
import { getPotholes } from '../services/api';
import socketService from '../services/socket';
import { reverseGeocode } from '../services/geocode';

export const usePotholes = () => {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPotholes();
      
      // Attempt to geocode items without location name if required
      const enhancedData = await Promise.all(data.map(async (p) => {
        if (!p.locationName) {
           p.locationName = await reverseGeocode(p.latitude, p.longitude);
        }
        return p;
      }));

      setPotholes(enhancedData);
    } catch (error) {
      console.error("Failed to load initial potholes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();

    // Subscribe to real-time updates without polling
    const unsubscribe = socketService.subscribe(async (newPothole) => {
      // Enhance new pothole with reverse geocoding if needed
      if (!newPothole.locationName) {
        newPothole.locationName = await reverseGeocode(newPothole.latitude, newPothole.longitude);
      }
      setPotholes((prev) => {
        // Prevent duplicates based on ID or proximity if ID is missing. Assuming ID exists.
        if (prev.some(p => p.id === newPothole.id)) {
          return prev.map(p => p.id === newPothole.id ? newPothole : p);
        }
        return [...prev, newPothole];
      });
    });

    return () => {
      unsubscribe();
    };
  }, [fetchInitialData]);

  return { potholes, loading };
};
