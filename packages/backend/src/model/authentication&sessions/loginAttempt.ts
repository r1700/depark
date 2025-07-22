import Joi from 'joi';

export class LoginAttemptModel {
  static schema = Joi.object({
    id: Joi.number().integer().positive().allow(null).optional(),
    email: Joi.string().email().required(),
    userType: Joi.string().valid('user', 'admin').required(),
    success: Joi.boolean().required(),
    ipAddress: Joi.string().ip().required(),
    userAgent: Joi.string().required(),
    failureReason: Joi.string().optional(),
    timestamp: Joi.date().required(),
  });

  constructor(
    
    public email: string,
    public userType: 'user' | 'admin',
    public success: boolean,
    public ipAddress: string,
    public userAgent: string,
    public timestamp: Date,
    public failureReason?: string,
    public id?: number
  ) {}

  static create(data: any): Promise<LoginAttemptModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new LoginAttemptModel(
     
      value.email,
      value.userType,
      value.success,
      value.ipAddress,
      value.userAgent,
      new Date(value.timestamp),
      value.failureReason, 
      value.id
    ));
  }
}

// Example usage of the LoginAttemptModel

const loginAttemptData = {
  id: 123,
  email: "user@example.com",
  userType: "user",
  success: false,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  failureReason: "Invalid password",
  timestamp: new Date().toISOString(),
};

LoginAttemptModel.create(loginAttemptData)
  .then(loginAttempt => {
    console.log("Login Attempt created successfully:", loginAttempt);
  })
  .catch(error => {
    console.error("Error creating Login Attempt:", error);
  });
