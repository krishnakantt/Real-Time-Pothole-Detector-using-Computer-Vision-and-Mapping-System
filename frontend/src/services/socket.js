class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.url = 'ws://localhost:8000/ws/potholes/';
  }

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (error) {
        console.error('WebSocket parsing error:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket.close(); // Will trigger onclose and reconnect
    };
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.pow(2, this.reconnectAttempts) * 1000;
      console.log(`Reconnecting in ${timeout}ms...`);
      setTimeout(() => this.connect(), timeout);
    } else {
      console.error('Max WebSocket reconnect attempts reached');
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach((callback) => callback(data));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

const socketService = new WebSocketService();
export default socketService;
