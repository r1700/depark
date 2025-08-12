import Joi from 'joi';
import { BaseUser } from './baseUser';  // Imports BaseUser

export class AdminUser extends BaseUser {
  static schema = Joi.object({
    id: BaseUser.schema.extract('id'),
    idNumber: BaseUser.schema.extract('idNumber'),
    email: BaseUser.schema.extract('email'),
    firstName: BaseUser.schema.extract('firstName'),
    lastName: BaseUser.schema.extract('lastName'),
    createdAt: BaseUser.schema.extract('createdAt'),
    updatedAt: BaseUser.schema.extract('updatedAt'),
    passwordHash: Joi.string().required(),
    role: Joi.string().valid('hr', 'admin').required(),
    permissions: Joi.array().items(Joi.string()).required(),
    lastLoginAt: Joi.date().optional(),
  });

  passwordHash: string;
  role: 'hr' | 'admin';
  permissions: string[];
  lastLoginAt?: Date;

  constructor(
    idNumber: string,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    passwordHash: string,
    role: 'hr' | 'admin',
    permissions: string[],
    lastLoginAt?: Date,
    public id?: number // identty
  ) {
    super(idNumber, email, firstName, lastName, createdAt, updatedAt, id); // קריאה ל-BaseUser constructor
    this.passwordHash = passwordHash;
    this.role = role;
    this.permissions = permissions;
    this.lastLoginAt = lastLoginAt;
  }

  // Function to create an AdminUser object
  static create(data: any): AdminUser {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new AdminUser(
      value.idNumber,
      value.email,
      value.firstName,
      value.lastName,
      value.createdAt,
      value.updatedAt,
      value.passwordHash,
      value.role,
      value.permissions,
      value.lastLoginAt,
      value.id
    );
  }
}

