import express, { Request, Response } from 'express';
import { getCountForEachQuestion, getCountForEachAnswers} from '../services/feedbackAnswers';

const router = express.Router();


//Get count of rating for each  questions
router.get('/statusAnswers', async (req: Request, res: Response) => {
  try {
    const Answers = await getCountForEachQuestion();
    return res.status(200).send(Answers);
  }
  catch(err: any){
    return res.status(500).send(err.message);
  }
});

//Get count for each rating to spacific questions
router.get('/statusRating/:question', async (req: Request, res: Response) => {
  try {
    const { question } = req.params as { question: string };
    const Answers = await getCountForEachAnswers(question);
    return res.status(200).send(Answers);
  }
  catch(err: any){
    return res.status(500).send(err.message);
  }
});


export default router;