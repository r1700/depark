import express, { Request, Response } from 'express';
import { writeNodeValues, WriteItem } from './opc-client';

const app = express();
app.use(express.json());

// POST /plc/write
function extractNodeId(req: Request, res: Response, next: Function): void {
  const { param } = req.params; // Extract the URL suffix

  if (!param) {
    res.status(400).send("NodeId is missing in the URL"); 
    return;
  }
  const nodeId = `ns=1;s=${param}`; // Create the nodeId from the param
  const value = req.body[param]; // Extract the value from the request body

  if (!value) {
    res.status(400).send("License plate is required"); 
    return;
  }

  const item: WriteItem[] = [{
    nodeId: nodeId,
    value: value
  }];
  req.body.nodeId = item;
  next(); // Pass the request to the next handler
}

app.post('/plc/write/:param', extractNodeId, async (req: Request, res: Response) => {
  const writeItems: WriteItem[] = req.body.nodeId || [];
  if (!Array.isArray(writeItems) || writeItems.length === 0) {
    return res.status(400).send("No write items provided");
  }
  try {
    await writeNodeValues(writeItems);
    res.send("Values updated");
  } catch (err: any) {
    res.status(500).send(err.message || "Unknown error");
  }
});

app.use('/', (req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

export default app;