import { Router, Request, Response } from 'express';
import { getVehicleDetailsByDegem } from '../services/vehicleService';

const router = Router();

router.get('/get-vehicle', async (req, res) => {
  const degem = req.query.degem as string;
  if (!degem) {
<<<<<<< HEAD
    return res.status(400).json({ error: 'Please enter a vehicle model.' });
=======
    return res.status(400).json({ error: 'נא להזין דגם רכב.' });
>>>>>>> 7c13d823129a3596c6e873bfae9cae25d44e1260
  }

  try {
    const result = await getVehicleDetailsByDegem(degem);
    return res.json({ degem, ...result });
  } catch (error: any) {
<<<<<<< HEAD
    if (error.message.includes('No results found for the model')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
=======
    if (error.message.includes('לא נמצאו')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'שגיאה פנימית בשרת.' });
>>>>>>> 7c13d823129a3596c6e873bfae9cae25d44e1260
  }
});

export default router;
