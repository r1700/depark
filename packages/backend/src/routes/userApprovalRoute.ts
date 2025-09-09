
import express from 'express';
import authenticateToken from '../middlewares/authMiddleware';
import { updateUserStatus } from '../services/userApproval';
import { UserStatusEnum } from '../enums/baseuser';

const router = express.Router();

router.post('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const adminId = req.body.adminId;
    if (!adminId) {
      return res.status(401).json({ error: 'Admin ID missing' });
    }
    
    const updated = await updateUserStatus(id, id, UserStatusEnum.Approved, adminId);

    res.status(200).json({
      message: 'User approved successfully',
      data: updated,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

export default router;
