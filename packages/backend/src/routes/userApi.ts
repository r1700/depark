import { Router, Request, Response } from 'express';
import { handleUserFilter, getAllUsersWithBaseuser } from '../services/userServices';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const hasFilters = Object.keys(req.query).length > 0;
    if (hasFilters) {
        return handleUserFilter(req, res);
    }
    try {
        const users = await getAllUsersWithBaseuser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

export default router;