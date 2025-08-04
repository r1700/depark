import { Router, Request, Response } from 'express';
// import { getVehicleDetailsByDegem } from '../services/vehicleService';

const router = Router();

// router.get('/get-vehicle', async (req, res) => {
//   const degem = req.query.degem as string;
//   if (!degem) {
//     return res.status(400).json({ error: 'Please provide a vehicle model.' });
//   }

//   try {
//     const result = await getVehicleDetailsByDegem(degem);
//     return res.json({ degem, ...result });
//   } catch (error: any) {
//     if (error.message === 'No results found for the model') {
//       return res.status(404).json({ error: error.message });
//     }
    
//     console.error('Error:', error);
//     return res.status(500).json({ error: 'Internal server error.' });
//   }
// });

export default router;
