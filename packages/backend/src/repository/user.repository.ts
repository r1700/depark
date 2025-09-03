import bcrypt from 'bcrypt';
import { AdminUser, UserSession, BaseUser } from '../model/database-models/resetPassword';
import { Op } from 'sequelize';

export const findBaseUserByEmail = async (email: string): Promise<BaseUser | null> => {
  try {
    return await BaseUser.findOne({ where: { email } });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database error while finding user');
  }
};

export const findUserWithAdminRole = async (
  userId: number
): Promise<{ isAdminOrHr: boolean, user: any } | null> => {
  try {
    const user = await BaseUser.findOne({
      where: { id: userId },
      include: [{
        model: AdminUser,
        as: 'adminData',
        attributes: ['role', 'password_hash']
      }]
    });
    
    if (!user || !user.adminData) {
      return null;
    }
    
    const isAdminOrHr = user.adminData.role === 1 || user.adminData.role === 2;
    
    return { isAdminOrHr, user };
  } catch (error) {
    console.error('Error finding user with admin role:', error);
    throw new Error('Database error while finding user role');
  }
};

export const updateTempTokenInSession = async (
  userId: number,
  tempToken: string
): Promise<void> => {
  try {
    const existingSession = await UserSession.findOne({
      where: { baseuser_id: userId }
    });

    if (existingSession) {
      await UserSession.update(
        { 
          temp_token: tempToken, 
          created_at: new Date(),
          last_activity: new Date()
        },
        { where: { baseuser_id: userId } }
      );
    } else {
      await UserSession.create({
        baseuser_id: userId,
        user_type: 'admin',
        token: 'temp-token',
        temp_token: tempToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        is_active: true,
        ip_address: 'unknown',
        user_agent: 'password-reset',
        created_at: new Date(),
        last_activity: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating temp token:', error);
    throw new Error('Database error while updating temp token');
  }
};

export const updatePasswordWithSession = async (
  baseUser: BaseUser,
  password: string,
  confirmPassword: string
): Promise<void> => {
  try {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length !== 8) {
      throw new Error('Password must be exactly 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const updateResult = await AdminUser.update(
      { password_hash: hashedPassword },
      { where: { baseuser_id: baseUser.id } }
    );

    if (updateResult[0] === 0) {
      throw new Error('No admin user found to update');
    }

    await UserSession.update(
      { temp_token: null },
      { where: { baseuser_id: baseUser.id } }
    );

  } catch (error: any) {
    console.error('Error updating password:', error.message);
    throw error;
  }
};

export const updateAdminUserPassword = async (userId: number, hashedPassword: string): Promise<void> => {
  try {
    const updateResult = await AdminUser.update(
      { 
        password_hash: hashedPassword,
        updated_at: new Date()
      },
      { where: { baseuser_id: userId } }
    );
    
    if (updateResult[0] === 0) {
      throw new Error(`No admin user found with baseuser_id ${userId}`);
    }
    
    // Clear temp tokens
    try {
      await UserSession.update(
        { temp_token: null },
        { where: { baseuser_id: userId } }
      );
    } catch (sessionError) {
      // Silent fail for non-critical operation
    }
    
  } catch (error: any) {
    console.error('Failed to update admin password:', error.message);
    throw new Error(`Repository error: ${error.message}`);
  }
};

export const findBaseUserById = async (id: number): Promise<BaseUser | null> => {
  try {
    return await BaseUser.findOne({ where: { id } });
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new Error('Database error while finding user');
  }
};

export const isTokenValid = async (
  userId: number,
  tempToken: string,
  maxMinutes: number = 30
): Promise<boolean> => {
  try {
    const session = await UserSession.findOne({ 
      where: { 
        baseuser_id: userId,
        temp_token: tempToken
      } 
    });
    
    if (!session) {
      return false;
    }
    
    const createdAt = session.created_at as Date;
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    return diffMinutes <= maxMinutes;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const createUserSession = async (
  userId: number,
  userType: string,
  token: string,
  ipAddress: string,
  userAgent: string,
  tempToken?: string
): Promise<UserSession> => {
  try {
    await UserSession.update(
      { is_active: false },
      { where: { baseuser_id: userId, is_active: true } }
    );

    const session = await UserSession.create({
      baseuser_id: userId,
      user_type: userType,
      token: token,
      temp_token: tempToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      is_active: true,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date(),
      last_activity: new Date()
    });

    return session;
  } catch (error) {
    console.error('Error creating user session:', error);
    throw new Error('Database error while creating session');
  }
};

export const invalidateUserSessions = async (userId: number): Promise<void> => {
  try {
    await UserSession.update(
      { is_active: false },
      { where: { baseuser_id: userId } }
    );
  } catch (error) {
    console.error('Error invalidating sessions:', error);
    throw new Error('Database error while invalidating sessions');
  }
};

export const updateSessionActivity = async (userId: number, token: string): Promise<void> => {
  try {
    await UserSession.update(
      { last_activity: new Date() },
      { where: { baseuser_id: userId, token: token, is_active: true } }
    );
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
};

export const findActiveSessionByToken = async (token: string): Promise<UserSession | null> => {
  try {
    return await UserSession.findOne({
      where: {
        token: token,
        is_active: true,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error finding active session:', error);
    return null;
  }
};

export const cleanupExpiredSessions = async (): Promise<void> => {
  try {
    const result = await UserSession.update(
      { is_active: false },
      { 
        where: { 
          expires_at: {
            [Op.lt]: new Date()
          },
          is_active: true
        } 
      }
    );
    console.log(`Cleaned up ${result[0]} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
};

export const getUserActiveSessions = async (userId: number): Promise<UserSession[]> => {
  try {
    return await UserSession.findAll({
      where: {
        baseuser_id: userId,
        is_active: true,
        expires_at: {
          [Op.gt]: new Date()
        }
      },
      order: [['last_activity', 'DESC']]
    });
  } catch (error) {
    console.error('Error getting user active sessions:', error);
    return [];
  }
};

export const revokeSessionByToken = async (token: string): Promise<boolean> => {
  try {
    const result = await UserSession.update(
      { is_active: false },
      { where: { token: token, is_active: true } }
    );
    return result[0] > 0;
  } catch (error) {
    console.error('Error revoking session:', error);
    return false;
  }
};