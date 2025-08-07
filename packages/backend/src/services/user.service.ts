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

export const requestPasswordReset = async (email: string): Promise<{ tempToken: string, userId: number }> => {
  const baseUser = await findBaseUserByEmail(email);
  if (!baseUser) {
    throw new Error('User not found');
  }

  const userWithRole = await findUserWithAdminRole(baseUser.id);
  if (!userWithRole || !userWithRole.isAdminOrHr) {
    throw new Error('User not authorized for password reset');
  }

  const tempToken = jwt.sign(
    { userId: baseUser.id, email: baseUser.email },
    JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRATION_MINUTES}m` }
  );

  // עדכן את הטוקן הזמני במסד הנתונים
  await updateTempTokenInSession(baseUser.id, tempToken);

  return { tempToken, userId: baseUser.id };
};

export const changePasswordForCurrentUser = async (
  userId: number,
  password: string,
  confirmPassword: string
): Promise<void> => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const baseUser = await findBaseUserById(userId);
  if (!baseUser) {
    throw new Error('User not found');
  }
  await updatePasswordWithSession(baseUser, password, confirmPassword);
};