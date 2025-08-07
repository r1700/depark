import { Request, Response } from 'express';
import { sendResetEmail } from '../utils/email';
import { requestPasswordReset, changePasswordForCurrentUser } from '../services/user.service';
import { isTokenValid } from '../repository/user.repository';

export const handlePasswordReset = async (req: Request, res: Response) => {
  const { email, token, password, confirmPassword, userId } = req.body;

  try {
    // שלב 1: בקשת איפוס סיסמה (שליחת מייל עם קישור)
    if (email && !token && !password && !confirmPassword) {
      const { tempToken, userId } = await requestPasswordReset(email);
      const resetUrl = `http://localhost:3000/password-reset/ResetPassword?token=${tempToken}&userId=${userId}`;
      await sendResetEmail(email, resetUrl);
      return res.status(200).json({ message: 'Token generated', token: tempToken });
    }

    // שלב 2: שינוי סיסמה בפועל (בודק תוקף טוקן לפני שינוי)
    if (password && confirmPassword && token && userId) {
      // בדיקת תוקף הטוקן
      const valid = await isTokenValid(userId, token);
      if (!valid) {
        return res.status(400).json({ error: 'Token expired' });
      }
     await changePasswordForCurrentUser(userId, password, confirmPassword);
      return res.status(200).json({ message: 'Password changed successfully' });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};