import { requestPasswordReset, changePasswordForCurrentUser } from '../services/user.service';
import { Request, Response } from 'express';

export const handlePasswordReset = async (req: Request, res: Response) => {
  const { email, token, password, confirmPassword } = req.body;

  try {
    if (email && !token && !password && !confirmPassword) {
      const tempToken = await requestPasswordReset(req, email);
      return res.status(200).json({ message: 'Token generated', token: tempToken });
    }

    if (password && confirmPassword) {
      await changePasswordForCurrentUser(req, password, confirmPassword);
      return res.status(200).json({ message: 'Password changed successfully' });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};