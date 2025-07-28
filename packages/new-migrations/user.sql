-- Create Users Table
CREATE TABLE "Users" (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    department TEXT,
    "employeeId" TEXT,
    "googleId" TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'declined', 'suspended')) NOT NULL,
    "maxCarsAllowedParking" INTEGER,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert Sample Users
INSERT INTO "Users" (
    email, 
    "firstName", 
    "lastName", 
    department, 
    "employeeId", 
    "googleId", 
    status, 
    "maxCarsAllowedParking", 
    "createdBy", 
    "approvedBy", 
    "approvedAt", 
    "createdAt", 
    "updatedAt"
) VALUES 
(
    'john.doe@example.com',
    'John',
    'Doe',
    'Engineering',
    'E12345',
    'google-id-12345',
    'approved',
    2,
    'admin',
    'admin',
    NOW(),
    NOW(),
    NOW()
),
(
    'jane.smith@example.com',
    'Jane',
    'Smith',
    'Sales',
    'E67890',
    'google-id-67890',
    'pending',
    1,
    'admin',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Enable Row Level Security
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;