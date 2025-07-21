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

export class UserSessionModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    userId: Joi.string().required(),
    userType: Joi.string().valid('user', 'admin').required(),
    token: Joi.string().required(),
    refreshToken: Joi.string().optional(),
    expiresAt: Joi.date().required(),
    isActive: Joi.boolean().required(),
    ipAddress: Joi.string().required(),
    userAgent: Joi.string().required(),
    createdAt: Joi.date().required(),
    lastActivity: Joi.date().required()
  });

  constructor(
    public id: string,
    public userId: string,
    public userType: 'user' | 'admin',
    public token: string,
    public expiresAt: Date,
    public isActive: boolean,
    public ipAddress: string,
    public userAgent: string,
    public createdAt: Date,
    public lastActivity: Date,
    public refreshToken?: string // Move optional parameter to the end
  ) {}

  static create(data: any): Promise<UserSessionModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new UserSessionModel(
      value.id,
      value.userId,
      value.userType,
      value.token,
      new Date(value.expiresAt),
      value.isActive,
      value.ipAddress,
      value.userAgent,
      new Date(value.createdAt),
      new Date(value.lastActivity),
      value.refreshToken // Optional parameter
    ));
  }
}

// Example usage of UserSessionModel

const userSessionData = {
  id: "session123",
  userId: "user456",
  userType: "admin",
  token: "abc123token",
  refreshToken: "xyz456refresh",
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  isActive: true,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  createdAt: new Date(),
  lastActivity: new Date()
};

UserSessionModel.create(userSessionData)
  .then(userSession => {
    console.log("User Session created successfully:", userSession);
  })
  .catch(error => {
    console.error("Error creating user session:", error);
  });
