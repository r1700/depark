-- יצירת טבלת BaseUser
CREATE TABLE IF NOT EXISTS "BaseUser" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL
);

-- הוספת נתונים לטבלת BaseUser
INSERT INTO "BaseUser" ("email", "firstName", "lastName", "createdAt", "updatedAt")
VALUES
    ('user1@example.com', 'John', 'Doe', NOW(), NOW()),
    ('user2@example.com', 'Jane', 'Smith', NOW(), NOW()),
    ('user3@example.com', 'Alice', 'Johnson', NOW(), NOW());
