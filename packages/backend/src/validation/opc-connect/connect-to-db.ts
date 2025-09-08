
import { Model } from "sequelize"
import  {parkingconfigurations,vehicles,baseuser, User, ParkingSession,reservedparking,vehiclemodels} from '../../model/dataBaseModels/model'; 

async function createFullUser(
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  department?: string,
  employee_id?: string,
  google_id?: string,
  status?: number,
  max_cars_allowed_parking?: number,
  created_by?: string,
  approved_by?: string,
  approved_at?: Date,
  phone?: string
) {
  // 1. שמור baseuser
  const baseUser = await baseuser.create({
    // id: id,
    email: email,
    first_name: first_name,
    last_name: last_name,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // 2. שמור User עם קישור ל-baseuser
  const user = await User.create({
    // שדה הקישור - תלוי במודל שלך, לרוב baseuser_id או id
    baseuser_id: baseUser.id, // אם id של User הוא אותו id של baseuser
    department: department,
    employee_id: employee_id,
    google_id: google_id,
    status: status,
    max_cars_allowed_parking: max_cars_allowed_parking,
    created_by: created_by,
    approved_by: approved_by,
    approved_at: approved_at,
    phone: phone
  });

  return { baseuser, user };
}




async function addVehicleData(
  baseuser_id: number,
  license_plate: string,
  vehicle_model_id: number | null,
  color: string | null,
  is_active: boolean,
  is_currently_parked: boolean,
  added_by: number | null,
  dimension_overrides: object | null,
  dimensions_source: number | null
) {
  try {
    const newVehicle = await vehicles.create({
      baseuser_id,
      license_plate,
      vehicle_model_id,
      color,
      is_active,
      is_currently_parked,
      created_at: new Date(),
      updated_at: new Date(),
      added_by,
      dimension_overrides,
      dimensions_source,
    });
    return newVehicle;
  } catch (error) {
    console.error('Error while adding vehicle:', error);
    throw error;
  }
}


// הוספת ParkingSession
async function addParkingSessionData(
  id: string,
  userId: string,
  vehicleId: string,
  licensePlate: string,
  surfaceSpot?: string,
  undergroundSpot?: string,
  status?: 'parked' | 'retrieval_requested' | 'completed',
  entryTime?: Date,
  exitTime?: Date,
  retrievalRequestTime?: Date,
  actualRetrievalTime?: Date,
  pickupSpot?: string,
  requestedBy?: 'mobile' | 'tablet'
) {
  try {
    const newSession = await ParkingSession.create({
      id,
      userId,
      vehicleId,
      licensePlate,
      surfaceSpot,
      undergroundSpot,
      status: status || 'parked',
      entryTime: entryTime || new Date(),
      exitTime,
      retrievalRequestTime,
      actualRetrievalTime,
      pickupSpot,
      requestedBy,
    });
    return newSession;
  } catch (error) {
    console.error('Error while adding ParkingSession:', error);
    throw error;
  }
}

// הוספת ParkingConfiguration
async function addParkingConfigurationData(
  params: {
  facility_name: string;
  total_surface_spots: number;
  surface_spot_ids?: number[] | null;
  avg_retrieval_time_minutes?: number | null;
  max_queue_size?: number | null;
  operating_hours?: object | null;
  timezone?: string | null;
  updated_by?: string | null;
}
) {
  try {
    const newConfig = await parkingconfigurations.create({
      facility_name: params.facility_name,
      total_surface_spots: params.total_surface_spots,
      surface_spot_ids: params.surface_spot_ids,
      avg_retrieval_time_minutes: params.avg_retrieval_time_minutes,
      max_queue_size: params.max_queue_size,
      operating_hours: params.operating_hours,
      timezone: params.timezone,
      updated_by: params.updated_by
    });
    return newConfig;
  } catch (error) {
    console.error('Error while adding ParkingConfiguration:', error);
    throw error;
  }
}

// פונקציה לחיפוש רכב לפי ID


// ייצוא כל הפונקציות

 async function findVehicleById(vehicleId: number) {
  try {
    const vehicle = await vehicles.findOne({ where: { id: vehicleId } });
    return vehicle;
  } catch (error) {
    console.error('Error while finding vehicle by ID:', error);
    throw error;
  }
}

 async function createReservedParking(
  baseuser_id: number,
  parking_number: number,
  day_of_week: string
) {
  const reserved = await reservedparking.create({
    baseuser_id,
    parking_number,
    day_of_week,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return reserved;
}

  async function addVehicleModelData(
  make: string,
  model: string,
  year_range: object | null,
  dimensions: object | null,
  source: number | null
) {
  try {
    const newVehicleModel = await vehiclemodels.create({
      make,
      model,
      year_range,
      dimensions,
      source,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return newVehicleModel;
  } catch (error) {
    console.error('Error while adding vehicle model:', error);
    throw error;
  }
}









export { 
  createFullUser,
  addVehicleData, 
  addParkingSessionData, 
  addParkingConfigurationData,
  findVehicleById,
  createReservedParking,
  addVehicleModelData
};
