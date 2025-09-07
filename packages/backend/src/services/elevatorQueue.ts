
// // בס"ד

// import { callWriteToPlcApi, callWaitForNodeChangeApi } from '../services/opc/backend-opc';
// // ↑ כאן את משתמשת בפונקציות הקיימות שלך שציינת בקוד הקודם
// import { buildQueueRequestString, getQueueNodeId, parseQueueFromPlcValue } from '../utils/elevatorQueue';

// export async function getElevatorQueue(elevatorId: string, floor: string, timeoutMs: number) {
//   // 1. בניית סטרינג לשליחה ל-PLC
//   const payload = buildQueueRequestString(elevatorId, floor);

//   await callWriteToPlcApi('ElevatorQueueRequest', { payload, elevatorId, floor });

//   // 2. קביעת nodeId ייחודי לכל מעלית
//   const nodeId = getQueueNodeId(elevatorId);

//   // 3. המתנה לשינוי בנוד
//   let rawValue: any;
//   try {
//     rawValue = await callWaitForNodeChangeApi(nodeId, { timeout: timeoutMs });
//   } catch (err: any) {
//     if (err.message?.includes('timeout')) {
//       throw new Error('PLC_TIMEOUT');
//     }
//     throw err;
//   }

//   // 4. פירוש הערך שהתקבל ל־JSON מסודר
//   const queue = parseQueueFromPlcValue(rawValue);

//   return {
//     elevatorId,
//     floor,
//     queue,
//     timestamp: new Date().toISOString(),
//     warnings: queue.length === 0 ? ['NO_DATA_FROM_PLC'] : []
//   };
// }

// // ========================================================================
// // controller to handle the API request
// // ========================================================================

// import { Request, Response } from 'express';
// // import { getElevatorQueue } from '../services/elevatorQueueService';

// export async function getElevatorQueueController(req: Request, res: Response) {
//   try {
//     const { elevatorId, floor, timeoutMs } = req.body;

//     if (!elevatorId) {
//       return res.status(400).json({ error: 'elevatorId is required' });
//     }
//     if (!floor) {
//       return res.status(400).json({ error: 'floor is required' });
//     }

//     const data = await getElevatorQueue(elevatorId, floor, timeoutMs || 8000);

//     return res.status(200).json(data);
//   } catch (err: any) {
//     if (err.message === 'PLC_TIMEOUT') {
//       return res.status(504).json({ error: 'PLC timeout' });
//     }
//     console.error('Error in getElevatorQueueController:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }


import { writeNodeValues, waitForNodeChange } from '../../../opc/src/opc-client';
import { buildQueueRequestString, getQueueNodeId, parseQueueFromPlcValue } from '../utils/elevatorQueue';

/**
 * קריאה מלאה ל־PLC כדי לקבל את התור למעלית
 */
export async function getElevatorQueue(elevatorId: string, floor: string, timeoutMs: number) {

  // 1. בניית payload ל־PLC
  const payload = buildQueueRequestString(elevatorId, floor);

  // כתיבה ל־PLC
  await writeNodeValues([{ nodeId: `ns=1;s=ElevatorQueueRequest`, value: payload }]);

  // 2. קביעת nodeId ייחודי
  const nodeId = getQueueNodeId(elevatorId);

  // 3. המתנה לערך חדש
  let rawValue: any;
  try {
    rawValue = await waitForNodeChange(nodeId, { timeout: timeoutMs });
  } catch (err: any) {
    if (err.message?.includes("Timeout")) {
      throw new Error("PLC_TIMEOUT");
    }
    throw err;
  }

  // 4. פירוש הערך שהתקבל
  const queue = parseQueueFromPlcValue(rawValue);

  return {
    elevatorId,
    floor,
    queue,
    timestamp: new Date().toISOString(),
    warnings: queue.length === 0 ? ["NO_DATA_FROM_PLC"] : []
  };
}
