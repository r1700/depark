CREATE TYPE "notification_type" AS ENUM ('queue_update', 'retrieval_ready', 'parking_full', 'system_maintenance');
CREATE TYPE "notification_channel" AS ENUM ('websocket', 'push_notification');

CREATE TABLE "NotificationLogs" (
  "id" VARCHAR PRIMARY KEY NOT NULL,
  "userId" VARCHAR,
  "type" "notification_type" NOT NULL,
  "channel" "notification_channel" NOT NULL,
  "message" VARCHAR NOT NULL,
  "delivered" BOOLEAN NOT NULL DEFAULT FALSE,
  "deliveredAt" TIMESTAMP,
  "error" VARCHAR,
  "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ביצוע ה-Bulk Insert
INSERT INTO "NotificationLogs" ("id", "userId", "type", "channel", "message", "delivered", "deliveredAt", "error", "timestamp", "createdAt", "updatedAt")
VALUES
  ('1', 'user123', 'queue_update', 'websocket', 'Queue has been updated.', TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', 'user456', 'retrieval_ready', 'push_notification', 'Your vehicle is ready for retrieval.', FALSE, NULL, 'Failed to deliver', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('3', 'user789', 'parking_full', 'websocket', 'Parking is full. Please try again later.', TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('4', NULL, 'system_maintenance', 'push_notification', 'Scheduled system maintenance at 2 AM.', TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
