import express from 'express';
import { ParkingSession, Vehicle, RetrievalQueue } from '../model/database-models/RetrivalQueue.model';
import { log } from 'console';
// import { RetrievalQueue } from '../models/RetrievalQueue';

const router = express.Router();

// POST endpoint for retrieval request
router.post('/retrieve', async (req, res) => {
    console.log('Received retrieval request:', req.body);

    const { licensePlate, floor } = req.body;

    // Input validation - license plate is required
    if (!licensePlate) {
        return res.status(400).json({ error: 'licensePlate is required' });
    }
    if (!floor) {
        return res.status(400).json({ error: 'floor is required' });
    }

    try {
        // Check if a vehicle with this license plate is already in the queue (queued or processing)
        const existing = await RetrievalQueue.findOne({
            where: {
                license_plate: licensePlate,
                status: [1, 2]
            }
        });
        if (existing) {
            return res.status(409).json({ error: 'Vehicle already in queue' });
        }
        // Fetch vehicle by license plate-לוחית רישוי
        const vehicle = await Vehicle.findOne({
            where: {  license_plate: licensePlate, is_active: true }
        }) as Vehicle | null;


        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        // Fetch active session for vehicle
        const session = await ParkingSession.findOne({
            where: {
                vehicle_id: vehicle.id,
                status: 1 // 1=parked
            }
        }) as ParkingSession | null;
        if (!session) {
            return res.status(404).json({ error: 'No active parking session found' });
        }

        // Calculate position – how many are already in the queue
        const queueLength = await RetrievalQueue.count({
            where: {
                status: [1, 2]//1=queued, 2=processin
            }
        });
        const position = queueLength + 1;

        // Get next ID
        const lastRow = await RetrievalQueue.findOne({
            order: [['id', 'DESC']]
        });
        const nextId = lastRow ? String(Number(lastRow.id) + 1) : "1";
        //  add the vehicle to the queue
        await RetrievalQueue.create({
            id: nextId,
            license_plate: licensePlate,
            baseuser_id: vehicle.baseuser_id,
            parking_session_id: session.id,
            underground_spot: session.underground_spot||'',
            assigned_pickup_spot: null,// המקום שבו הרכב ימתין לנוסע לאיסוף
            request_source: 2,
            requested_at: new Date(),
            // estimatedTime: new Date(),//  not null!!--opc זמן משוער להשלמת הבקשה
            estimated_time: null,//  opc זמן משוער להשלמת הבקשה
            position,
            status: 1 // 1=queued
        });
        return res.status(201).json({
            success: true,
            data: {
                license_plate: licensePlate,
                floor: floor, // Using the floor from the request body
                underground_spot: session.underground_spot, //
            }
        });
    } catch (err) {
        console.error("❌❌❌ Error occurred:", err);
        return res.status(500).json({ error: 'Database error' });
    }
});

export default router;
