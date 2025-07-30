-- Create RetrievalQueues table
CREATE TABLE RetrievalQueues (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  sessionId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NULL,
  licensePlate VARCHAR(255) NOT NULL,
  undergroundSpot VARCHAR(255) NOT NULL,
  requestedAt TIMESTAMP NOT NULL,
  estimatedTime TIMESTAMP NOT NULL,
  position INT NOT NULL,
  status ENUM('queued', 'processing', 'ready', 'completed') NOT NULL,
  assignedPickupSpot VARCHAR(255) NULL,
  requestSource ENUM('mobile', 'tablet') NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into RetrievalQueues table
INSERT INTO RetrievalQueues (
  id, sessionId, userId, licensePlate, undergroundSpot, requestedAt, estimatedTime, position, status, assignedPickupSpot, requestSource, createdAt, updatedAt
) 
VALUES
  ('1', 'session123', 'user001', 'ABC123', 'B1', '2025-07-15T08:00:00', '2025-07-15T08:15:00', 1, 'queued', 'A1', 'mobile', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', 'session124', 'user002', 'XYZ456', 'B2', '2025-07-15T08:30:00', '2025-07-15T08:45:00', 2, 'processing', 'A2', 'tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Rollback: Drop the RetrievalQueues table
DROP TABLE IF EXISTS RetrievalQueues;
