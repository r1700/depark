import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { 
  findBaseUserByEmail, 
  findUserWithAdminRole, 
  updateTemporaryTokenInSession,
  updatePasswordForUser,
  findUserSessionByUserId 
} from '../repository/user.repository';
import { sendResetEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_EXPIRATION_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRATION_MINUTES || '15');

export const requestPasswordReset = async (email: string): Promise<void> => {
  const baseUser = await findBaseUserByEmail(email);
  if (!baseUser) {
    throw new Error('User not found');
  }

  const userWithRole = await findUserWithAdminRole(baseUser.id);
  if (!userWithRole || !userWithRole.isAdminOrHr) {
    throw new Error('User not authorized for password reset');
  }

  const temporaryToken = jwt.sign(
    { userId: baseUser.id, email: baseUser.email },
    JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRATION_MINUTES}m` }
  );

  await updateTemporaryTokenInSession(baseUser.id, temporaryToken);

  const resetUrl = `https://yourfrontend.com/reset-password?token=${temporaryToken}`;
  await sendResetEmail(email, resetUrl);
};

export const confirmPasswordReset = async (token: string, newPassword: string): Promise<void> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, email: string };
    
    const baseUser = await findBaseUserByEmail(decoded.email);
    if (!baseUser) {
      throw new Error('User not found');
    }

    const session = await findUserSessionByUserId(decoded.userId);
    if (!session || !session.temporaryToken || session.temporaryToken !== token) {
      throw new Error('Invalid token');
    }

    await updatePasswordForUser(decoded.userId, newPassword);
    await updateTemporaryTokenInSession(decoded.userId, '');
    
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid or expired token');
    }
    throw error;
  }
};