let socket: WebSocket;
let reconnectTimeout: number | undefined = undefined;

function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3000');

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);

    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    setTimeout(() => connectWebSocket(), 5000);
  };

  socket.onopen = () => {
    console.log('WebSocket connected');
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
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
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    setTimeout(() => connectWebSocket(), 5000);
  };
}

connectWebSocket();

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/build/service-worker.js';

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
      registration.unregister()
        .then(() => console.log('Service Worker unregistered'))
        .catch((error) => console.error('Failed to unregister Service Worker:', error));
    });
  }
}