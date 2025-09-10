// import http from 'http';
// import WebSocket, { Server as WebSocketServer } from 'ws';
// import { IncomingMessage } from 'http';
// import { getDashboardSnapshot } from './dashboard/dashboardStatistics.service';
// let wss: WebSocketServer | null = null;

// export function initWebSocket(server: http.Server) {
//   if (wss) return wss; // avoid double init
//   wss = new WebSocketServer({ server });
//   function heartbeat(this: any) {
//   (this as any).isAlive = true;
// }
// wss.on('connection', async (ws) => {
//   console.log('WS client connected');
//   (ws as any).isAlive = true;
//   ws.on('pong', heartbeat);
//   try {
//     const snapshot = await getDashboardSnapshot();
//     ws.send(JSON.stringify({ type: 'update', data: snapshot }));
//   } catch (err) {
//     console.error('Error sending initial snapshot:', err);
//   }
// });
// setInterval(async () => {
//   try {
//     const snapshot = await getDashboardSnapshot();
//     const message = JSON.stringify({ type: 'update', data: snapshot });
//     wss.clients.forEach((client: any) => {
//       if (client.readyState === 1) {
//         client.send(message);
//       }
//     });
//   } catch (err) {
//     console.error('Error broadcasting snapshot:', err);
//   }
// }, 1000);
// setInterval(() => {
//   wss.clients.forEach((ws: any) => {
//     if (ws.isAlive === false) return ws.terminate();
//     ws.isAlive = false;
//     ws.ping();
//   });
// }, 30000);
//   wss.on('connection', (socket: WebSocket, req: IncomingMessage) => {
//     socket.on('message', () => {
//     });
//     socket.on('close', () => {
//     });
//     socket.on('error', () => {
//     });
//   });
//   return wss;
// }
// export function broadcastEvent(payload: any) {
//   if (!wss) return;
//   const data = JSON.stringify(payload);
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// }

import http from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { getDashboardSnapshot } from '../services/dashboard/dashboardStatistics.service';

let wss: WebSocketServer | null = null;

export function initWebSocket(server: http.Server) {
  if (wss) return wss; // avoid double init
  wss = new WebSocketServer({ server });

  function heartbeat(this: any) {
    this.isAlive = true;
  }

  wss.on('connection', async (socket: WebSocket, req: IncomingMessage) => {
    (socket as any).isAlive = true;
    socket.on('pong', heartbeat);

    try {
      const snapshot = await getDashboardSnapshot();
      socket.send(JSON.stringify({ type: 'update', data: snapshot }));
    } catch (err) {
      console.error('Error sending initial snapshot:', err);
    }
  });

  // Broadcast snapshot every second
  setInterval(async () => {
    if (!wss) return;
    try {
      const snapshot = await getDashboardSnapshot();
      const message = JSON.stringify({ type: 'update', data: snapshot });
      wss.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (err) {
      console.error('Error broadcasting snapshot:', err);
    }
  }, 1000);

  // Keepalive
  setInterval(() => {
    if (!wss) return;
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  return wss;
}

export function broadcastEvent(payload: any) {
  if (!wss) return;
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}