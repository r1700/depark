export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: Date| null;
  updatedAt?: Date | null;
}

export interface User extends BaseUser {
  department?: string;
  employeeId?: string;
  googleId?: string;
  status: 'pending' | 'approved' | 'declined' | 'suspended';
  maxCarsAllowedParking?: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
}

