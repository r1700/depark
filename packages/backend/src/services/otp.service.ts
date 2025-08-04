import { error } from "console";
import pool from './db/db';
const otpGenerator = require('otp-generator');

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

// Generate a 6-character OTP (digits + letters, no special characters)
export async function createOtp(contact: string): Promise<string> {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: true,
    upperCase: true,
    specialChars: false,
  });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiry
  const userId = await userIdByContact(contact);

  await pool.query(
    `UPDATE "UserSessions"
     SET "tempToken" = $1,
         "expiresAt" = $2
     WHERE "userId" = $3`,
    [otp, expiresAt, userId]
  );

  return otp;
}

// Fetch the OTP entry from the database
export async function getOtpEntry(contact: string): Promise<OtpEntry | undefined> {
  const userId = await userIdByContact(contact);

  const result = await pool.query(
    `SELECT "tempToken", "expiresAt"
     FROM "UserSessions"
     WHERE "userId" = $1`,
    [userId]
  );

  if (result.rows.length === 0) return undefined;

  const row = result.rows[0];
  return {
    otp: row.tempToken,
    expiresAt: Number(row.expiresAt),
  };
}

// Remove the OTP from the database
export async function removeOtp(contact: string): Promise<void> {
  const userId = await userIdByContact(contact);

  await pool.query(
    `UPDATE "UserSessions"
     SET "tempToken" = NULL
     WHERE "userId" = $1`,
    [userId]
  );
}

// Validate the OTP against DB value and expiration
export async function verifyOtp(contact: string, inputOtp: string): Promise<boolean> {
  const entry = await getOtpEntry(contact);
  if (!entry) return false;

  const now = Date.now();
  if (now > entry.expiresAt) return false;

  return entry.otp === inputOtp;
}

// Check if the user exists and has a session
export async function existUser(contact: string): Promise<boolean> {
  try {
    const userId = await userIdByContact(contact);
    const result = await pool.query(
      `SELECT * FROM "UserSessions"
       WHERE "userId" = $1`,
      [userId]
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

// Get user ID by email or phone
export async function userIdByContact(contact: string): Promise<number> {
  const result = await pool.query(
    `SELECT id FROM "Users"
     WHERE "email" = $1 OR "phone" = $1`,
    [contact]
  );

  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    throw error("User not found");
  }
}
