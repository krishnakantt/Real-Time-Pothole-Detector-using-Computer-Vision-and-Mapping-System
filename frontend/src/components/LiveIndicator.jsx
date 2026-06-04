import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

const LiveIndicator = ({ isDetecting }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      right: '30px',
      zIndex: 1000,
      backgroundColor: isDetecting ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
      backdropFilter: 'blur(8px)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
      fontSize: '0.85rem',
      fontWeight: 600,
      transition: 'background-color 0.3s ease'
    }} className="float-anim">
      <Camera size={16} className={isDetecting ? "blink-dot" : ""} />
      {isDetecting ? 'Live Detection ON' : 'Camera OFF'}
    </div>
  );
};

export default LiveIndicator;
