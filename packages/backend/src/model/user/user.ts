import Joi from 'joi';
import { BaseUser } from './baseUser';  //Imports BaseUser

export class User extends BaseUser {
  static schema = Joi.object({
    id: BaseUser.schema.extract('id'),
    idNumber: BaseUser.schema.extract('idNumber'),
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
    idNumber:string,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    status: 'pending' | 'approved' | 'declined' | 'suspended',
    createdBy: string,
    id?: number ,// identty,
    department?: string,
    employeeId?: string,
    googleId?: string,
    maxCarsAllowedParking?: number,
    approvedBy?: string,
    approvedAt?: Date
  ) {
    super(idNumber, email, firstName, lastName, createdAt, updatedAt, id);  // קריאה ל-BaseUser constructor
    this.status = status;
    this.createdBy = createdBy;
    this.department = department;
    this.employeeId = employeeId;
    this.googleId = googleId;
    this.maxCarsAllowedParking = maxCarsAllowedParking;
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
  }

  // Function to create a User object
  static create(data: any): User {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new User(
      value.idNumber,
      value.email,
      value.firstName,
      value.lastName,
      value.createdAt,      
      value.updatedAt,
      value.status,
      value.createdBy,
      value.id,
      value.department,
      value.employeeId,
      value.googleId,
      value.maxCarsAllowedParking,
      value.approvedBy,
      value.approvedAt
    );
  }
}

