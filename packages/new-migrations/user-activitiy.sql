CREATE TYPE user_type AS ENUM ('hr', 'admin', 'employee', 'anonymous');

CREATE TABLE UserActivities (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  userId VARCHAR(255),
  userType user_type NOT NULL,
  action VARCHAR(255) NOT NULL,
  details JSONB NOT NULL,
  ipAddress VARCHAR(255),
  userAgent VARCHAR(255),
  timestamp TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserting data into the table
INSERT INTO UserActivities (id, userId, userType, action, details, ipAddress, userAgent, timestamp, createdAt, updatedAt) 
VALUES
('1', 'user123', 'admin', 'login', '{"success": true}', '192.168.1.1', 'Mozilla/5.0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2', 'user456', 'employee', 'update_profile', '{"field": "email", "oldValue": "user@old.com", "newValue": "user@new.com"}', '192.168.1.2', 'Mozilla/5.0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
