export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `./service-worker.js`;

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

let socket = new WebSocket('ws://localhost:4000');

socket.onopen = () => {
  console.log('WebSocket connected');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
   setTimeout(() => socket = new WebSocket('ws://localhost:4000'), 5000);
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received message:', message);
};

socket.onclose = () => {
  console.log('WebSocket closed');
};

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
