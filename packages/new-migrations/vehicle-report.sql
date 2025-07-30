-- Create VehicleReports Table
CREATE TABLE VehicleReports (
  id TEXT PRIMARY KEY NOT NULL,
  totalVehicles INTEGER NOT NULL,
  activeVehicles INTEGER NOT NULL,
  unknownModels INTEGER NOT NULL,
  dimensionSources JSONB NOT NULL,
  topMakes JSONB NOT NULL,
  generatedBy TEXT NOT NULL,
  generatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE VehicleReports ENABLE ROW LEVEL SECURITY;

-- Create Index
CREATE INDEX idx_vehiclereports_generatedBy ON VehicleReports(generatedBy);

-- Insert Sample Data
INSERT INTO VehicleReports (
  id, totalVehicles, activeVehicles, unknownModels, 
  dimensionSources, topMakes, generatedBy
) VALUES 
(
  '1', 500, 400, 50, 
  '{"manual": 100, "government_db": 200, "model_default": 50}'::jsonb, 
  '[{"make": "Toyota", "count": 100}, {"make": "Honda", "count": 80}]'::jsonb, 
  'admin'
),
(
  '2', 450, 350, 30, 
  '{"manual": 120, "government_db": 150, "model_default": 40}'::jsonb, 
  '[{"make": "Ford", "count": 90}, {"make": "BMW", "count": 60}]'::jsonb, 
  'admin'
);