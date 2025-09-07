
// // בס"ד

// import { Router } from 'express';
// import { getElevatorQueueController } from '../services/elevatorQueue';

// const router = Router();

// router.post('/queue', getElevatorQueueController)

// export default router;

import express, { Request, Response } from 'express';
import { getElevatorQueue } from '../services/elevatorQueue';

const router = express.Router();

/**
 * API לקבלת תור של מעלית
 */
router.post('/queue', async (req: Request, res: Response) => {

  const { elevatorId, floor, timeoutMs = 5000 } = req.body;

  if (!elevatorId || !floor) {
    return res.status(400).json({ error: "Missing elevatorId or floor" });
  }

  try {
    const result = await getElevatorQueue(elevatorId, floor, timeoutMs);
    res.json(result);
    console.log("📥 Request received at /queue:", req.body);
  } catch (err: any) {
    if (err.message === "PLC_TIMEOUT") {
      return res.status(504).json({ error: "PLC_TIMEOUT" });
    }
    console.error("Error in /elevator-queue:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default router;
