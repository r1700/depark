import axios from 'axios';

export async function sendVehicleData(value: { licensePlate: string; floor: string }) {
    console.log("sendVehicleData called with:", value);

    const url = 'http://localhost:3001/api/tablet/retrieve';
    try {
        console.log('sending vehicle data:', value);

        const response = await axios.post(url, {
            licensePlate: value.licensePlate,
            floor: value.floor
        });
        console.log('Response from sendVehicleData:', response.data);

         return { ...response.data, status: response.status };
    } catch (error) {
        console.log('Error from sendVehicleData:', error);

        return {
            success: false,
            message: 'Network error or server unavailable',
            licensePlate: value.licensePlate,
            position: null,
            assigned_pickup_spot: null
        };
    }
}

export async function sendFloorQueues(floorNumber: number) {
    const url = 'https://localhost:3001/api/tablet/queues';
    try {
        const response = await axios.post(url, { floor: floorNumber });
        return response.data;
    } catch (error) {
        console.log('Error fetching floor queues:', error);
        
        // return [
        //     {
        //         elevatorNumber: 1,
        //         firstVehicle: { licensePlate: '12-345-67', estimatedWait: 0 },
        //         remainingCount: 2,
        //     },
        //     {
        //         elevatorNumber: 2,
        //         firstVehicle: { licensePlate: '234-56-789', estimatedWait: 5 },
        //         remainingCount: 1,
        //     }
        // ];
    }
}

export async function sendElevatorQueue(floorNumber: number, elevatorNumber: number) {
    const url = 'https://localhost:3001/api/tablet/elevator-queue';
    try {
        const response = await axios.post(url, { floor: floorNumber, elevator: elevatorNumber });
        return response.data;
    } catch (error) {
        return {
            vehicles: [
                { licensePlate: '12-345-67', estimatedWait: 0 },
                { licensePlate: '234-56-789', estimatedWait: 5 },
                { licensePlate: '345-67-890', estimatedWait: 10 }
            ]
        };
    }
}

export async function sendEmployeeVehicles(employeeId: string) {
    const url = 'https://localhost:3001/api/tablet/Employee';
    try {
        const response = await axios.post(url, { employeeId });
        return response.data;
    } catch (error) {
        if (employeeId === '123456789') {
            return [
                { licensePlate: '12-345-67' },
                { licensePlate: '456-78-901' }
            ];
        } if (employeeId === '999999999') {
            return [
                { licensePlate: '56-789-01' },
                { licensePlate: '678-90-123' }
            ];
        } else {
            return [];
        }
    }
}
