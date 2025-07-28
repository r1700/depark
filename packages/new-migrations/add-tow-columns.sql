-- Add tempToken to UserSessions
ALTER TABLE "usersessions" 
ADD COLUMN IF NOT EXISTS "tempToken" text;

-- Add phone to Users
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "phone" text;