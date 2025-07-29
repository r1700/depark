
// import { OPCUAClient, AttributeIds } from 'node-opcua';

// (async () => {
//   const client = OPCUAClient.create({ endpointMustExist: false });

//   const endpointUrl = 'opc.tcp://<PLC_IP>:4840'; // plc address
//   const nodeId = 'ns=1;s=LicensePlate'; //variable id in the PLC

//   try{
//   await client.connect(endpointUrl);
//   const session = await client.createSession();

//   const dataValue = await session.read({
//     nodeId,
//     attributeId: AttributeIds.Value
//   });

//   // const fakeValue="1234-5678"; // Simulated license plate value
//   // console.log('📥 the license plate from the PLC:', fakeValue);
//   console.log('📤 the license palatte from the-PLC:', dataValue.value.value);
//   console.log('✅ Connected to the PLC successfully!');
  
//   await session.close();
//   await client.disconnect();
//   }catch (err) {
//     console.error('❌ Error connecting to the PLC:', err);
//   }
// })();

// import { Router } from 'express';

// const router:Router = Router();

// // to get the license plate from the PLC
// router.post('/park-car', async (req, res) => {
//   const { LicensePlate } = req.body;
//   try {
//     res.status(200).send(`Car with license plate ${LicensePlate} wants to park`);
//   } catch (error) {
//     console.error('Error parking the car:', error);
//     res.status(500).send('Error parking the car');
//   }
// });

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

// import { OPCUAClient, AttributeIds } from 'node-opcua';
// import  { Router, Request, Response } from 'express';

// const router = Router();

// router.post('/license-plate', async (req: Request, res: Response) => {
//   const endpointUrl = 'opc.tcp://<PLC_IP>:4840'; // <-- Replace with your PLC IP
//   const nodeId = 'ns=1;s=LicensePlate';         // <-- Replace with your nodeId

//   const client = OPCUAClient.create({ endpointMustExist: false });

//   try {
//     await client.connect(endpointUrl);
//     const session = await client.createSession();

//     const dataValue = await session.read({
//       nodeId,
//       attributeId: AttributeIds.Value,
//     });

//     await session.close();
//     await client.disconnect();

//     res.json({ licensePlate: dataValue.value.value });
//   } catch (error) {
//     console.error('❌ Error connecting to the PLC:', error);
//     res.status(500).json({ error: 'Error reading license plate from PLC' });
//   }
// });

// export default router;

// ===========================================================================
import axios from 'axios';

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

const checkVehicleAuthorization = async (licensePlate: string, timestamp: Date, opcRequestId: string) => {
    try {
        const response = await axios.post<VehicleLookupResponse>('http://backend-url/api/vehicle-lookup', {
            licensePlate,
            timestamp,
            opcRequestId,
        });
        return response.data;
    } catch (error) {
        console.error('error ', error);
        return { found: false, approved: false, error: 'error during vehicle lookup'};
    }
};