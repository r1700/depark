import express from 'express';
import { handleCreateOtp, handleVerifyOtp } from '../controllers/otp.controller';

const router: express.Router = express.Router();

// create OTP
router.post('/create', handleCreateOtp);

// verify OTP
router.post('/verify', handleVerifyOtp);

export default router;


