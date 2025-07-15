import WebSocket from 'ws';

// WebSocket Server
const wss = new WebSocket.Server({ port: 8765 });

// parkingSpaces will hold the mapping of car IDs to parking slots
let parkingSpaces: { [key: string]: string } = {};

// function to handle parking space allocation
wss.on('connection', (ws: WebSocket) => {
    console.log("New connection established");

    // Accepting messages from the client
    ws.on('message', (message: string) => {
        try {
            const data = JSON.parse(message);
            const action = data.action;

            if (action === 'request_elevator') {
                const carId = data.car_id;
                // parking slot allocation logic
                const parkingSlot = `slot_${Math.floor(Math.random() * 100)}`;

                parkingSpaces[carId] = parkingSlot;

                // sending response back to the client
                const response = {
                    status: 'elevator_arrived',
                    car_id: carId,
                    parking_slot: parkingSlot
                };
                ws.send(JSON.stringify(response));
            } else if (action === 'release_car') {
                const carId = data.car_id;

                if (parkingSpaces[carId]) {
                    delete parkingSpaces[carId];
                    const response = {
                        status: 'car_released',
                        car_id: carId
                    };
                    ws.send(JSON.stringify(response));
                } else {
                    const response = {
                        status: 'error',
                        message: 'Car not found'
                    };
                    ws.send(JSON.stringify(response));
                }
            } else {
                const response = {
                    status: 'error',
                    message: 'Invalid action'
                };
                ws.send(JSON.stringify(response));
            }
        } catch (error) {
            const response = {
                status: 'error',
                message: 'Invalid JSON format'
            };
            ws.send(JSON.stringify(response));
            console.error("Error parsing message:", error);
        }
    });

    // Treatment of connection closure
    ws.on('close', () => {
        console.log("Connection closed");
        // Handle cleanup or any action you need when connection is closed
    });

    // Handle WebSocket error (if needed)
    ws.on('error', (error) => {
        console.error("WebSocket error:", error);
    });
});

console.log("WebSocket server running on ws://localhost:8765");
