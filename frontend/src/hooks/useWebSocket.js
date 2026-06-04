import { useEffect, useState } from 'react';
import socketService from '../services/socket';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketService.connect();

    // Setup an interval to just check connection state for UI purposes
    const interval = setInterval(() => {
      setIsConnected(socketService.socket?.readyState === WebSocket.OPEN);
    }, 1000);

    return () => {
      clearInterval(interval);
      socketService.disconnect();
    };
  }, []);

  return { isConnected };
};
