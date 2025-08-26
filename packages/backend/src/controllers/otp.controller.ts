import { existUser, verifyOtp, createOtp, userIdByContact } from '../services/otp.service';
import { sendOtpEmail, sendOtpSms } from '../utils/otp.sender';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();



// Controller: Handle OTP creation request
export async function handleCreateOtp(req: any, res: any) {
  const { contact } = req.body;

  if (!contact) {
    return res.status(400).json({ error: 'Missing contact' });
  }

  try {
    const userExists = await existUser(contact);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const otp = await createOtp(contact);

    // Determine if contact is email or phone
    const isEmail = contact.includes('@');
    const response = isEmail
      ? await sendOtpEmail(contact, otp)
      : await sendOtpSms(contact, otp);

    if (response) {
      return res.status(200).json({ message: 'OTP sent' });
    } else {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (err) {
    console.error('Failed to send OTP:', err);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}

// Controller: Handle OTP verification request
export async function handleVerifyOtp(req: any, res: any) {
  const { contact, otp } = req.body;

  const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  const TOKEN_EXPIRATION_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRATION_MINUTES || '15');

  if (!contact || !otp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const isValid = await verifyOtp(contact, otp);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  const userId = await userIdByContact(contact);
  const token = jwt.sign(
    {
      userId: userId,
      contact: contact
    },
    JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRATION_MINUTES}m` }
  );
  return res.status(200).json({
    message: 'OTP verified',
    token,
    user: {
      id: userId,
      contact: contact,
    }
  });
}
