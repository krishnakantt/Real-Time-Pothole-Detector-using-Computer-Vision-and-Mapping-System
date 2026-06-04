import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import '../styles/global.css';

// Custom Map Pothole Icon
const createCustomIcon = (status) => {
  const color = status === 'fixed' ? '#22c55e' : (status === 'verified' ? '#f59e0b' : '#ef4444');
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="pulse-marker" style="--danger: ${color}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Custom Cluster Icon
const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(40, 40, true),
  });
};

const MarkerClusterLayer = ({ potholes }) => {
  if (!potholes || potholes.length === 0) return null;

  return (
    <MarkerClusterGroup
      chunkedLoading
      disableClusteringAtZoom={18}
      iconCreateFunction={createClusterCustomIcon}
      maxClusterRadius={50}
      spiderfyOnMaxZoom={true}
    >
      {potholes.map((pothole, index) => {
        const imageUrl = pothole.image ? `http://127.0.0.1:8000${pothole.image}` : null;
        if (isNaN(parseFloat(pothole.latitude)) || isNaN(parseFloat(pothole.longitude))) return null;
        
        return (
          <Marker 
            key={pothole.id || index} 
            position={[parseFloat(pothole.latitude), parseFloat(pothole.longitude)]}
            icon={createCustomIcon(pothole.status)}
          >
            <Popup className="custom-popup" minWidth={280}>
              <div style={{ padding: '0px' }}>
                {imageUrl && (
                  <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                    <img src={pothole.image} alt="Pothole" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                     <span style={{ 
                       padding: '4px 10px', 
                       borderRadius: '12px', 
                       backgroundColor: pothole.status === 'fixed' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                       color: pothole.status === 'fixed' ? 'var(--success)' : 'var(--danger)',
                       fontSize: '0.75rem',
                       fontWeight: 600,
                       textTransform: 'uppercase'
                     }}>
                       {pothole.status || 'Pending'}
                     </span>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <Clock size={12} />
                       {pothole.timestamp ? new Date(pothole.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Time'}
                     </div>
                  </div>
                  
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.3 }}>
                    {pothole.locationName || 'Unknown Road'}
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <AlertCircle size={14} color="var(--primary)" />
                    Confidence: <strong style={{ color: 'var(--text-main)' }}>{Math.round((pothole.confidence || 0) * 100)}%</strong>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
};

export default MarkerClusterLayer;
