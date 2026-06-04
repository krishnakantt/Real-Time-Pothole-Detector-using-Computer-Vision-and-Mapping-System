import React from 'react';
import { MapPin } from 'lucide-react';
import '../styles/animations.css';

const SplashScreen = ({ onComplete }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 9999
    }} className="fade-in">
      <div style={{
        animation: 'float 3s ease-in-out infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
        }}>
          <MapPin size={40} color="white" />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '-0.5px'
        }}>SmartCity Guardian</h1>
        <p style={{
          color: '#94a3b8',
          marginTop: '8px',
          fontSize: '1.1rem'
        }}>Real-time Pothole Detection & Mapping System</p>
        
        <div style={{
          marginTop: '40px',
          display: 'flex',
          gap: '8px'
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              animation: `pulse 1.5s infinite ${i * 0.2}s`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
