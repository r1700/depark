-- Create ENUM for UserType
CREATE TYPE user_type AS ENUM ('user', 'admin');

-- Create LoginAttempts Table
CREATE TABLE LoginAttempts (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  userType user_type NOT NULL,
  success BOOLEAN NOT NULL,
  ipAddress TEXT NOT NULL,
  userAgent TEXT NOT NULL,
  failureReason TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE LoginAttempts ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_loginattempts_email ON LoginAttempts(email);
CREATE INDEX idx_loginattempts_userType ON LoginAttempts(userType);
CREATE INDEX idx_loginattempts_success ON LoginAttempts(success);
CREATE INDEX idx_loginattempts_timestamp ON LoginAttempts(timestamp);

-- Insert Sample Data
INSERT INTO LoginAttempts (
  id, email, userType, success, 
  ipAddress, userAgent, failureReason
) VALUES 
(
  '1', 'user@example.com', 'user', true, 
  '192.168.1.1', 'Mozilla/5.0', NULL
),
(
  '2', 'admin@example.com', 'admin', false, 
  '192.168.1.2', 'Mozilla/5.0', 'Incorrect password'
);