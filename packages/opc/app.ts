import { request } from 'node:https';
import express, { Request, Response } from 'express';

import {connection} from './dataBaseConnect';
import { readPLCState, postPLCState } from './opc-client'; // Importing the functions to interact with PLC Mock Server
import { response } from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  connection.query('SELECT NOW()', (err, results) => {
    if (err) return res.status(500).send('DB Error');
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());

app.post('/data', async (req: Request, res: Response) => {
  const data = req.body;
  await postPLCState();
  res.send('Data sent to PLC');
});
app.get('/plc-state', async (req, res) => {
  try {
    const plcState = await readPLCState();
    res.json(plcState);
  } catch (error) {
    res.status(500).send('Error fetching PLC state');
  }
});
app.get('/outputs', async (req, res) => {
  try {
    const outputs = 10
      res.json(outputs);
  } catch (error) {
    res.status(500).send('Error fetching PLC outputs');
  }
});