-- Create QueueUpdates table
CREATE TABLE QueueUpdates (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  retrievalQueueId VARCHAR(255) NOT NULL,
  position INT NOT NULL,
  estimatedTime TIMESTAMP NOT NULL,
  status ENUM('queued', 'processing', 'ready') NOT NULL,
  message VARCHAR(255) NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  broadcastTo ENUM('specific_user', 'all_tablets', 'all_connected') NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into QueueUpdates table
INSERT INTO QueueUpdates (
  id, retrievalQueueId, position, estimatedTime, status, message, timestamp, broadcastTo, createdAt, updatedAt
) 
VALUES
  ('1', 'queue001', 1, '2025-07-15T08:00:00', 'queued', 'The queue is processing your request.', CURRENT_TIMESTAMP, 'all_connected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', 'queue002', 2, '2025-07-15T09:00:00', 'processing', 'Request is being processed.', CURRENT_TIMESTAMP, 'all_tablets', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Rollback: Drop the QueueUpdates table
DROP TABLE IF EXISTS QueueUpdates;
