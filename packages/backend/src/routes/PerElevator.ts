
// בס"ד

import express, { Request, Response } from 'express';
import { getElevatorQueue } from '../services/elevatorQueue';

const router = express.Router();

/**
api for elevator
 */
router.post('/', async (req: Request, res: Response) => {
  const { elevatorId, floor, timeoutMs = 5000 } = req.body;

  if (!elevatorId || !floor) {
    return res.status(400).json({ error: "Missing elevatorId or floor" });
  }

  try {
    const result = await getElevatorQueue(elevatorId, floor, timeoutMs);
    const vehicles = (result.queue || []).map((item: any, idx: number) => ({
      licensePlate: item.licensePlate,
      estimatedWait: (typeof item.estimatedRetrievalTime === 'number')
        ? item.estimatedRetrievalTime - 5
        : idx * 5 // ברירת מחדל אם אין estimatedRetrievalTime
    }));
    console.log(vehicles);
    
    res.json(vehicles);
  } catch (err: any) {
    if (err.message === "PLC_TIMEOUT") {
      return res.status(504).json({ error: "PLC_TIMEOUT" });
    }
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default router;