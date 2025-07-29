export interface BaseUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: number;
  passwordHash: string;
  role: 'hr' | 'admin';
  permissions: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number; 
}

export interface UserSession {
  id: number;
  userId: number;
  userType: 'user' | 'admin';
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  isActive: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  temporaryToken?: string;
}