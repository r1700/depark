-- Create SystemHealths table
CREATE TABLE SystemHealths (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  component ENUM('opc_bridge', 'api_server', 'database', 'websocket_server', 'government_sync') NOT NULL,
  status ENUM('healthy', 'warning', 'error') NOT NULL,
  message VARCHAR(255) NULL,
  metrics JSONB NULL,
  timestamp TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into SystemHealths table
INSERT INTO SystemHealths (
  id, component, status, message, metrics, timestamp, createdAt, updatedAt
) 
VALUES
  ('1', 'api_server', 'healthy', 'API server is running smoothly.', '{"memoryUsage": 50, "responseTime": 200}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', 'websocket_server', 'warning', 'WebSocket server is experiencing high latency.', '{"memoryUsage": 70, "responseTime": 500}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('3', 'database', 'error', 'Database connection failed.', '{"memoryUsage": 90, "responseTime": 1000}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Rollback: Drop the SystemHealths table
DROP TABLE IF EXISTS SystemHealths;
