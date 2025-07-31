import bcrypt from 'bcrypt';
import { AdminUser, UserSession, BaseUser } from '../model/password/admin';

export const findBaseUserByEmail = async (email: string): Promise<BaseUser | null> => {
  return await BaseUser.findOne({ where: { email } });
};

export const findUserWithAdminRole = async (
  userId: number
): Promise<{ isAdminOrHr: boolean, user: any } | null> => {
  const user = await BaseUser.findOne({
    where: { id: userId },
    include: [{
      model: AdminUser,
      as: 'adminData',
      attributes: ['role']
    }]
  });
  if (!user || !user.adminData) return null;
  const isAdminOrHr = user.adminData.role === 'admin' || user.adminData.role === 'hr';
  return { isAdminOrHr, user };
};

export const updateTempTokenInSession = async (
  userId: number,
  tempToken: string
): Promise<void> => {
  await UserSession.update(
    { tempToken, createdAt: new Date() },
    { where: { userId } }
  );
};

export const updatePasswordWithSession = async (
  baseUser: BaseUser,
  password: string,
  confirmPassword: string
): Promise<void> => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await AdminUser.update(
    { passwordHash: hashedPassword },
    { where: { userId: baseUser.id } }
  );
};

export const findBaseUserById = async (id: number): Promise<BaseUser | null> => {
  return await BaseUser.findOne({ where: { id } });
};