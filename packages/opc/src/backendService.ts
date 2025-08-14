import axios from 'axios';
import * as dotenv from 'dotenv';
import { log } from 'node:console';
dotenv.config();

const { SOURCE_URL } = process.env

const backendUrl = `http://${SOURCE_URL || "localhost:3001"}/api/opc`;

// פונקציה לשליחת הנתון ל-backend
async function sendDataToBackend(event: string, value: any) {
    const url = `${backendUrl}/${event}`; // Adjust the endpoint as needed      
    try {
        const response = await axios.post(url, {
            value: value
        });
        console.log("Backend response:", response.data);
    } catch (error) {
        console.error("Error sending data to backend:", error);
    }
}

export { sendDataToBackend };