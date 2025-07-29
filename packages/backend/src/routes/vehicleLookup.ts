
// import { Router } from 'express';

// const router:Router = Router();

// // ראוט לחניית רכב - ממקום חניה מעל לקרקע למקום חניה מתחת לקרקע
// router.post('/park-car', async (req, res) => {
//   const { aboveGroundSpot, belowGroundSpot } = req.body;

//   // בדיקה אם מקומות החניה הוזנו בצורה נכונה
//   if (typeof aboveGroundSpot !== 'number' || typeof belowGroundSpot !== 'number') {
//     return res.status(400).send('Both parking spots must be provided as numbers');
//   }

//   try {
//     // חניית רכב ממקום מעל לקרקע למקום מתחת לקרקע
//     await parkCar(aboveGroundSpot, belowGroundSpot);
//     res.status(200).send(`Car parked from spot ${aboveGroundSpot} to spot ${belowGroundSpot}`);
//   } catch (error) {
//     console.error('Error parking the car:', error);
//     res.status(500).send('Error parking the car');
//   }
// });

// // ראוט להוצאת רכב ממקום חניה - ממקום חניה מתחת לקרקע למקום חניה מעל לקרקע
// router.post('/unpark-car', async (req, res) => {
//   const { aboveGroundSpot, belowGroundSpot } = req.body;

//   // בדיקה אם מקומות החניה הוזנו בצורה נכונה
//   if (typeof aboveGroundSpot !== 'number' || typeof belowGroundSpot !== 'number') {
//     return res.status(400).send('Both parking spots must be provided as numbers');
//   }

//   try {
//     // הוצאת רכב ממקום מתחת לקרקע למקום מעל לקרקע
//     await unparkCar(aboveGroundSpot, belowGroundSpot);
//     res.status(200).send(`Car unparked from spot ${belowGroundSpot} to spot ${aboveGroundSpot}`);
//   } catch (error) {
//     console.error('Error unparking the car:', error);
//     res.status(500).send('Error unparking the car');
//   }
// });

// // -----------------------------------------------------------------

// import { OPCUAClient, ClientSession, ClientSubscription, AttributeIds } from 'node-opcua';

// // חיבור לפורט והגדרת ה-PLC
// // יצירת אובייקט OPCUAClient
// const client = OPCUAClient.create({
//   endpointMustExist: false, // אפשרות אם ה-endpoint לא חייב להיות קיים מראש
//   connectionStrategy: {
//     initialDelay: 1000,
//     maxRetry: 1
//   }
// });
// let session: ClientSession | null = null;

// // פונקציה לחיבור עם ה-PLC
// const connectToPLC = async (): Promise<ClientSession> => {
//   try {
//     await client.connect('opc.tcp://localhost:4840');
//     session = await client.createSession();
//     console.log('החיבור ל-PLC הוקם בהצלחה');
//     return session;
//   } catch (error) {
//     console.error('חיבור ל-PLC נכשל', error);
//     throw new Error('Connection to PLC failed');
//   }
// };

// // פונקציה לחניית רכב
// export const parkCar = async (aboveGroundSpot: number, belowGroundSpot: number): Promise<void> => {
//   const session = await connectToPLC();

//   try {
//     // כעת ניתן לשלוח את הפקודות לחומרה (לדוג' OPC-UA)
//     const nodeId = 'ns=1;s=parkingSpot'; // דוגמה למזהה של מקום חניה

//     // כאן תוכל לשלוח את הפקודה לחומרה (PLC)
//     await session.write({ nodeId, attributeId: AttributeIds.Value, value: { value: { dataType: 'Double', value: belowGroundSpot } } });
//     console.log(`חניית רכב ממקום ${aboveGroundSpot} למקום ${belowGroundSpot}`);
//   } catch (error) {
//     console.error('שגיאה בחניית רכב:', error);
//   }
// };

// // פונקציה להוצאת רכב ממקום חניה
// export const unparkCar = async (aboveGroundSpot: number, belowGroundSpot: number): Promise<void> => {
//   const session = await connectToPLC();

//   try {
//     // כעת ניתן לשלוח את הפקודות לחומרה (לדוג' OPC-UA)
//     const nodeId = 'ns=1;s=parkingSpot'; // דוגמה למזהה של מקום חניה

//     // כאן תוכל לשלוח את הפקודה לחומרה (PLC)
//     await session.write({ nodeId, attributeId: AttributeIds.Value, value: { value: { dataType: 'Double', value: aboveGroundSpot } } });
//     console.log(`הוצאת רכב ממקום ${belowGroundSpot} למקום ${aboveGroundSpot}`);
//   } catch (error) {
//     console.error('שגיאה בהוצאת רכב:', error);
//   }
// };

// export default router;

// import axios from 'axios';

// async function handleVehicleLookupRequest(request: VehicleLookupRequest): Promise<VehicleLookupResponse> {
//   try {
//     // קריאה ל-API חיצוני לבדיקה
//     const response = await axios.post<VehicleLookupResponse>('https://external-vehicle-lookup.api/lookup', {
//       licensePlate: request.licensePlate
//     });

//     const data = response.data;

//     // לוגיקה לבדיקת הרשאה (לדוגמה)
//     if (data.isAuthorized) {
//       return {
//         licensePlate: data.licensePlate,
//         isAuthorized: true,
//         authorizationExpiry: data.authorizationExpiry,
//         vehicleOwnerName: data.vehicleOwnerName,
//         message: 'Parking authorization granted',
//       };
//     } else {
//       return {
//         licensePlate: data.licensePlate,
//         isAuthorized: false,
//         message: 'Vehicle not authorized for parking',
//       };
//     }

//   } catch (error) {
//     return {
//       licensePlate: request.licensePlate,
//       isAuthorized: false,
//       message: `Error during vehicle lookup: ${error.message}`,
//     };
//   }
// }

// import { error } from "console";
// import { Router } from "express";
// import axios from "axios";


// const router = Router();

// interface VehicleLookupRequest {
//   licensePlate: string;
//   timestamp: Date;
//   opcRequestId: string;
// }

// interface VehicleLookupResponse {
//   found: boolean;
//   vehicleDetails?: {
//     height: number;
//     width: number;
//     length: number;
//     weight: number;
//   };
//   userId?: string;
//   approved: boolean;
//   error?: string;
// }

// router.post('/vehicle/lookup', async (req, res) => {
//   const lookupRequest: VehicleLookupRequest = req.body;

//   // Validate the incoming request
//   if (typeof lookupRequest.licensePlate !== 'string' || !lookupRequest.licensePlate.trim()) {
//     return res.status(400).send('License plate must be a non-empty string');
//   }

//     try {
//       // כאן תוכל לקרוא ל-API חיצוני או לבצע לוגיקה לבדוק את הרכב
//       // לדוגמה, נניח שהרכב מורשה לחניה
//       const response = {
//         found: true,
//         vehicleDetails: {
//           height: 1.5,
//           width: 2.0,
//           length: 4.5,
//           weight: 1500
//         },
//         userId: '12345',
//         approved: true,
//         error: null
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       console.error('Error during vehicle lookup:', error);
//       res.status(500).send('Error during vehicle lookup');
//     }
// });

// export default router;


// try {
//   // Call the external Vehicle Lookup API
//   const externalApiResponse = await axios.get(`http://api.yourvehiclelookup.com/lookup?vehicle=${lookupRequest.licensePlate}`);

//   const vehicleLookupResponse: VehicleLookupResponse = {
//     found: externalApiResponse.data.found,
//     vehicleDetails: externalApiResponse.data.details,
//     userId: externalApiResponse.data.userId,
//     approved: externalApiResponse.data.authorized,
//     error: null
//   };

//   res.status(200).json(vehicleLookupResponse);
// } catch (error) {
//   console.error('Error during vehicle lookup:', error);
//   const vehicleLookupResponse: VehicleLookupResponse = {
//     found: false,
//     approved: false,
//     error: 'Error during vehicle lookup'
//   };
//   res.status(500).json(vehicleLookupResponse);
// }

// =========================================================================
// routes/vehicleLookup.ts

import express, { Request, Response } from 'express';
import { Vehicle } from './models/Vehicle'; // יבוא המודל שלך

const router = express.Router();

interface VehicleLookupRequest {
    licensePlate: string;
    timestamp: Date;
    opcRequestId: string;
}

interface VehicleLookupResponse {
    found: boolean;
    vehicleDetails?: {
        height: number;
        width: number;
        length: number;
        weight: number;
    };
    userId?: string;
    approved: boolean;
    error?: string;
}

router.post<{}, VehicleLookupResponse, VehicleLookupRequest>('/vehicle/lookup', async (req: Request<{}, VehicleLookupResponse, VehicleLookupRequest>, res: Response<VehicleLookupResponse>) => {
    const { licensePlate, timestamp, opcRequestId } = req.body;

    if (typeof licensePlate !== 'string' || !licensePlate.trim()) {
        return res.status(400).json({ found: false, approved: false, error: 'לוחית רישוי חייבת להיות מחרוזת לא ריקה' });
    }

    try {
        const vehicle = await Vehicle.findOne({ where: { licensePlate } });

        if (!vehicle) {
            return res.status(404).json({ found: false, approved: false, error: 'הרכב לא נמצא' });
        }

        const vehicleDetails = {
            height: vehicle.height,
            width: vehicle.width,
            length: vehicle.length,
            weight: vehicle.weight,
        };

        res.status(200).json({
            found: true,
            vehicleDetails,
            userId: vehicle.userId,
            approved: vehicle.approved,
            error: undefined,
        });
    } catch (error) {
        console.error('Error during vehicle search:', error);
        res.status(500).json({ found: false, approved: false, error: 'Error during vehicle search' });
    }
});

export default router;
