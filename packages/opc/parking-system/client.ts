const oneSocket = new WebSocket('ws://localhost:8765');

oneSocket.onopen = () => {
    console.log("Connected to WebSocket server");

    // send message to request elevator
    const request = {
        action: 'request_elevator',
        car_id: '1234XYZ'
    };
    oneSocket.send(JSON.stringify(request));
};

oneSocket.onmessage = (event: MessageEvent) => {
    const response = JSON.parse(event.data);
    console.log("Received from server:", response);

    if (response.status === 'elevator_arrived') {
        console.log(`Elevator arrived for car ${response.car_id}, Parking Slot: ${response.parking_slot}`);
    }
};

oneSocket.onerror = (error: Event) => {
    console.log("WebSocket Error: ", error);
};

oneSocket.onclose = () => {
    console.log("Connection closed");
};
