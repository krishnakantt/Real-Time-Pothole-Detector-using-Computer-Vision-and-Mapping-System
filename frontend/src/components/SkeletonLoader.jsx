import React from 'react';
import '../styles/animations.css';

const SkeletonLoader = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      backgroundColor: '#f8fafc',
      position: 'relative'
    }}>
      {/* Sidebar Skeleton */}
      <div style={{
        width: '320px',
        height: '100%',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 10
      }}>
        <div className="skeleton-pulse" style={{ height: '40px', borderRadius: '8px' }}></div>
        <div className="skeleton-pulse" style={{ height: '120px', borderRadius: '12px' }}></div>
        <div className="skeleton-pulse" style={{ height: '24px', width: '60%', borderRadius: '4px', marginTop: '20px' }}></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton-pulse" style={{ height: '70px', borderRadius: '8px' }}></div>
        ))}
      </div>

      {/* Main Map Skeleton */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: '100%' }}></div>
        
        {/* Search bar skeleton */}
        <div className="skeleton-pulse" style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '400px', 
          height: '48px', 
          borderRadius: '24px',
          zIndex: 20
        }}></div>

        {/* Stats Panel Skeleton */}
        <div className="skeleton-pulse" style={{ 
          position: 'absolute', 
          bottom: '24px', 
          right: '24px', 
          width: '280px', 
          height: '160px', 
          borderRadius: '16px',
          zIndex: 20
        }}></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
