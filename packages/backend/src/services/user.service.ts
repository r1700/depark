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

export const requestPasswordReset = async (req: any, email: string): Promise<string> => {
  const baseUser = await findBaseUserByEmail(email);
  if (!baseUser) {
    throw new Error('User not found');
  }

  const userWithRole = await findUserWithAdminRole(baseUser.id);
  if (!userWithRole || !userWithRole.isAdminOrHr) {
    throw new Error('User not authorized for password reset');
  }

  req.session.userId = baseUser.id;

  const tempToken = jwt.sign(
    { userId: baseUser.id, email: baseUser.email },
    JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRATION_MINUTES}m` }
  );

  return tempToken;
};

export const changePasswordForCurrentUser = async (
  req: any,
  password: string,
  confirmPassword: string
): Promise<void> => {
  const userId = req.session.userId; 
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const baseUser = await findBaseUserById(userId);
  if (!baseUser) {
    throw new Error('User not found');
  }
  await updatePasswordWithSession(baseUser, password, confirmPassword);
};