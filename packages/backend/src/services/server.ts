import { log } from 'console';
import WebSocket, { Server } from 'ws';

const PORT = 8080;
const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });
// const wss = new Server({ port: PORT });
console.log(`WebSocket server started on port ${PORT}`);


interface Message {
    type: string;
    content?: string;
    token?: string;
    roomName?: string;
    targetToken?: string;// טוקן יעד לשליחה
}

// ניהול לקוחות לפי טוקן
// קישור דו-כיווני בין token ↔ WebSocket

// טוקן → WebSocket
// מאפשר לשלוח הודעה לפי מזהה טוקן
const tokenSockets = new Map<string, WebSocket>();

// WebSocket → טוקן
// מאפשר לדעת איזה טוקן משויך לכל חיבור (ולמחוק נכון)
const socketTokens = new Map<WebSocket, string>();

const rooms = new Map<string, Set<WebSocket>>();
const clientRooms = new Map<WebSocket, Set<string>>();

// פונקציה ליצירת טוקן זמני
function generateTempToken(): string {
    return 'token-' + Math.random().toString(36).substring(2, 10);
}

wss.on('connection', (ws: WebSocket) => {
    console.log(`New client connected`);
    const tempToken = generateTempToken();
    tokenSockets.set(tempToken, ws);
    socketTokens.set(ws, tempToken);
    ws.send(JSON.stringify({
        type: 'assignedToken',
        token: tempToken
    }));

    ws.on('message', (message: string) => {
        log(`Received message: ${message}`);
        let parsedMessage: Message;
        try {
            parsedMessage = JSON.parse(message);
        } catch {
            ws.send(JSON.stringify({ type: 'error', content: 'Invalid JSON format' }));
            return;
        }

        // אם יש token – לקשר אותו ל־WebSocket
        if (parsedMessage.token) {
            tokenSockets.set(parsedMessage.token, ws);
            socketTokens.set(ws, parsedMessage.token);
        }

        switch (parsedMessage.type) {
          
            case 'sendToToken':
                if (parsedMessage.targetToken && parsedMessage.content) {
                    sendMessageToToken(parsedMessage.targetToken, parsedMessage.content);
                }
                break;

            case 'joinRoom':
                if (parsedMessage.roomName) {
                    joinRoom(ws, parsedMessage.roomName);
                    ws.send(JSON.stringify({ type: 'info', content: `Joined room: ${parsedMessage.roomName}` }));
                }
                break;

            case 'sendToRoom':
                if (parsedMessage.roomName && parsedMessage.content) {
                    sendMessageToRoom(parsedMessage.roomName, parsedMessage.content);
                }
                break;

            case 'message':
            default:
                broadcastExceptSender(ws, parsedMessage.content || '');
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected`);

        const token = socketTokens.get(ws);
        if (token) tokenSockets.delete(token);
        socketTokens.delete(ws);

        clientRooms.get(ws)?.forEach(room => {
            rooms.get(room)?.delete(ws);
        });
        clientRooms.delete(ws);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

// עזר – שליחה לטוקן
function sendMessageToToken(token: string, message: string) {
    const socket = tokenSockets.get(token);
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'message', content: message }));
    }
}

// עזר – שידור לכל חוץ מהשולח
function broadcastExceptSender(sender: WebSocket, content: string) {
    wss.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', content }));
        }
    });
}

// עזר – חדרים
function joinRoom(ws: WebSocket, roomName: string) {
    if (!rooms.has(roomName)) {
        rooms.set(roomName, new Set());
    }
    rooms.get(roomName)!.add(ws);

    const joinedRooms = clientRooms.get(ws) || new Set();
    joinedRooms.add(roomName);
    clientRooms.set(ws, joinedRooms);
}

function sendMessageToRoom(roomName: string, message: string) {
    const room = rooms.get(roomName);
    if (room) {
        room.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', content: message }));
            }
        });
    }
}

