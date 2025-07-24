import express, { Request, Response } from 'express';
import * as adminUsersService from '../../services/adminUsersSerices';

const router = express.Router();

// שליפת כל המשתמשים
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await adminUsersService.getAllAdminUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// יצירת משתמש חדש
router.post('/users', async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await adminUsersService.addAdminUser(userData);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
});

// עדכון משתמש קיים
router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const updateData = req.body;

    const updatedUser = await adminUsersService.updateAdminUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;