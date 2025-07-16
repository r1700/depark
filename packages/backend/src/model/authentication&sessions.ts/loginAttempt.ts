import Joi from 'joi';

export interface LoginAttempt {
  id: string;
  email: string;
  userType: 'user' | 'admin';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  failureReason?: string;
  timestamp: Date;
}

export const LoginAttemptSchema = Joi.object({
  id: Joi.string().required(),
  email: Joi.string().email().required(),
  userType: Joi.string().valid('user', 'admin').required(),
  success: Joi.boolean().required(),
  ipAddress: Joi.string().ip().required(),
  userAgent: Joi.string().required(),
  failureReason: Joi.string().optional(),
  timestamp: Joi.date().required(),
});

// דוגמת שימוש עם הוולידציה

const loginAttemptData = {
  id: "attempt123",
  email: "user@example.com",
  userType: "user",
  success: false,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  failureReason: "Invalid password",
  timestamp: new Date(),
};

const { error, value } = LoginAttemptSchema.validate(loginAttemptData);

if (error) {
  console.error("שגיאה בוולידציה:", error);
} else {
  console.log("הנתונים תקינים:", value);
}
