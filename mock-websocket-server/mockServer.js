const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client logged in');
  
  ws.on('message', message => {
    console.log('Message from the client:', message);
  });
  
  ws.send('hello from the server!');
});

app.get('/', (req, res) => {
  res.send('welcome to the mock websocket server!');
});

server.listen(8081, () => {
  console.log('HTTP and WebSocket server running at http://localhost:8081');
});