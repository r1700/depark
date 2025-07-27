import { Router, Request, Response } from 'express';
import { getVehicleDetailsByDegem } from '../services/vehicleService';

const router = Router();

router.get('/get-vehicle', async (req, res) => {
  const degem = req.query.degem as string;
  if (!degem) {
    return res.status(400).json({ error: 'נא להזין דגם רכב.' });
  }

  try {
    const result = await getVehicleDetailsByDegem(degem);
    return res.json({ degem, ...result });
  } catch (error: any) {
    if (error.message.includes('לא נמצאו')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'שגיאה פנימית בשרת.' });
  }
});

export default router;
