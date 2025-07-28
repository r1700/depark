import express, { Request, Response } from 'express';
import { OPCUAClient, ClientSession, AttributeIds, DataType } from 'node-opcua';
import { readNodeValues, writeNodeValues } from './opc-client';

const {PORT} = process.env || 5000;
const app = express();
app.use(express.json());

const endpointUrl = "opc.tcp://localhost:4080/UA/PLC";

// Helper for opening OPC session
async function getSession(): Promise<ClientSession> {
  const client = OPCUAClient.create({ endpointMustExist: false });
  await client.connect(endpointUrl);
  const session = await client.createSession();
  return session;
}



app.post('/data', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const session = await getSession();
    await writeNodeValues(session, data);
    await session.close();
    res.send('Data sent to PLC');
  } catch (error) {
    res.status(500).send('Error writing to PLC');
  }
});

app.get('/plc-state', async (req, res) => {
  try {
    const nodeIds = ['ns=1;s=parkingTypeAvailable', 'ns=1;s=carInParking']; // Example
    const session = await getSession();
    const plcState = await readNodeValues(session, nodeIds);
    await session.close();
    res.json(plcState);
  } catch (error) {
    res.status(500).send('Error fetching PLC state');
  }
});

app.get('/outputs', async (req, res) => {
  try {
    const outputs = 10;
    res.json(outputs);
  } catch (error) {
    res.status(500).send('Error fetching PLC outputs');
  }
});



export default app;