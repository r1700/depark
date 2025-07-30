-- Create ENUM for connection types
CREATE TYPE connection_type AS ENUM (
  'mobile', 
  'tablet'
);

-- Create WebSocketConnections Table
CREATE TABLE WebSocketConnections (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT,
  connectionType connection_type NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  connectedAt TIMESTAMP WITH TIME ZONE NOT NULL,
  lastActivity TIMESTAMP WITH TIME ZONE NOT NULL,
  ipAddress TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE WebSocketConnections ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_websocketconnections_userId ON WebSocketConnections(userId);
CREATE INDEX idx_websocketconnections_connectionType ON WebSocketConnections(connectionType);

-- Insert Sample Data
INSERT INTO WebSocketConnections (
  id, userId, connectionType, isActive, 
  connectedAt, lastActivity, ipAddress
) VALUES 
(
  'connection1', 'user123', 'mobile', true, 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '192.168.1.1'
),
(
  'connection2', NULL, 'tablet', true, 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '192.168.1.2'
);