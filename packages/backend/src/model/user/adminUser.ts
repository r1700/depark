import Joi from 'joi';
import { baseuser } from './baseUser';  // Imports baseuser

export class AdminUser extends baseuser {
  static schema = Joi.object({
    id: baseuser.schema.extract('id'),
    idNumber: baseuser.schema.extract('idNumber'),
    email: baseuser.schema.extract('email'),
    firstName: baseuser.schema.extract('firstName'),
    lastName: baseuser.schema.extract('lastName'),
    createdAt: baseuser.schema.extract('createdAt'),
    updatedAt: baseuser.schema.extract('updatedAt'),
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
    super(idNumber, email, firstName, lastName, createdAt, updatedAt, id); // קריאה ל-baseuser constructor
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

