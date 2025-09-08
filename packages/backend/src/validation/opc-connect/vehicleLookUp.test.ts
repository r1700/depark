




import { Model, DataTypes, QueryTypes } from "sequelize";
import sequelize from '../../config/sequelize';
import { canUserPark, isParkingReserved } from '../../services/vehicle-lookup/authorization';
import { isLicensePlateExists, vehicleModel } from '../../services/vehicle-lookup/licensePlate';
import isParkingLotActive from '../../services/vehicle-lookup/lotParking';

import isVehicleAllowed from '../../services/vehicle-lookup/vehicleLookup';

import { findVehicleById, addVehicleData, createFullUser, addParkingSessionData, addParkingConfigurationData, createReservedParking, addVehicleModelData } from './connect-to-db';

describe('vehiclesService Tests', () => {

  beforeAll(async () => {
    console.log('🔧 Global setup - בדיקת חיבור ל-DB');
    try {
      await sequelize.authenticate();
      console.log('✅ Connected to test database');

      // ✅ נקה נתונים קיימים לפני הטסטים
      await sequelize.query('DELETE FROM vehicles WHERE license_plate IN ($1, $2)', {
        bind: ['ZXC123', 'XYZ789'],
        type: QueryTypes.DELETE
      });

      // ✅ תיקון: השתמש בטבלה הנכונה
      await sequelize.query('DELETE FROM users WHERE baseuser_id IN ($1, $2)', {
        bind: [123, 456],
        type: QueryTypes.DELETE
      });

      console.log('✅ Cleaned existing test data');
    } catch (error) {
      console.error('❌ Failed to connect to test database:', error);
    }
  });

  describe('האם הלוחית רישוי קיים', () => {
    let testVehicles: any[] = [];

    beforeEach(async () => {
      console.log('🚀 Setting up test data for: האם הלוחית רישוי קיים');
      try {
        // ✅ נקה לוחיות רישוי לפני יצירה
        await sequelize.query('DELETE FROM vehicles WHERE license_plate IN ($1, $2)', {
          bind: ['ZXC123', 'XYZ789'],
          type: QueryTypes.DELETE
        });

        const vehicle1Results = await sequelize.query(`
          INSERT INTO vehicles(
            baseuser_id,
            license_plate, 
            vehicle_model_id, 
            color, 
            created_at,
            is_active,
            is_currently_parked,
            updated_at,
            added_by,
            dimensions_source
          ) 
          VALUES ($1, $2, $3, $4, NOW(), $5, $6, NOW(), $7, $8) 
          RETURNING *
        `, {
          bind: [1, 'ZXC123', 1, 'Blue', true, true, 1, '1'],
          type: QueryTypes.SELECT
        }) as any[];

        const vehicle2Results = await sequelize.query(`
          INSERT INTO vehicles(
            baseuser_id,
            license_plate, 
            vehicle_model_id, 
            color, 
            created_at,
            is_active,
            is_currently_parked,
            updated_at,
            added_by,
            dimensions_source
          ) 
          VALUES ($1, $2, $3, $4, NOW(), $5, $6, NOW(), $7, $8) 
          RETURNING *
        `, {
          bind: [2, 'XYZ789', 2, 'Red', true, true, 2, '2'],
          type: QueryTypes.SELECT
        }) as any[];

        testVehicles = [];
        if (vehicle1Results && vehicle1Results[0] && Array.isArray(vehicle1Results[0])) {
          testVehicles.push(vehicle1Results[0][0]);
        }
        if (vehicle2Results && vehicle2Results[0] && Array.isArray(vehicle2Results[0])) {
          testVehicles.push(vehicle2Results[0][0]);
        }

        console.log('✅ Test vehicles created:', testVehicles.length);
      } catch (error) {
        console.error('❌ Failed to create test vehicles:', error);
      }
    });

    afterEach(async () => {
      console.log('🧹 Cleaning up test data for');
      try {
        for (const vehicle of testVehicles) {
          if (vehicle && vehicle.license_plate) {
            await sequelize.query('DELETE FROM vehicles WHERE license_plate = $1', {
              bind: [vehicle.license_plate],
              type: QueryTypes.DELETE
            });
          }
        }
        testVehicles = [];
        console.log('✅ Test vehicles deleted');
      } catch (error) {
        console.error('❌ Failed to delete test vehicles:', error);
      }
    });

    test('לוחית רישוי לא קיים', async () => {
      const exists = await isLicensePlateExists('GTD234');
      expect(exists.found).toBe(false);
    });

    test('לוחית רישוי קיים', async () => {
      const exists = await isLicensePlateExists('ZXC123');
      expect(exists.found).toBe(true);
    });
  });

  describe('האם המשתמש יכול להכניס עוד רכב', () => {
    console.log('🚀 Testing if user can add another vehicle');
    test('אין מקום לעוד רכבים', async () => {
      let userCreated: any = null;
      let sessionCreated: any = null;

      try {
        // ✅ נקה משתמש קיים לפני יצירה
        await sequelize.query('DELETE FROM users WHERE baseuser_id = $1', {
          bind: [123],
          type: QueryTypes.DELETE
        });

        // ✅ תיקון: השתמש בטבלה הנכונה וצור המשתמש עם addUserData
        const newUser = await createFullUser(
          12345,
          "john@example.com",     // email
          "John",                 // firstName
          "Doe",                  // lastName
          "Engineering",          // department
          "EMP001",              // employeeId
          undefined,             // googleId
          1,                     // status
          0,                     // maxCarsAllowedParking
          "admin",               // createdBy
          "manager",             // approvedBy
          new Date(),            // approvedAt
          "123-456-7890"         // phone
        );


        userCreated = newUser;
        console.log('✅ User created:', userCreated);




        const userPark = await canUserPark(Number(userCreated.user.dataValues.baseuser_id));
        expect(userPark).toBe(false);

      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      } finally {

        try {
          if (sessionCreated && sessionCreated.id) {
            await sequelize.query('DELETE FROM parkingsessions WHERE id = $1', {
              bind: [sessionCreated.id],
              type: QueryTypes.DELETE
            });
          }
          if (userCreated && userCreated.id) {
            await sequelize.query('DELETE FROM users WHERE id = $1', {
              bind: [userCreated.id],
              type: QueryTypes.DELETE
            });
          }
        } catch (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
      }
    });

    test('יש מקום לעוד רכב', async () => {
      let userCreated: any = null;

      try {
        // ✅ נקה משתמש קיים לפני יצירה
        await sequelize.query('DELETE FROM users WHERE baseuser_id = $1', {
          bind: [456],
          type: QueryTypes.DELETE
        });

        // ✅ תיקון: השתמש ב-createFullUser
        const newUser2 = await createFullUser(
          12346,
          "sarah.wilson@company.com",   // email
          "Sarah",                      // firstName
          "Wilson",                     // lastName
          "Marketing",                  // department
          "EMP002",                     // employeeId
          "google_12345678",            // googleId
          2,                  // status
          1,                           // maxCarsAllowedParking
          "hr_manager",                // createdBy
          "department_head",           // approvedBy
          new Date("2025-01-15"),      // approvedAt
          "555-987-6543"               // phone
        );

        userCreated = newUser2;
        console.log('✅ User created:', userCreated);

        // ✅ בדיקת הפונקציה
        const userPark = await canUserPark(Number(userCreated.user.dataValues.baseuser_id));
        expect(userPark).toBe(true);

      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      } finally {
        // ✅ ניקוי מובטח
        try {
          if (userCreated && userCreated.id) {
            await sequelize.query('DELETE FROM users WHERE id = $1', {
              bind: [userCreated.id],
              type: QueryTypes.DELETE
            });
          }
        } catch (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
      }
    });
  });
  describe('האם החניון פעיל', () => {
    let newParkingConfig1: any;
    let newParkingConfig2: any;

    beforeAll(async () => {
      newParkingConfig1 = await addParkingConfigurationData({
        facility_name: "חניון מרכזי",
        total_surface_spots: 100,
        surface_spot_ids: [1, 2, 3],
        avg_retrieval_time_minutes: 15,
        max_queue_size: 10,
        operating_hours: {
          monday: { isActive: true, openingHour: "07:00", closingHour: "09:00" },
          tuesday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          wednesday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          thursday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          friday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          saturday: { isActive: true, openingHour: "09:00", closingHour: "18:00" },
          sunday: { isActive: true, openingHour: "09:00", closingHour: "18:00" },
        },
        timezone: "Asia/Jerusalem",
        updated_by: "admin"
      });
      newParkingConfig2 = await addParkingConfigurationData({
        facility_name: "חניון צפון",
        total_surface_spots: 50,
        surface_spot_ids: [4, 5, 6],
        avg_retrieval_time_minutes: 10,
        max_queue_size: 5,
        operating_hours: {
          monday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          tuesday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          wednesday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          thursday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          friday: { isActive: true, openingHour: "07:00", closingHour: "18:00" },
          saturday: { isActive: true, openingHour: "09:00", closingHour: "18:00" },
          sunday: { isActive: true, openingHour: "09:00", closingHour: "18:00" },
        },
        timezone: "Asia/Jerusalem",
        updated_by: "tester"
      });
    });
    test('החניון לא פעיל', async () => {
      const now = new Date();
      const isParkingActive = await isParkingLotActive(now, newParkingConfig1.id);
      console.log('Is parking active!!!!!!!!!11111111:', isParkingActive.message);
      console.log('Current time:', now);
      console.log('Parking configuration ID:', newParkingConfig1.id);

      expect(isParkingActive.active).toBe(false);
    });
    test('החניון פעיל', async () => {
      const now = new Date();
      const isParkingActive = await isParkingLotActive(now, newParkingConfig2.id);
      console.log('Is parking active!!!!!!!!!2:', isParkingActive.message);
      console.log('Current time:', now);
      console.log('Parking configuration ID:', newParkingConfig2.id);

      expect(isParkingActive.active).toBe(true);
    });

    afterAll(async () => {
      // מחיקת הקונפיגורציה שנוצרה
      if (newParkingConfig1 && newParkingConfig1.id) {
        await sequelize.query('DELETE FROM parkingconfigurations WHERE id = $1', {
          bind: [newParkingConfig1.id],
          type: QueryTypes.DELETE
        });
      }
      if (newParkingConfig2 && newParkingConfig2.id) {
        await sequelize.query('DELETE FROM parkingconfigurations WHERE id = $1', {
          bind: [newParkingConfig2.id],
          type: QueryTypes.DELETE
        });
      }
    });
  });



  describe('isParkingReserved', () => {
    let vehicle1Results1: any;
    let reservedParkingResults: any;
    let vehicle1Results2: any;

    beforeAll(async () => {
      // הכנסת רכב ראשון


      const newVehicle = await addVehicleData(
        5,                        // baseuser_id
        `yuru46_${Date.now()}`,                 // license_plate
        10,                       // vehicle_model_id
        "Black",                  // color
        true,                     // is_active
        false,                    // is_currently_parked
        1,                  // added_by
        { length: 4.5, width: 1.8, height: 1.4 }, // dimension_overrides
        1                  // dimensions_source
      );

      console.log("Vehicle created:", newVehicle);

      const reserved = await createReservedParking(5, 101, 'Monday');
      console.log('Reserved parking created:', reserved);
      // הכנסת רכב שני (למשתמש אחר)
      const newVehicle2 = await addVehicleData(
        6,                        // baseuser_id
        `yuru46_${Date.now()}`,                 // license_plate
        11,                       // vehicle_model_id
        "Red",                    // color
        true,                     // is_active
        false,                    // is_currently_parked
        1,                  // added_by
        { length: 4.5, width: 1.8, height: 1.4 }, // dimension_overrides
        1                  // dimensions_source
      );

      console.log("Vehicle created:", newVehicle2);
    });

    test('reserved parking', async () => {
      const isReserved = await isParkingReserved(5);
      expect(isReserved).toBe(!0); // מצפה לערך "אמת" (כל ערך שאינו 0)
    });

    test('not reserved parking', async () => {
      const isReserved = await isParkingReserved(6);
      expect(isReserved).toBe(false); // מצפה לערך 0 (אין חניה שמורה)
    });

    afterAll(async () => {
      // מחיקת חניה שמורה
      if (reservedParkingResults && reservedParkingResults.id) {
        await sequelize.query('DELETE FROM reservedparking WHERE id = $1', {
          bind: [reservedParkingResults.id],
          type: QueryTypes.DELETE
        });
      }
      // מחיקת רכבים
      if (vehicle1Results1 && vehicle1Results1.id) {
        await sequelize.query('DELETE FROM vehicles WHERE id = $1', {
          bind: [vehicle1Results1.id],
          type: QueryTypes.DELETE
        });
      }
      if (vehicle1Results2 && vehicle1Results2.id) {
        await sequelize.query('DELETE FROM vehicles WHERE id = $1', {
          bind: [vehicle1Results2.id],
          type: QueryTypes.DELETE
        });
      }
    });
  });
  describe('isModelFound', () => {
    let newVehicleModelId: number;
    let newVehicle: any;
    beforeAll(async () => {
      // הוספת מודל רכב חדש
      const exampleModel = await addVehicleModelData(
        'Toyota',
        'Corolla',
        { from: 2015, to: 2022 },
        { length: 4.6, width: 1.8, height: 1.4 },
        1
      );
      console.log('Vehicle model added:', exampleModel);
      if (!exampleModel || !exampleModel.id) {
        throw new Error('Vehicle model creation failed or no result returned');
      }
      newVehicleModelId = exampleModel.id;

      // הוספת רכב חדש עם id=3
      newVehicle = await addVehicleData(
        8,                        // baseuser_id
        `yuru46_${Date.now()}`,                 // license_plate
        newVehicleModelId,                       // vehicle_model_id
        "Black",                  // color
        true,                     // is_active
        false,                    // is_currently_parked
        1,                  // added_by
        { length: 4.5, width: 1.8, height: 1.4 }, // dimension_overrides
        1                  // dimensions_source
      );

    });
    test('model found', async () => {
      console.log('newVehicle:', newVehicle);
      const isFound = await vehicleModel(newVehicle.vehicle_model_id);
      console.log('isFound!!!!!!:', isFound);
      expect(isFound).toEqual({
        found: true,
        vehicleDetails: {
          length: 4.6,
          width: 1.8,
          height: 1.4
        },
        approved: true
      });
    });
    test('model not found', async () => {
      const isFound = await vehicleModel(9999);
      expect(isFound).toEqual({
        found: false,
        approved: false,
        error: 'Vehicle model not found'
      });
    });

    afterAll(async () => {
      // מחיקת הרכב
      await sequelize.query('DELETE FROM vehicles WHERE id = $1', {
        bind: [3],
        type: QueryTypes.DELETE
      });
      // מחיקת מודל הרכב
      await sequelize.query('DELETE FROM vehiclemodels WHERE id = $1', {
        bind: [newVehicleModelId],
        type: QueryTypes.DELETE
      });
    });
  });
  describe('Global Cleanup', () => {
  });
  afterAll(async () => {
    console.log('🧹 Global cleanup - סגירת חיבור ל-DB');
    try {
      // ✅ ניקוי סופי
      await sequelize.query('DELETE FROM vehicles WHERE license_plate IN ($1, $2)', {
        bind: ['ZXC123', 'XYZ789'],
        type: QueryTypes.DELETE
      });

      // ✅ תיקון: השתמש בטבלה הנכונה
      await sequelize.query('DELETE FROM users WHERE baseuser_id IN ($1, $2)', {
        bind: [123, 456],
        type: QueryTypes.DELETE
      });

      await sequelize.close();
      console.log('✅ Disconnected from test database');
    } catch (error) {
      console.error('❌ Failed to disconnect from test database:', error);
    }
  });





});