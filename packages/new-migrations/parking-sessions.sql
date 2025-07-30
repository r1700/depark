CREATE TYPE "parking_status" AS ENUM ('parked', 'retrieval_requested', 'completed');
CREATE TYPE "requested_by" AS ENUM ('mobile', 'tablet');

CREATE TABLE "ParkingSessions" (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "userId" VARCHAR NOT NULL,
  "vehicleId" VARCHAR NOT NULL,
  "licensePlate" VARCHAR NOT NULL,
  "surfaceSpot" VARCHAR,
  "undergroundSpot" VARCHAR,
  "status" "parking_status",
  "entryTime" TIMESTAMP NOT NULL,
  "exitTime" TIMESTAMP,
  "retrievalRequestTime" TIMESTAMP,
  "actualRetrievalTime" TIMESTAMP,
  "pickupSpot" VARCHAR,
  "requestedBy" "requested_by"
);

-- ביצוע ה-Bulk Insert
INSERT INTO "ParkingSessions" ("id", "userId", "vehicleId", "licensePlate", "surfaceSpot", "undergroundSpot", "status", "entryTime", "exitTime", "retrievalRequestTime", "actualRetrievalTime", "pickupSpot", "requestedBy")
VALUES
  ('1', 'user123', 'vehicle1', 'ABC123', '5', NULL, 'parked', '2025-07-15T07:00:00', NULL, NULL, NULL, NULL, NULL),
  ('2', 'user456', 'vehicle2', 'XYZ456', '2', NULL, 'retrieval_requested', '2025-07-15T08:30:00', NULL, '2025-07-15T09:00:00', NULL, '6', 'mobile');
