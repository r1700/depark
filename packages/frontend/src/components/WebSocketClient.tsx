import React, { useEffect, useRef, useState } from 'react';

interface Message {
  type: string;
  content?: string;
  token?: string;
  roomName?: string;
  targetToken?: string;
}

const WebSocketClient: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const [token, setToken] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [targetToken, setTargetToken] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      if (msg.type === 'assignedToken' && msg.token) {
        setToken(msg.token);
      } else {
        setMessages(prev => [...prev, msg]);
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const send = (type: string, data: Partial<Message> = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, ...data }));
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>React WebSocket Client</h2>
      <p><strong>Your Token:</strong> {token}</p>

      <div>
        <input
          placeholder="Room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={() => send('joinRoom', { roomName: room })}>Join Room</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Target token"
          value={targetToken}
          onChange={(e) => setTargetToken(e.target.value)}
        />
        <input
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => send('sendToToken', { targetToken, content: input })}>Send to Token</button>
        <button onClick={() => send('sendToRoom', { roomName: room, content: input })}>Send to Room</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Messages:</h4>
        <ul>
          {messages.map((msg, i) => (
            <li key={i}>
              <strong>{msg.type}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketClient;
