import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import vehiclesRouter from './src/routes/vehicles'; 
const app = express();
const port = 5000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    ws.send(`Server received: ${message}`);
  });
  ws.send('Hello, client!');
});

app.use('/api/vehicles', vehiclesRouter); // route for vehicles

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
