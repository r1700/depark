import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import parkingsessions from '../model/database-models/parkingsessions.model';
import parkingspots from '../model/database-models/parkingspots.model';
const router = Router();
// check the number of occupied underground parking spots now according ac to provided date
router.post('/Parking-space-occupied', async (req: Request, res: Response) => {
    try {
        const { date } = req.body;
        if (date) {
            const dateToCheck = new Date(date);
            // check if the date is valid
            if (isNaN(dateToCheck.getTime()))
                return res.status(400).json({ error: 'Invalid date format' });
            // count the number of occupied underground parking spots based on the provided date
            const count = await parkingsessions.count({
                where: {
                    entry_time: { [Op.lte]: dateToCheck }, // entry time less than or equal to the date
                    [Op.or]: [
                        { exit_time: { [Op.gt]: dateToCheck } }, // exit time greater than the date
                        { exit_time: null }, // still in process and not exited
                    ],
                },
            });
            return res.json({ 'occupied Underground Spots Count': count });
        }
        // when no date is provided, count all occupied underground parking spots
        else {
            const count = await parkingspots.count({
                where: {
                    type: 2, // only underground parking spots
                    is_occupied: true,    // parking spots that are currently occupied
                },
            });
            return res.json({ 'occupied Underground Spots Count': count });
        }
    }
    catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Unexpected internal server error' });
    }
});
export default router;
