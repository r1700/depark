-- Create ENUM for dimensionsSource
CREATE TYPE dimensions_source AS ENUM (
  'model_reference', 
  'manual_override', 
  'government_db'
);

-- Create ENUM for addedBy
CREATE TYPE added_by AS ENUM (
  'user', 
  'hr'
);

-- Create Vehicles Table
CREATE TABLE Vehicles (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  licensePlate TEXT NOT NULL UNIQUE,
  vehicleModelId TEXT,
  color TEXT,
  isActive BOOLEAN NOT NULL,
  isCurrentlyParked BOOLEAN NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  addedBy added_by NOT NULL,
  ParkingSessionId TEXT NOT NULL,
  dimensionOverrides JSONB,
  dimensionsSource dimensions_source NOT NULL
);

-- Enable Row Level Security
ALTER TABLE Vehicles ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_vehicles_userId ON Vehicles(userId);
CREATE INDEX idx_vehicles_parkingSessionId ON Vehicles(ParkingSessionId);

-- Insert Sample Data
INSERT INTO Vehicles (
  id, userId, licensePlate, vehicleModelId, color, 
  isActive, isCurrentlyParked, addedBy, 
  ParkingSessionId, dimensionOverrides, dimensionsSource
) VALUES 
(
  'vehicle1', 'user1', 'ABC123', 'model1', 'Red',
  true, false, 'user',
  'session1', NULL, 'model_reference'
),
(
  'vehicle2', 'user2', 'DEF456', 'model2', 'Blue', 
  true, true, 'hr',
  'session2', NULL, 'manual_override'
);