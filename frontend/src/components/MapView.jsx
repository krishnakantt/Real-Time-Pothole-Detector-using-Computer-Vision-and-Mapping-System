import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterLayer from './MarkerClusterLayer';
import SearchBar from './SearchBar';

const MapController = ({ center }) => {
  const map = useMap();
  const prevCenter = useRef(center);

  useEffect(() => {
    if (center && map && prevCenter.current !== center) {
      prevCenter.current = center;
      
      const z = map.getZoom();
      const zoom = (typeof z === 'number' && !isNaN(z)) ? z : 13;
      
      const isValidCenter = Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1]);
      
      if (isValidCenter) {
        setTimeout(() => {
          try {
             map.flyTo(center, zoom, { animate: true, duration: 1.5 });
          } catch(e) {
             map.setView(center, zoom);
          }
        }, 50);
      }
    }
  }, [center, map]);
  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const MapView = ({ potholes, userLocation }) => {
  const [center, setCenter] = useState([20.2961, 85.8245]);
  
  useEffect(() => {
    if (userLocation && userLocation.length === 2 && !isNaN(userLocation[0]) && !isNaN(userLocation[1])) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  const handleLocationSelect = (result) => {
    if (result && result.lat && result.lon) {
      setCenter([parseFloat(result.lat), parseFloat(result.lon)]);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <SearchBar onLocationSelect={handleLocationSelect} />
      
      <MapContainer 
        center={center} 
        zoom={13} 
        preferCanvas={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false} // Custom placing
      >
        <ZoomControl position="bottomleft" />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <MapResizer />
        <MapController center={center} />

        {/* Wait to ensure map is mounted properly before heavy overlays? */}
        <MarkerClusterLayer potholes={potholes.filter(
          p => p.latitude && p.longitude 
        )}
        />
        
      </MapContainer>

      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
        zIndex: 10
      }}></div>
    </div>
  );
};

export default MapView;
