import express, { Response } from 'express';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, (req: any, res: Response) => {
    console.log('Request user:', req.user);

  res.json({ message: 'Welcome to your profile', user: req.user });
});

export default router;
