import express, { Request, Response, NextFunction } from 'express';
import { writeNodeValues, WriteItem, waitForNodeChange } from './opc-client';
import { DataValue } from 'node-opcua';

const app = express();
app.use(express.json());

// Middleware to extract nodeId and prepare write item
function extractNodeId(req: Request, res: Response, next: NextFunction): void {
  try {
    const param = req.params.nodeid; // Extract the param from the URL
    const values = Object.values(req.body);
    console.log('Values:', values, param);

    let value: any = '';
    if (values.length === 1) {
      value = values[0];
    } else {
      value = values; // If multiple values, assign the entire array
    }

    const item: WriteItem = {
      nodeId: `ns=1;s=${param}`,
      value,
    };
    console.log('Write Item:', item);

    req.body.nodeId = item; // Assign the write item to req.body.nodeId
    next(); // Pass the request to the next handler
  } catch (err: any) {
    console.error('Error in extractNodeId middleware:', err);
    res.status(500).json({ error: 'Failed to process nodeId' });
  }
}

// Handler to write values to the PLC
async function writeToPlc(req: Request, res: Response): Promise<void> {
  const writeItems: WriteItem = req.body.nodeId;
  try {
    await writeNodeValues([writeItems]);
    res.status(200).send('Values updated successfully');
  } catch (err: any) {
    console.error('Error in writeToPlc handler:', err);
    res.status(500).json({ error: err.message || 'Failed to write values to PLC' });
  }
}

// POST endpoint to write values to the PLC
app.post('/plc/write/:nodeid', extractNodeId, writeToPlc);

// POST endpoint to wait for a node change
app.post('/api/wait-for-node-change', async (req: Request, res: Response) => {
  try {
    const { nodeId, samplingInterval, timeout, predicate } = req.body;

    // Validate input
    if (!nodeId) {
      return res.status(400).json({ error: 'nodeId is required' });
    }

    // Call waitForNodeChange function
    const value = await waitForNodeChange(nodeId, {
      samplingInterval,
      timeout,
      predicate: predicate
        ? (new Function('value', 'dataValue', predicate) as (v: any, dv?: DataValue) => boolean)
        : undefined,
    });

    res.status(200).json({ value });
  } catch (err: any) {
    console.error('Error in /api/wait-for-node-change:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});


// start my code-rachel
/**
 * API לקבלת תור של מעלית מה־PLC
 * POST /api/opc/elevatorQueue
 * body: { elevatorId: string, floor: string, timeoutMs?: number }
 */
app.post('/api/opc/elevatorQueue', async (req, res) => {
  const { elevatorId, floor, timeoutMs = 5000 } = req.body;
  if (!elevatorId || !floor) {
    return res.status(400).json({ error: "Missing elevatorId or floor" });
  }
  try {
    // בניית payload ושליחה ל־PLC
    const payload = `${elevatorId}|${floor}`;
    await writeNodeValues([{ nodeId: `ns=1;s=ElevatorQueueRequest`, value: payload }]);
    // המתנה לערך חדש
    const nodeId = `ns=1;s=ElevatorWaitingList`;
    console.log('try to read node id:', nodeId);

    const rawValue = await waitForNodeChange(nodeId, { timeout: timeoutMs });
    // פירוש הערך
    let queue: any[] = [];
    if (rawValue === "[]" || rawValue === "" || rawValue == null) {
      queue = [];
    } else {
      queue = String(rawValue)
        .split(";")
        .filter(Boolean)
        .map((item, i) => {
          const [licensePlate, pos] = item.split(":");
          return {
            licensePlate,
            position: Number(pos || i + 1),
            estimatedRetrievalTime: (Number(pos || i + 1)) * 5
          };
        });
    }

    res.json({
      elevatorId,
      floor,
      queue,
      timestamp: new Date().toISOString(),
      warnings: queue.length === 0 ? ["NO_DATA_FROM_PLC"] : []
    });
  } catch (err: any) {
    if (err.message?.includes("Timeout")) {
      return res.status(504).json({ error: "PLC_TIMEOUT" });
    }
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("OPC Bridge API running on port 5000");
});

// end my code-rachel

// Catch-all route for undefined endpoints
app.use('/', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;