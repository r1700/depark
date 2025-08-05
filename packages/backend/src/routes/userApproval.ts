import express from 'express';
import  authenticateToken from '../middlewares/authMiddleware';
import { updateUserStatus } from '../services/userService';
import { UserStatusEnum } from '../types/UserStatusEnum';

const router = express.Router();
console.log('7777777777777777777777777');

router.post('/:id/approve', async (req, res) => {
  console.log('9999999999999');
  
  const userId = req.params.id;
  
  console.log(req.body);
  const adminId = req.body.id; // ודא שב-middleware את מגדירה req.user

  try {
    console.log('im hereeeeeeeeeeeeeeeeeeeeeeeeee');
    
    const updatedUser = await updateUserStatus(userId, UserStatusEnum.Approved, adminId);
    res.status(200).json({
      message: 'User approved successfully',
      user: updatedUser, // אופציונלי - לשלוח את המשתמש המעודכן בתגובה
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error && (error as any).message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Failed to approve user' });
    }
  }
});

export default router;