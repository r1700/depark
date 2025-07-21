import Joi from 'joi';

export class UserActivityModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    userId: Joi.string().optional(),
    userType: Joi.string().valid('hr', 'admin', 'employee', 'anonymous').required(),
    action: Joi.string().required(),
    details: Joi.object().required(),
    ipAddress: Joi.string().optional(),
    userAgent: Joi.string().optional(),
    timestamp: Joi.date().required(),
  });

  constructor(
    public id: string,
    public userType: 'hr' | 'admin' | 'employee' | 'anonymous', // Required parameter first
    public action: string,
    public details: Record<string, any>,
    public timestamp: Date,
    public userId?: string, // Optional parameter after required ones
    public ipAddress?: string,
    public userAgent?: string
  ) {}

  static create(data: any): Promise<UserActivityModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new UserActivityModel(
      value.id,
      value.userType,
      value.action,
      value.details,
      new Date(value.timestamp),
      value.userId,
      value.ipAddress,
      value.userAgent
    ));
  }
}

// Example usage of UserActivityModel

const userActivityData = {
  id: "activity123",
  userId: "user456",
  userType: "employee",
  action: "login",
  details: { success: true },
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  timestamp: new Date()
};

UserActivityModel.create(userActivityData)
  .then(userActivity => {
    console.log("User Activity created successfully:", userActivity);
  })
  .catch(error => {
    console.error("Error creating user activity:", error);
  });
