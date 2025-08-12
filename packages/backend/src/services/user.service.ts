import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  findBaseUserByEmail,
  findUserWithAdminRole,
  updateTempTokenInSession,
  updatePasswordWithSession,
  findBaseUserById,
  isTokenValid,
  createUserSession,
  updateAdminUserPassword
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

  await updateTempTokenInSession(baseUser.id, tempToken);

  return { tempToken, userId: baseUser.id };
};

export const resetPassword = async (
  token: string,
  userId: number,
  password: string,
  confirmPassword: string
): Promise<void> => {
  const isValid = await isTokenValid(userId, token, TOKEN_EXPIRATION_MINUTES);
  if (!isValid) {
    throw new Error('Invalid or expired token');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const baseUser = await findBaseUserById(userId);
  if (!baseUser) {
    throw new Error('User not found');
  }

  await updatePasswordWithSession(baseUser, password, confirmPassword);
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

export const authenticateUser = async (
  email: string,
  password: string,
  ipAddress: string,
  userAgent: string
): Promise<{ user: any, token: string, expiresAt: Date }> => {
  const baseUser = await findBaseUserByEmail(email);
  if (!baseUser) {
    throw new Error('Invalid credentials');
  }

  const userWithRole = await findUserWithAdminRole(baseUser.id);
  if (!userWithRole || !userWithRole.isAdminOrHr) {
    throw new Error('User not authorized');
  }

  // Role validation - only roles 1 and 2 are authorized
  const userRole = userWithRole.user.adminData.role;
  if (userRole !== 1 && userRole !== 2) {
    throw new Error('User not authorized - invalid role');
  }

  // Password verification
  const isPasswordValid = await bcrypt.compare(password, userWithRole.user.adminData.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { 
      userId: baseUser.id, 
      email: baseUser.email,
      role: userWithRole.user.adminData.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createUserSession(
    baseUser.id,
    'admin',
    token,
    ipAddress,
    userAgent
  );

  return {
    user: {
      id: baseUser.id,
      email: baseUser.email,
      first_name: baseUser.first_name,
      last_name: baseUser.last_name,
      role: userWithRole.user.adminData.role
    },
    token,
    expiresAt
  };
};

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const refreshUserSession = async (
  userId: number,
  oldToken: string,
  ipAddress: string,
  userAgent: string
): Promise<{ token: string, expiresAt: Date }> => {
  const baseUser = await findBaseUserById(userId);
  if (!baseUser) {
    throw new Error('User not found');
  }

  const userWithRole = await findUserWithAdminRole(baseUser.id);
  if (!userWithRole || !userWithRole.isAdminOrHr) {
    throw new Error('User not authorized');
  }

  const newToken = jwt.sign(
    { 
      userId: baseUser.id, 
      email: baseUser.email,
      role: userWithRole.user.adminData.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createUserSession(
    baseUser.id,
    'admin',
    newToken,
    ipAddress,
    userAgent
  );

  return { token: newToken, expiresAt };
};

export const updateUserPassword = async (userId: number, hashedPassword: string): Promise<void> => {
  try {
    await updateAdminUserPassword(userId, hashedPassword);
  } catch (error: any) {
    throw new Error(`Failed to update password: ${error.message}`);
  }
};