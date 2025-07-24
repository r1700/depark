let socket: WebSocket;

function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3000');

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    setTimeout(() => connectWebSocket(), 5000);
  };

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
    setTimeout(() => connectWebSocket(), 5000);
  };
}

connectWebSocket();

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // const swUrl = '/packages/frontend/dist/custom-service-worker.js';
      const swUrl = '/custom-service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}