import express, { Application, Request, Response } from 'express';

/**
 * Creates a server that simulates a PLC controller with an open API
 */
export function createPlcMockServer(): Application {
  const app = express();
  app.use(express.json());

  // מצב פנימי המדמה חומרת PLC
  const plcState = {
    outputs: {
      motor: false,
      valve: false,
    },
    inputs: {
      sensor1: 0,
      sensor2: 0,
    },
  };

  /**
   ** Obtaining full status of the PLC (outputs + inputs)
   */
  app.get('/plc/state', (req: Request, res: Response) => {
    res.json(plcState);
  });

 
  app.get('/plc/inputs', (req: Request, res: Response) => {
    res.json(plcState.inputs);
  });

  /**
   * עדכון פלטים – למשל: הפעלת מנוע
   */
  app.post('/plc/output', (req: Request, res: Response) => {
    const updates = req.body;
    for (const key in updates) {
      if (key in plcState.outputs) {
  plcState.outputs[key as keyof typeof plcState.outputs] = updates[key];
}
    }
    res.json({ status: 'updated', outputs: plcState.outputs });
  });

  /**
   * Input update – for example: sensor simulation
   */
  app.post('/plc/input', (req: Request, res: Response) => {
    const updates = req.body;
    for (const key in updates) {
      if (key in plcState.inputs) {
    plcState.inputs[key as keyof typeof plcState.inputs] = updates[key];
}
    }
    res.json({ status: 'simulated', inputs: plcState.inputs });
  });

  return app;
}
