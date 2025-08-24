import axios from 'axios';


export async function sendVehicleData(value: any) {
    const url = `https://localhost:3001/api/tablet/retrieve`; // Adjust the endpoint as needed
    try {
        console.log(url);
                
        const response = await axios.post(url, {
            licensePlate: value.licensePlate,
            floorNumber: value.floorNumber
        });
        console.log("Backend response:", response.data);
    } catch (error) {
        console.error("Error sending data to backend:", error);
    }
}