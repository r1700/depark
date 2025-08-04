import bcrypt from 'bcrypt';
import db from '../db';
import { AdminUser, UserSession, BaseUser } from '../models/admin';

export const findBaseUserByEmail = async (email: string): Promise<BaseUser | null> => {
  const result = await db.query(
    `SELECT * FROM "BaseUser" WHERE email = $1 LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
};

export const findUserWithAdminRole = async (userId: number): Promise<{ isAdminOrHr: boolean, user: any } | null> => {
  const result = await db.query(
    `SELECT bu.*, au.role
     FROM "BaseUser" bu
     LEFT JOIN "AdminUsers" au ON bu.id = au."userId"
     WHERE bu.id = $1`,
    [userId]
  );
  const user = result.rows[0];
  if (!user) return null;
  const isAdminOrHr = user.role === 'admin' || user.role === 'hr';
  return { isAdminOrHr, user };
};

export const updateTemporaryTokenInSession = async (
  userId: number,
  temporaryToken: string
): Promise<void> => {
  await db.query(
    `UPDATE "UserSessions" SET "temporaryToken" = $1, "createdAt" = $2 WHERE "userId" = $3`,
    [temporaryToken, new Date(), userId]
  );
};

export const updatePasswordForUser = async (
  userId: number,
  newPassword: string
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query(
    `UPDATE "AdminUsers" SET "passwordHash" = $1 WHERE "userId" = $2`,
    [hashedPassword, userId]
  );
};

export const findUserSessionByUserId = async (userId: number): Promise<UserSession | null> => {
  const result = await db.query(
    `SELECT * FROM "UserSessions" WHERE "userId" = $1 LIMIT 1`,
    [userId]
  );
  const row = result.rows[0];
  if (!row) return null;
  
  return {
    id: row.id,
    userId: row.userId,
    userType: row.userType,
    token: row.token,
    refreshToken: row.refreshToken,
    expiresAt: row.expiresAt,
    isActive: row.isActive,
    ipAddress: row.ipAddress,
    userAgent: row.userAgent,
    createdAt: row.createdAt,
    lastActivity: row.lastActivity,
    temporaryToken: row.temporaryToken,
  };
};