-- Create ParkingUsageStats table
CREATE TABLE ParkingUsageStats (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  date DATE NOT NULL,
  hour INT NOT NULL,
  totalParkedCars INT NOT NULL,
  avgRetrievalTime INT NOT NULL,
  maxQueueLength INT NOT NULL,
  peakUsageTime VARCHAR(255) NOT NULL,
  utilizationPercentage FLOAT NOT NULL,
  totalEntries INT NOT NULL,
  totalExits INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into ParkingUsageStats table
INSERT INTO ParkingUsageStats (
  id, date, hour, totalParkedCars, avgRetrievalTime, maxQueueLength, 
  peakUsageTime, utilizationPercentage, totalEntries, totalExits, createdAt, updatedAt
) 
VALUES
  ('1', '2025-07-15', 7, 30, 5, 10, '08:00', 85.5, 50, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', '2025-07-15', 8, 35, 7, 12, '09:00', 90.3, 60, 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Rollback: Drop the ParkingUsageStats table
DROP TABLE IF EXISTS ParkingUsageStats;
