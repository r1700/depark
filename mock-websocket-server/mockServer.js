const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// יצירת חיבור WebSocket
wss.on('connection', ws => {
  console.log('לקוח התחבר');
  
  // קבלת הודעה מהלקוח
  ws.on('message', message => {
    console.log('הודעה מהלקוח:', message);
  });
  
  // שליחה ללקוח
  ws.send('שלום מהשרת!');
});

// נתיב הבסיס של ה-HTTP
app.get('/', (req, res) => {
  res.send('ברוך הבא לשרת mock websocket!');
});

// הפעלת השרת על פורט 8081
server.listen(8081, () => {
  console.log('שרת HTTP ו-WebSocket פועל על http://localhost:8081');
});