import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  findBaseUserByEmail,
  findUserWithAdminRole,
  updateTempTokenInSession,
  updatePasswordWithSession,
  findBaseUserById
} from '../repository/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_EXPIRATION_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRATION_MINUTES || '15');

// בקשת איפוס: שומר את ה־userId ב־session ומחזיר טוקן אמיתי
export const requestPasswordReset = async (req: any, email: string): Promise<string> => {
  const baseUser = await findBaseUserByEmail(email);
  if (!baseUser) {
    throw new Error('User not found');
  }

  const userWithRole = await findUserWithAdminRole(baseUser.id);
  if (!userWithRole || !userWithRole.isAdminOrHr) {
    throw new Error('User not authorized for password reset');
  }

  // שמירת ה־userId ב־session
  req.session.userId = baseUser.id;

  // יצירת טוקן אמיתי
  const tempToken = jwt.sign(
    { userId: baseUser.id, email: baseUser.email },
    JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRATION_MINUTES}m` }
  );

  return tempToken;
};

// שינוי סיסמה רק עם שתי סיסמאות, מזהה לפי ה־userId מה־session
export const changePasswordForCurrentUser = async (
  req: any,
  password: string,
  confirmPassword: string
): Promise<void> => {
  const userId = req.session.userId; // מזהה מתוך session
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const baseUser = await findBaseUserById(userId);
  if (!baseUser) {
    throw new Error('User not found');
  }
  await updatePasswordWithSession(baseUser, password, confirmPassword);
};