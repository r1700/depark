import Joi from 'joi';
import { BaseUser } from './baseUser';  // מייבא את BaseUser

export class User extends BaseUser {
  static schema = Joi.object({
    // ...BaseUser.schema.describe().keys,  // מגריל את כל המאפיינים מ-BaseUser
    id: BaseUser.schema.extract('id'),
    email: BaseUser.schema.extract('email'),
    firstName: BaseUser.schema.extract('firstName'),
    lastName: BaseUser.schema.extract('lastName'),
    createdAt: BaseUser.schema.extract('createdAt'),
    updatedAt: BaseUser.schema.extract('updatedAt'),
    department: Joi.string().optional(),
    employeeId: Joi.string().optional(),
    googleId: Joi.string().optional(),
    status: Joi.string().valid('pending', 'approved', 'declined', 'suspended').required(),
    maxCarsAllowedParking: Joi.number().optional(),
    createdBy: Joi.string().required(),  // Admin user ID
    approvedBy: Joi.string().optional(),
    approvedAt: Joi.date().optional(),
  });

  department?: string;
  employeeId?: string;
  googleId?: string;
  status: 'pending' | 'approved' | 'declined' | 'suspended';
  maxCarsAllowedParking?: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    status: 'pending' | 'approved' | 'declined' | 'suspended',
    createdBy: string,
    department?: string,
    employeeId?: string,
    googleId?: string,
    maxCarsAllowedParking?: number,
    approvedBy?: string,
    approvedAt?: Date
  ) {
    super(id, email, firstName, lastName, createdAt, updatedAt);  // קריאה ל-BaseUser constructor
    this.status = status;
    this.createdBy = createdBy;
    this.department = department;
    this.employeeId = employeeId;
    this.googleId = googleId;
    this.maxCarsAllowedParking = maxCarsAllowedParking;
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
  }

  // פונקציה ליצירת אובייקט User
  static create(data: any): User {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new User(
      value.id,
      value.email,
      value.firstName,
      value.lastName,
      value.createdAt,
      value.updatedAt,
      value.status,
      value.createdBy,
      value.department,
      value.employeeId,
      value.googleId,
      value.maxCarsAllowedParking,
      value.approvedBy,
      value.approvedAt
    );
  }
}

// דוגמת יצירה של אובייקט User
const user = User.create({
  id: '123',
  email: 'example@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date(),
  status: 'approved',
  createdBy: 'admin123',
  department: 'IT',
  employeeId: 'emp123',
  googleId: 'google123',
  maxCarsAllowedParking: 5,
  approvedBy: 'admin456',
  approvedAt: new Date()
});

console.log(user);