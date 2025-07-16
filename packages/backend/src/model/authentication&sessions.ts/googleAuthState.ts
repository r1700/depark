import Joi from 'joi';

export interface GoogleAuthState {
  id: string;
  state: string;
  userId?: string; // set after successful auth
  email: string;
  firstName: string;
  lastName: string;
  status: 'pending' | 'approved' | 'declined';
  expiresAt: Date;
  createdAt: Date;
}

export const GoogleAuthStateSchema = Joi.object({
  id: Joi.string().required(),
  state: Joi.string().required(),
  userId: Joi.string().optional(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  status: Joi.string().valid('pending', 'approved', 'declined').required(),
  expiresAt: Joi.date().required(),
  createdAt: Joi.date().required(),
});

// דוגמת שימוש עם הוולידציה

const googleAuthStateData = {
  id: "auth123",
  state: "someState",
  userId: "user456",
  email: "user@example.com",
  firstName: "First",
  lastName: "Last",
  status: "pending",
  expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
  createdAt: new Date(),
};

const { error, value } = GoogleAuthStateSchema.validate(googleAuthStateData);

if (error) {
  console.error("שגיאה בוולידציה:", error);
} else {
  console.log("הנתונים תקינים:", value);
}
