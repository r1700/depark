import Joi from 'joi';

// יצירת מחלקת BaseUser
export class BaseUser {
  static schema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
  });

  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  // פונקציה ליצירת אובייקט BaseUser
  static create(data: any): BaseUser {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new BaseUser(value.id, value.email, value.firstName, value.lastName, value.createdAt, value.updatedAt);
  }
}

const newBaseUser = BaseUser.create({
    id: 'user123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log(newBaseUser);