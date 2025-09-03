import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const { SOURCE_URL } = process.env;
const backendBase = `http://${SOURCE_URL || "localhost:3001"}/api`;

/**
 * שלח payload ל‑backend.
 * endpoint — חלק אחרי /api/ (למשל: 'opc/fault' או 'opc/fault/resolve')
 */
async function sendDataToBackend(endpoint: string, payload: any) {
  const url = `${backendBase}/opc/${endpoint}`;
  try {
    const response = await axios.post(url, payload, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`Backend response [${endpoint}]:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error sending data to backend [${endpoint}]:`, error?.response?.data ?? error.message ?? error);
    throw error;
  }
}

export { sendDataToBackend };