import Joi from 'joi';

export interface UserSession {
  id: string;
  userId: string;
  userType: 'user' | 'admin';
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  isActive: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
}

export const UserSessionSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
  userType: Joi.string().valid('user', 'admin').required(),
  token: Joi.string().required(),
  refreshToken: Joi.string().optional(),
  expiresAt: Joi.date().required(),
  isActive: Joi.boolean().required(),
  ipAddress: Joi.string().ip().required(),
  userAgent: Joi.string().required(),
  createdAt: Joi.date().required(),
  lastActivity: Joi.date().required(),
});

// דוגמת שימוש עם הוולידציה

const userSessionData = {
  id: "session123",
  userId: "user456",
  userType: "user",
  token: "someToken",
  refreshToken: "someRefreshToken",
  expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
  isActive: true,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  createdAt: new Date(),
  lastActivity: new Date(),
};

const { error, value } = UserSessionSchema.validate(userSessionData);

if (error) {
  console.error("שגיאה בוולידציה:", error);
} else {
  console.log("הנתונים תקינים:", value);
}
