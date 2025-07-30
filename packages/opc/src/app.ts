import express, { Request, Response } from 'express';
import { writeNodeValues, WriteItem } from './opc-client';
import { it } from 'node:test';

const app = express();
app.use(express.json());

// POST /plc/write
function extractNodeId(req: Request, res: Response, next: Function): void {
  const paramsArray = Object.values(req.params);

  console.log(paramsArray);

  if (paramsArray.length < 1) {
    res.status(400).send("At least one parameter is required");
    return;
  }
  const itemArray = paramsArray.map(param => {
    const nodeId = `ns=1;s=${param}`; // Create the nodeId from the param   
    const value = req.body[param]; // Extract the value from the request body

    if (!value) {
      return;
    }
    return {
      nodeId: nodeId,
      value: value
    };
  });
  if (itemArray.length === 0) {
    res.status(400).send("No valid nodeId found");
    return;
  }
  const items = itemArray.filter(item => item != null); // Filter out any undefined items
  req.body.nodeId = items; // Assign the array to req.body.nodeId
  next(); // Pass the request to the next handler
}

async function writeToPlc(req: Request, res: Response, next: Function): Promise<void> {
  const writeItems: WriteItem[] = req.body.nodeId || [];
  if (!Array.isArray(writeItems) || writeItems.length === 0) {
    res.status(400).send("No write items provided");
    return;
  }
  try {
    await writeNodeValues(writeItems);
    res.send("Values updated");
  } catch (err: any) {
    res.status(500).send(err.message || "Unknown error");
  }
}


app.post('/plc/write/:param/:param2', extractNodeId, writeToPlc);
app.post('/plc/write/:param', extractNodeId, writeToPlc);


app.use('/', (req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

export default app;