import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const { OPC } = process.env;

const backendUrl = `http://${OPC || "localhost:5000"}`;

// Function to send data to the OPC server
async function sendToOPC(api: string, data: any): Promise<any> {
  const url = `${backendUrl}/${api}`;
  try {
    console.log('Sending data to URL:', url, 'with data:', data);

    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response from API:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error calling API:', error.response?.data || error.message);
    throw new Error(`Failed to call OPC API at ${url}: ${error.message}`);
  }
}

// Function to wait for a node change in the OPC server
export async function callWaitForNodeChangeApi(nodeid:string): Promise<any> {
  const data = {
    nodeId: `ns=1;s=${nodeid}`, // NodeId to monitor
    samplingInterval: 200, // Sampling interval in milliseconds
    timeout: 10000, // Maximum wait time in milliseconds
    predicate: 'return value !== null;', // Custom predicate
  };

  try {
    const response = await sendToOPC('api/wait-for-node-change', data);
    return response.value;
  } catch (error: any) {
    console.error('Error occurred while waiting for node change:', error);
    throw new Error('Failed to wait for node change in OPC server');
  }
}

// Function to write data to the PLC via the OPC server
export async function callWriteToPlcApi(nodeId: string, data: any): Promise<void> {
  try {
    console.log(`Writing data to PLC node ${nodeId} with data:`, data);
    await sendToOPC(`plc/write/${nodeId}`, data);
    console.log(`Successfully wrote data to PLC node ${nodeId}`);
  } catch (error: any) {
    console.error('Error occurred while writing to PLC:', error);
    throw new Error(`Failed to write to PLC node ${nodeId}`);
  }
}