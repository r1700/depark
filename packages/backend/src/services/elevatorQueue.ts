
// // // בס"ד

import axios from 'axios';

export async function getElevatorQueue(elevatorId: string, floor: string, timeoutMs: number) {
  const opcBridgeUrl = `http://${process.env.OPC}` || 'http://localhost:5000';
  try {
    const response = await axios.post(`${opcBridgeUrl}/api/opc/elevatorQueue`, {
      elevatorId,
      floor,
      timeoutMs
    }, { timeout: timeoutMs + 2000 });
    return response.data;
  } catch (err: any) {
    if (err.code === 'ECONNABORTED' || err.response?.status === 504) {
      throw new Error("PLC_TIMEOUT");
    }
    throw err;
  }
}