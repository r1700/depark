import express, { Router } from 'express';
import { 
  handlePasswordReset,
  handleLogin,
  handleChangePassword,
  handleForgotPassword 
} from '../controllers/user.controller';

const router : Router = express.Router();

router.post('/reset', handlePasswordReset);
router.post('/forgot', handleForgotPassword);
router.post('/change', handleChangePassword);
// Auth routes  
router.post('/login', handleLogin);  

// Route to test if the user routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working!', timestamp: new Date().toISOString() });
});
 export default router;