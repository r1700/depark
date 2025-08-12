import express from 'express';
import { 
  handlePasswordReset,
  handleLogin,
  handleChangePassword,
  handleForgotPassword 
} from '../controllers/user.controller';

const router = express.Router();

router.post('/password/reset', handlePasswordReset);  
router.post('/password/forgot', handleForgotPassword);
router.post('/password/change', handleChangePassword);

// Auth routes  
router.post('/login', handleLogin);  

// Route to test if the user routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working!', timestamp: new Date().toISOString() });
});

export default router;