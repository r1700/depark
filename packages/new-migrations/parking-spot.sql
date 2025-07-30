CREATE TYPE "spot_type" AS ENUM ('surface', 'underground');

CREATE TABLE "ParkingSpots" (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "type" "spot_type" NOT NULL,
  "spotNumber" VARCHAR NOT NULL,
  "isOccupied" BOOLEAN NOT NULL DEFAULT FALSE,
  "currentVehicleId" VARCHAR,
  "lastUpdated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ביצוע ה-Bulk Insert
INSERT INTO "ParkingSpots" ("id", "type", "spotNumber", "isOccupied", "currentVehicleId", "lastUpdated")
VALUES
  ('1', 'surface', 'A1', FALSE, NULL, CURRENT_TIMESTAMP),
  ('2', 'surface', 'A2', TRUE, 'vehicle123', CURRENT_TIMESTAMP),
  ('3', 'underground', 'B1', FALSE, NULL, CURRENT_TIMESTAMP),
  ('4', 'underground', 'B2', TRUE, 'vehicle456', CURRENT_TIMESTAMP);
