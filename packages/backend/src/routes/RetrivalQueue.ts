import express from 'express';
import { ParkingSession, Vehicle } from '../model/database-models/RetrivalQueue.model';
import RetrievalQueue from '../model/database-models/retrievalQueue.model';
import { callWaitForNodeChangeApi, callWriteToPlcApi } from '../services/opc/backend-opc';

const router: express.Router = express.Router();

// POST endpoint for retrieval request
router.post('/retrieve', async (req, res) => {
    const { licensePlate, floor } = req.body;

    // Input validation
    if (!licensePlate) {
        return res.status(400).json({ error: 'License plate is required' });
    }
    if (!floor) {
        return res.status(400).json({ error: 'Floor is required' });
    }

    try {
        // Check if a vehicle with this license plate is already in the queue (queued or processing)
        const existing = await RetrievalQueue.findOne({
            where: {
                license_plate: licensePlate,
                status: [1, 2] // 1=queued, 2=processing
            }
        });
        if (existing) {
            return res.status(409).json({ error: 'Vehicle is already in the queue' });
        }

        // Fetch vehicle by license plate
        const vehicle = await Vehicle.findOne({
            where: { license_plate: licensePlate, is_active: true }
        }) as Vehicle | null;

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        // Fetch active session for the vehicle
        const session = await ParkingSession.findOne({
            where: {
                vehicle_id: vehicle.id,
                status: 1 // 1=parked
            }
        }) as ParkingSession | null;

        if (!session) {
            return res.status(404).json({ error: 'No active parking session found' });
        }

        if (!session.underground_spot) {
            return res.status(400).json({ error: 'Vehicle is not parked in an underground spot' });
        }

        const underground_spot = session.underground_spot;

        try {
            console.log(`Sending VehicleExitRequest to PLC for license plate: ${licensePlate}, underground spot: ${underground_spot}, floor: ${floor}`);
            
            await callWriteToPlcApi('VehicleExitRequest', { licensePlate, underground_spot, floor });
            console.log('Successfully sent VehicleExitRequest to PLC');
        } catch (plcError) {
            console.error('Error writing to PLC:', plcError);
            return res.status(500).json({ error: 'Failed to write to PLC' });
        }

        let value;
        try {
            value = await callWaitForNodeChangeApi('ExitRequestApproval');
        } catch (opcError) {
            console.error('Error waiting for node change from OPC server:', opcError);
            return res.status(500).json({ error: 'Failed to communicate with OPC server' });
        }

        const position = parseInt(value[1], 10);
        if (isNaN(position)) {
            console.error(`Invalid position value received: ${value[1]}`);
            return res.status(500).json({ error: 'Invalid position value received from OPC server' });
        }

        const estimated_time = new Date(new Date().getTime() + position * 5 * 60 * 1000).toISOString();

        try {
            await RetrievalQueue.create({
                license_plate: licensePlate,
                baseuser_id: vehicle.baseuser_id,
                parking_session_id: session.id,
                underground_spot: session.underground_spot || '',
                assigned_pickup_spot: value[2], // The spot where the vehicle will wait for the passenger
                request_source: 2,
                requested_at: new Date().toISOString(),
                estimated_time: estimated_time,
                position: position,
                status: 1 // 1=queued
            });
        } catch (dbError) {
            console.error('Error saving to database:', dbError);
            return res.status(500).json({ error: 'Failed to save retrieval request to the database' });
        }

        return res.status(201).json({
            licensePlate: value[0],
            position,
            assigned_pickup_spot: value[2],
            estimated_time
        });
    } catch (err) {
        console.error('Unexpected error occurred:', err);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

export default router;