CREATE TABLE "GovernmentDataSync" (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "syncDate" TIMESTAMP NOT NULL,
  "recordsProcessed" INTEGER NOT NULL,
  "recordsAdded" INTEGER NOT NULL,
  "recordsUpdated" INTEGER NOT NULL,
  "errors" TEXT[],
  "status" VARCHAR CHECK ("status" IN ('completed', 'failed', 'partial')) NOT NULL,
  "triggeredBy" VARCHAR NOT NULL,
  "fileSource" VARCHAR,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ביצוע ה-Bulk Insert
INSERT INTO "GovernmentDataSync" ("id", "syncDate", "recordsProcessed", "recordsAdded", "recordsUpdated", "errors", "status", "triggeredBy", "fileSource", "createdAt", "updatedAt")
VALUES
  ('sync_001', CURRENT_TIMESTAMP, 100, 75, 25, NULL, 'completed', 'admin_001', '/path/to/file.csv', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
