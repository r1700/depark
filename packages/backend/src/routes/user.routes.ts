import express from 'express';
import { handlePasswordReset } from '../controllers/user.controller';

const router = express.Router();

// route אחד לשתי הפעולות
router.post('/reset', handlePasswordReset);

export default router;