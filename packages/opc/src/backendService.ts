import axios from "axios";

const backendUrl = "https://<backend_url>/vehicle-lookup";

async function sendLicensePlateToBackend(licensePlate: string) {
  try {
    const response = await axios.post(backendUrl, {
      licensePlate: licensePlate
    });
    console.log("Backend response:", response.data);
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
}

export { sendLicensePlateToBackend };
