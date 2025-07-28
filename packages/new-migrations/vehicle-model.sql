-- Create ENUM for source types
CREATE TYPE vehicle_model_source AS ENUM (
  'manual', 
  'government_db', 
  'hr_input'
);

-- Create VehicleModels Table
CREATE TABLE VehicleModels (
  id TEXT PRIMARY KEY NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  yearRange JSONB NOT NULL,
  dimensions JSONB NOT NULL,
  source vehicle_model_source NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy TEXT
);

-- Enable Row Level Security
ALTER TABLE VehicleModels ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_vehiclemodels_make ON VehicleModels(make);
CREATE INDEX idx_vehiclemodels_source ON VehicleModels(source);
CREATE INDEX idx_vehiclemodels_updatedBy ON VehicleModels(updatedBy);

-- Insert Sample Data
INSERT INTO VehicleModels (
  id, make, model, yearRange, dimensions, 
  source, updatedBy
) VALUES 
(
  '1', 'Toyota', 'Corolla', 
  '{"start": 2000, "end": 2020}'::jsonb, 
  '{"length": 4.63, "width": 1.78, "height": 1.43}'::jsonb, 
  'manual', 'admin'
),
(
  '2', 'Ford', 'Focus', 
  '{"start": 2005, "end": 2021}'::jsonb, 
  '{"length": 4.37, "width": 1.82, "height": 1.46}'::jsonb, 
  'government_db', 'admin'
);