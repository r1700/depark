-- Create ENUMs for BridgeRequest
CREATE TYPE bridge_request_type AS ENUM (
  'vehicle_lookup', 
  'store_location', 
  'retrieval_request', 
  'queue_status'
);

CREATE TYPE bridge_request_status AS ENUM (
  'pending', 
  'sent', 
  'acknowledged', 
  'failed'
);

-- Create BridgeRequest Table
CREATE TABLE BridgeRequest (
  id TEXT PRIMARY KEY NOT NULL,
  type bridge_request_type NOT NULL,
  payload JSONB NOT NULL,
  status bridge_request_status NOT NULL,
  sentAt TIMESTAMP WITH TIME ZONE NOT NULL,
  acknowledgedAt TIMESTAMP WITH TIME ZONE,
  response JSONB,
  retryCount INTEGER NOT NULL DEFAULT 0,
  maxRetries INTEGER NOT NULL,
  error TEXT,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE BridgeRequest ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_bridgerequest_type ON BridgeRequest(type);
CREATE INDEX idx_bridgerequest_status ON BridgeRequest(status);
CREATE INDEX idx_bridgerequest_retryCount ON BridgeRequest(retryCount);

-- Insert Sample Data
INSERT INTO BridgeRequest (
  id, type, payload, status, sentAt, 
  acknowledgedAt, response, retryCount, 
  maxRetries, error
) VALUES 
(
  '1', 'vehicle_lookup', 
  '{"licensePlate": "ABC123", "vehicleModel": "ModelX"}'::jsonb, 
  'pending', CURRENT_TIMESTAMP, 
  NULL, NULL, 0, 
  3, NULL
),
(
  '2', 'retrieval_request', 
  '{"licensePlate": "XYZ456", "vehicleModel": "ModelY"}'::jsonb, 
  'sent', CURRENT_TIMESTAMP, 
  NULL, '{"message": "Request acknowledged"}'::jsonb, 1, 
  3, NULL
);