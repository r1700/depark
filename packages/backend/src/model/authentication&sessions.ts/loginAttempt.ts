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

export class LoginAttemptModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().email().required(),
    userType: Joi.string().valid('user', 'admin').required(),
    success: Joi.boolean().required(),
    ipAddress: Joi.string().required(),
    userAgent: Joi.string().required(),
    failureReason: Joi.string().optional(),
    timestamp: Joi.date().required()
  });

  constructor(
    public id: string,
    public email: string,
    public userType: 'user' | 'admin',
    public success: boolean,
    public ipAddress: string,
    public userAgent: string,
    public timestamp: Date,
    public failureReason?: string
  ) {}

  static create(data: any): Promise<LoginAttemptModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new LoginAttemptModel(
      value.id,
      value.email,
      value.userType,
      value.success,
      value.ipAddress,
      value.userAgent,
      new Date(value.timestamp),
      value.failureReason
    ));
  }
}

// Example usage of LoginAttemptModel

const loginAttemptData = {
  id: "attempt123",
  email: "user@example.com",
  userType: "user",
  success: false,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  failureReason: "Incorrect password",
  timestamp: new Date()
};

LoginAttemptModel.create(loginAttemptData)
  .then(loginAttempt => {
    console.log("Login Attempt created successfully:", loginAttempt);
  })
  .catch(error => {
    console.error("Error creating login attempt:", error);
  });
