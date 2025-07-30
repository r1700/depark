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
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  dimensionsSource?: 'model_reference' | 'manual_override' | 'government_db';

}



export const vehicleData = {
  id: 1,
  userId: 123,
  licensePlate: "XYZ-1234",
  vehicleModelId: 456,
  color: "Red",
  isActive: true,
  isCurrentlyParked: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  addedBy: "user",
  dimensionOverrides: {
    height: 1.5,
    width: 1.8,
    length: 4.5,
    weight: 1500
  },
  dimensionsSource: "manual_override"
};


