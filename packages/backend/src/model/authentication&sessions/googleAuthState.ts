import Joi from 'joi';

export class GoogleAuthStateModel {
  static schema = Joi.object({
    id: Joi.number().integer().positive().allow(null).optional(),
    state: Joi.string().required(),
    userId: Joi.number().optional(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    status: Joi.string().valid('pending', 'approved', 'declined').required(),
    expiresAt: Joi.date().required(),
    createdAt: Joi.date().required(),
  });

  constructor(
    
    public state: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public status: 'pending' | 'approved' | 'declined',
    public expiresAt: Date,
    public createdAt: Date,
    public userId?: number, 
    public id?: number
  ) {}

  static create(data: any): Promise<GoogleAuthStateModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new GoogleAuthStateModel(
      
      value.state,
      value.email,
      value.firstName,
      value.lastName,
      value.status,
      new Date(value.expiresAt),
      new Date(value.createdAt),
      value.userId, // Optional parameter
      value.id
    ));
  }
}
