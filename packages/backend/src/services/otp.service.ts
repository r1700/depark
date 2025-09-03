import { error, log } from "console";
const otpGenerator = require('otp-generator');
import { baseuser, usersessions } from '../model/database-models/user.model'; // ודא שיש לך מודלים כאלה
import { Op } from 'sequelize';
import sequelize from "../model/database-models/user.model";

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

  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry (מספר, לא ISO)
  const userId = await userIdByContact(contact);

  await usersessions.update(
    { temp_token: otp, expires_at: expiresAt },
    { where: { baseuser_id: userId } }
  );

  return otp;
}

// Fetch the OTP entry from the database
export async function getOtpEntry(contact: string): Promise<OtpEntry | undefined> {
  const userId = await userIdByContact(contact);

  const session = await usersessions.findOne({
    where: { baseuser_id: userId }
  });

  if (!session) return undefined;

  return {
    otp: session.temp_token,
    expiresAt: Number(session.expires_at),
  };
}

// Remove the OTP from the database
export async function removeOtp(contact: string): Promise<void> {
  const userId = await userIdByContact(contact);

  await usersessions.update(
    { temp_token: null },
    { where: { baseuser_id: userId } }
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
    
    const userId:string = await userIdByContact(contact);
    if (userId) {
      const session = await usersessions.findOne({ where: { baseuser_id: userId } });
      return !!session;
    }
    else {
      return false;
    }
  } catch (error) {
    console.log("Error checking user existence:", error);
    return false;
  }
}

// Get user ID by email or phone
export async function userIdByContact(contact: string): Promise<string> {

  const user = await baseuser.findOne({
    where: {
      [Op.or]: [
        { email: contact },
        { phone: contact }
      ]
    }
  });

  if (user) {
    return user.id.toString(); // Ensure the ID is a string
  } else {
    throw new Error("User not found");
  }
} 