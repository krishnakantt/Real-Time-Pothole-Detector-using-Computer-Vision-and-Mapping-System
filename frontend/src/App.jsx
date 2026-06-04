import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import SkeletonLoader from './components/SkeletonLoader';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import LiveIndicator from './components/LiveIndicator';
import StatsPanel from './components/StatsPanel';
import cameraService from './components/CameraService';
import { usePotholes } from './hooks/usePotholes';
import { useWebSocket } from './hooks/useWebSocket';
import './styles/global.css';

const App = () => {
  const [appState, setAppState] = useState('splash'); // splash, loading, ready
  const { potholes, loading: potholesLoading } = usePotholes();
  const { isConnected } = useWebSocket();
  const [isDetecting, setIsDetecting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Splash screen timer
    const splashTimer = setTimeout(() => {
      setAppState('loading');
    }, 1800);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    // Transition from loading to ready once initial potholes are loaded (or minimum 1s skeleton)
    if (appState === 'loading' && !potholesLoading) {
      const minLoaderTimer = setTimeout(() => {
        setAppState('ready');
      }, 1000); // give skeleton at least 1s for fluid UX

      return () => clearTimeout(minLoaderTimer);
    }
  }, [appState, potholesLoading]);

  useEffect(() => {
    if (appState === 'ready') {
      // Ask camera permission ONLY when fully ready and shown to user
      const initCamera = async () => {
        try {
          const success = await cameraService.start();
          setIsDetecting(success);
        } catch (error) {
          console.warn("Error initializing camera:", error);
        }
      };
      
      initCamera();

      // Ask for high-accuracy geolocation
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
           (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
           (err) => console.warn("Geolocation blocked/failed:", err),
           { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
         );
      }
    }

    return () => {
      cameraService.stop();
    };
  }, [appState]);

  return (
    <>
      {appState === 'splash' && <SplashScreen />}
      
      {appState === 'loading' && <SkeletonLoader />}
      
      {appState === 'ready' && (
        <div style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }} className="fade-in">
          
          <Sidebar potholes={potholes} isConnected={isConnected} />
          
          <div style={{ flex: 1, position: 'relative' }}>
            <LiveIndicator isDetecting={isDetecting} />
            
            <MapView potholes={potholes} userLocation={userLocation} />
            
            <StatsPanel 
              potholes={potholes} 
              isConnected={isConnected} 
              userLocation={userLocation} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
