export interface ReservedParking {
  id: number;
  baseuser_id: number;
  parking_number: number;
  day_of_week: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export const mockReservedParking: Partial<ReservedParking>[] = [
  {
    id: 1,
    baseuser_id: 1,
    parking_number: 101,
    day_of_week: 'Monday',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    baseuser_id: 2,
    parking_number: 102,
    day_of_week: 'Tuesday',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
