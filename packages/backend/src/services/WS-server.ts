import http from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
let wss: WebSocketServer | null = null;
export function initWebSocket(server: http.Server) {
  if (wss) return wss; // avoid double init
  wss = new WebSocketServer({ server });
  wss.on('connection', (socket: WebSocket, req: IncomingMessage) => {
    socket.on('message', () => {
    });
    socket.on('close', () => {
    });
    socket.on('error', () => {
    });
  });
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