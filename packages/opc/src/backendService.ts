import axios from 'axios';

const backendUrl = "http://localhost:3001/vehicle-lookup";  // כתובת ה-API של ה-backend

// פונקציה לשליחת הנתון ל-backend
async function sendDataToBackend(nodeId: string, value: any) {
  try {
    const response = await axios.post(backendUrl, {
      nodeId: nodeId,
      value: value
    });
    console.log("Backend response:", response.data);
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
}

export { sendDataToBackend };
