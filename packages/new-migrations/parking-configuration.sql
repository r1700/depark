-- Create ParkingConfigurations Table
CREATE TABLE ParkingConfigurations (
  id TEXT PRIMARY KEY NOT NULL,
  facilityName TEXT NOT NULL,
  totalSurfaceSpots INTEGER NOT NULL,
  surfaceSpotIds TEXT[] NOT NULL,
  avgRetrievalTimeMinutes INTEGER NOT NULL DEFAULT 1,
  maxQueueSize INTEGER NOT NULL,
  operatingHours JSONB NOT NULL,
  timezone TEXT NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE ParkingConfigurations ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_parkingconfigurations_facilityName ON ParkingConfigurations(facilityName);
CREATE INDEX idx_parkingconfigurations_updatedBy ON ParkingConfigurations(updatedBy);
CREATE INDEX idx_parkingconfigurations_timezone ON ParkingConfigurations(timezone);

-- Insert Sample Data
INSERT INTO ParkingConfigurations (
  id, facilityName, totalSurfaceSpots, surfaceSpotIds, 
  avgRetrievalTimeMinutes, maxQueueSize, operatingHours, 
  timezone, updatedBy
) VALUES 
(
  '1', 'Central Parking Lot', 50, 
  ARRAY['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 
  5, 10, 
  '{"start": "07:00", "end": "19:00"}'::jsonb, 
  'Asia/Jerusalem', 'admin123'
),
(
  '2', 'North Parking Garage', 30, 
  ARRAY['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 
  3, 5, 
  '{"start": "08:00", "end": "20:00"}'::jsonb, 
  'Asia/Jerusalem', 'admin456'
);