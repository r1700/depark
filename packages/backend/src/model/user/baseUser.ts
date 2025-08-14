import Joi from 'joi';

// Creating a BaseUser class
export class BaseUser {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    idNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
  });

  constructor(
    public idNumber: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public createdAt: Date,
    public updatedAt: Date,
    public id?: number // identty
  ) { }

  // Function to create a BaseUser object
  static create(data: any): BaseUser {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new BaseUser( value.idNumber, value.email, value.firstName, value.lastName, value.createdAt, value.updatedAt,value.id);
  }
}