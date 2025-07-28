-- Create a custom ENUM type for status
CREATE TYPE vehicle_model_status AS ENUM ('pending_review', 'resolved', 'ignored');

-- Create the table using the custom ENUM type
CREATE TABLE UnknownVehicleModels (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  requestCount INT NOT NULL DEFAULT 0,
  lastRequested TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status vehicle_model_status NOT NULL,
  resolvedBy VARCHAR(255),
  resolvedAt TIMESTAMP,
  resolvedVehicleModelId VARCHAR(255),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserting data into the table
INSERT INTO UnknownVehicleModels (id, make, model, requestCount, lastRequested, status, createdAt) 
VALUES
('1', 'Toyota', 'Corolla', 3, CURRENT_TIMESTAMP, 'pending_review', CURRENT_TIMESTAMP),
('2', 'Honda', 'Civic', 5, CURRENT_TIMESTAMP, 'resolved', CURRENT_TIMESTAMP),
('3', 'Ford', 'Focus', 2, CURRENT_TIMESTAMP, 'ignored', CURRENT_TIMESTAMP);

-- Update the 'resolved' row with additional resolved data
UPDATE UnknownVehicleModels 
SET resolvedBy = 'admin1', 
    resolvedAt = CURRENT_TIMESTAMP, 
    resolvedVehicleModelId = 'H123' 
WHERE id = '2';