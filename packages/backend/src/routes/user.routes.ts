import express from 'express';
import { handlePasswordReset } from '../controllers/user.controller';
const router = express.Router();

router.post('/reset', handlePasswordReset);

export default router;