import express, { Request, Response } from 'express';
import auth from '../controllers/google-auth';

const router = express.Router();


router.post('/verify-google-token', async (req: Request, res: Response) => {

  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      throw new Error('No token provided');
    }
    const response = await auth(idToken);
    if(!response) {
      throw new Error('you dont have permission to access this system');
    }
    res.setHeader('Access-Control-Expose-Headers', 'idtoken');
    res.setHeader('idtoken', idToken)    
    res.send({success: true});
  } catch (error:Error | any) {
    res.status(400).send({success:false, error:error.message});
  }
});

export default router;