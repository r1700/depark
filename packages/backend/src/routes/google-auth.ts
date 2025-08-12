import express, { Request, Response } from 'express';
import { auth } from '../controllers/google-auth';

const router = express.Router();


router.post('/verify-google-token', async (req: Request, res: Response) => {

  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new Error('No token provided');
    }

    const {user, role}= await auth(idToken);
    
    const {id, email, first_name, last_name} = user;

    res.send({
      success: true,
      user: { id: id, email:email, firstName:first_name, lastName:last_name, role: role },
      idToken: idToken,

    });
  }

  catch (error: Error | any) {
    res.status(400).send({ success: false, error: error.message });
  }
});

export default router;