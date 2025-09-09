import { Router, Request, Response } from 'express';
import {
    getAllUsersWithBaseuser,
    addUser,
    deleteUserAndBaseuser,
    handleUserFilter,
    updateUserWithBaseuser
} from '../services/userServices'; 

const router : Router = Router();

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

router.put('/update', async (req: Request, res: Response) => {
    try {
        const { id, first_name, last_name, email, phone, status, department, employee_id, google_id, max_cars_allowed_parking, created_by, approved_by, approved_at } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Missing id for update' });
        }
        const updatedRow = await updateUserWithBaseuser(id, {
            first_name,
            last_name,
            email,
            phone,
            status,
            department,
            employee_id,
            google_id,
            max_cars_allowed_parking,
            created_by,
            approved_by,
            approved_at
        });
        res.json({ success: true, data: updatedRow });
    } catch (error) {
        console.error('Error in PUT /api/users/update:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});


router.post('/add', async (req: Request, res: Response) => {
    try {
        const newRow = await addUser(req.body);
        return res.json({ success: true, data: newRow });
    } catch (error) {
        console.error('Error in POST /api/users/add:', error);
        return res.status(500).json({ error: 'Failed to add user' });
    }
});


router.delete('/:baseuser_id', async (req: Request, res: Response) => {
  try {
    const baseuser_id = Number(req.params.baseuser_id);
    if (!baseuser_id || isNaN(baseuser_id)) {
      return res.status(400).json({ error: 'Invalid baseuser_id parameter' });
    }

    const deleted = await deleteUserAndBaseuser(baseuser_id);
    return res.json({ success: true, data: deleted });
  } catch (error) {
    console.error(`Error in DELETE /api/users/${req.params.baseuser_id}:`, error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});


export default router;
