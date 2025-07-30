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

export const mockUsers: Partial<User>[] = [

    {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    employeeId: '123',
    status: 'approved',
    maxCarsAllowedParking: 2,
    createdBy: 'admin',
    createdAt: new Date(),

  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    employeeId: '124',
    status: 'pending',
    maxCarsAllowedParking: 1,
    createdBy: 'admin',
    createdAt: new Date(),
  },
]

