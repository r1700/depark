import { Request, Response } from 'express';
import { requestPasswordReset, confirmPasswordReset } from '../services/user.service';

export const handlePasswordReset = async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;
    
    // אם יש רק email - בקשת איפוס
    if (email && !token && !password) {
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      await requestPasswordReset(email);
      return res.status(200).json({ message: 'Reset link sent' });
    }
    
    // אם יש token + password - אישור איפוס
    if (token && password && !email) {
      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
      }
      
      await confirmPasswordReset(token, password);
      return res.status(200).json({ message: 'Password reset successful' });
    }
    
    // אם הנתונים לא תקינים
    return res.status(400).json({ 
      error: 'Invalid request. Send either email for reset request, or token+password for confirmation' 
    });
    
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};