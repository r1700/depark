-- Create UserSessions table with existing user_type ENUM
CREATE TABLE IF NOT EXISTS UserSessions (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  userId VARCHAR(255) NOT NULL,
  userType user_type NOT NULL,
  token VARCHAR(255) NOT NULL,
  refreshToken VARCHAR(255),
  expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  ipAddress VARCHAR(255) NOT NULL,
  userAgent VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastActivity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on userId for better query performance
CREATE INDEX idx_usersessions_userid ON UserSessions(userId);

-- Optional: Enable Row Level Security
ALTER TABLE UserSessions ENABLE ROW LEVEL SECURITY;