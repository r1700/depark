import Joi from 'joi';
import { BaseUser } from './baseUser';  // מייבא את BaseUser

export class AdminUser extends BaseUser {
  static schema = Joi.object({
    id: BaseUser.schema.extract('id'),
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
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    passwordHash: string,
    role: 'hr' | 'admin',
    permissions: string[],
    lastLoginAt?: Date
  ) {
    super(id, email, firstName, lastName, createdAt, updatedAt); // קריאה ל-BaseUser constructor
    this.passwordHash = passwordHash;
    this.role = role;
    this.permissions = permissions;
    this.lastLoginAt = lastLoginAt;
  }

  // פונקציה ליצירת אובייקט AdminUser
  static create(data: any): AdminUser {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new AdminUser(
      value.id,
      value.email,
      value.firstName,
      value.lastName,
      value.createdAt,
      value.updatedAt,
      value.passwordHash,
      value.role,
      value.permissions,
      value.lastLoginAt
    );
  }
}

// דוגמת יצירה של אובייקט AdminUser
const adminUser = AdminUser.create({
    id: '456',
    email: 'admin@example.com',
    firstName: 'Alice',
    lastName: 'Smith',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
    passwordHash: 'hashed_password_123',
    role: 'admin',
    permissions: ['manage_users', 'edit_data'],
    lastLoginAt: new Date('2023-07-10')
  });
  
console.log(adminUser);