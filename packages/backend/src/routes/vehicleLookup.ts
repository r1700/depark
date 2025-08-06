
// בס"ד

// import express, { Request, Response } from 'express';

// const router = express.Router();

// router.post('/vehicle/lookup', async (req: Request<{}, VehicleLookupResponse, VehicleLookupRequest>, res: Response<VehicleLookupResponse>) => {
//     const { licensePlate, timestamp, opcRequestId } = req.body;

//     if (typeof licensePlate !== 'string' || !licensePlate.trim()) {
//         return res.status(400).json({ found: false, approved: false, error: 'לוחית רישוי חייבת להיות מחרוזת לא ריקה' });
//     }

//     try {
//         const vehicle = await Vehicle.findOne({ where: { licensePlate } });

//         if (!vehicle) {
//             return res.status(404).json({ found: false, approved: false, error: 'הרכב לא נמצא' });
//         }

//         const vehicleDetails = {
//             height: vehicle.height,
//             width: vehicle.width,
//             length: vehicle.length,
//             weight: vehicle.weight,
//         };

//         res.status(200).json({
//             found: true,
//             vehicleDetails,
//             userId: vehicle.userId,
//             approved: vehicle.approved,
//             error: undefined,
//         });
//     } catch (error) {
//         console.error('Error during vehicle search:', error);
//         res.status(500).json({ found: false, approved: false, error: 'Error during vehicle search' });
//     }
// });

// export default router;

// בס"ד

import express from 'express';
import isVehicleAllowed from '../services/vehicle-lookup/vehicleLookup';

const router = express.Router();

router.post('/lookup', async (req, res) => {
  const { licensePlate, timestamp, opcRequestId, lotId } = req.body;

  if (!licensePlate || !timestamp || !opcRequestId || !lotId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await isVehicleAllowed({
      licensePlate,
      timestamp: new Date(timestamp),
      opcRequestId,
      lotId: Number(lotId),
    });

    return res.json(result);
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
