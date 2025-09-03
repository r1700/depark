import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const { SOURCE_URL } = process.env;
// Construct the backend URL
const backendUrl = `http://${SOURCE_URL || 'localhost:3001'}/api/opc`;
/**
 * Function to send data to the backend
 * @param event - The event name or endpoint to send the data to
 * @param value - The value to send to the backend
 */
async function sendDataToBackend(event: string, value: any): Promise<void> {
  const url = `${backendUrl}/${event}`; // Construct the full URL
  try {
    console.log(`Sending data to backend at ${url} with value:`, value);
    const response = await axios.post(url, { value });
    console.log('Backend response:', response.data);
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('Error response from backend:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received from backend:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error sending data to backend:', error.message);
    }
    throw new Error(`Failed to send data to backend at ${url}`);
  }
}
export { sendDataToBackend };