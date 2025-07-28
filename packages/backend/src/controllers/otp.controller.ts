import { existUser, verifyOtp, createOtp } from '../services/otp.service';
import { sendOtpEmail, sendOtpSms } from '../utils/otp.sender';

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

  if (!contact || !otp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const isValid = await verifyOtp(contact, otp);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  return res.status(200).json({ message: 'OTP verified successfully' });
}
