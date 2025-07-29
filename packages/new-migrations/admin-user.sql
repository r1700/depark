CREATE TABLE "AdminUsers" (
  "id" SERIAL PRIMARY KEY,
  "passwordHash" VARCHAR NOT NULL,
  "role" VARCHAR CHECK ("role" IN ('hr', 'admin')) NOT NULL,
  "permissions" TEXT[] NOT NULL,
  "lastLoginAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ביצוע ה-Bulk Insert
INSERT INTO "AdminUsers" ("passwordHash", "role", "permissions", "lastLoginAt", "createdAt", "updatedAt")
VALUES
  ('hashed_password_1', 'admin', ARRAY['read', 'write', 'delete'], NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hashed_password_2', 'hr', ARRAY['read', 'write'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hashed_password_3', 'admin', ARRAY['read'], NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
