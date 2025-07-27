import { User } from "./User";

export interface Vehicle {
  id: string;
  user: User; // Assuming User is defined in your types
  userId: string;
  licensePlate: string;
  vehicleModelId?: string; // reference to VehicleModel, optional
  color?: string;
  isActive: boolean;
  isCurrentlyParked: boolean;
  createdAt: Date;
  updatedAt: Date;
  addedBy: 'user' | 'hr';

}