CREATE TYPE report_type AS ENUM ('daily', 'weekly', 'monthly', 'custom');
CREATE TYPE report_format AS ENUM ('json', 'csv', 'pdf');

CREATE TABLE UsageReports (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  reportType report_type NOT NULL,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  generatedBy VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  format report_format NOT NULL,
  filePath VARCHAR(255),
  generatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserting data into the table
INSERT INTO UsageReports (id, reportType, startDate, endDate, generatedBy, data, format, filePath, generatedAt) 
VALUES
('1', 'daily', '2025-07-01', '2025-07-01', 'user1', 
 '{"totalSessions": 100, "avgParkingDuration": 15, "avgRetrievalTime": 10, "peakHours": [{"hour": 8, "sessions": 50}, {"hour": 9, "sessions": 40}], "utilizationRate": 75, "totalEntries": 200, "totalExits": 190}', 
 'json', 'path/to/file1.json', CURRENT_TIMESTAMP),
('2', 'monthly', '2025-07-01', '2025-07-31', 'user2', 
 '{"totalSessions": 3000, "avgParkingDuration": 20, "avgRetrievalTime": 12, "peakHours": [{"hour": 12, "sessions": 300}, {"hour": 18, "sessions": 250}], "utilizationRate": 85, "totalEntries": 6000, "totalExits": 5800}', 
 'csv', 'path/to/file2.csv', CURRENT_TIMESTAMP);
