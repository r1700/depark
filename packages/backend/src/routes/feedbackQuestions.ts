import express, { Request, Response } from 'express';
import { GenericFilterQuery, getAllFeedbackQuestions } from '../services/feedbackQuestions/filters';
import { addQuestion, updateQuestion } from '../controllers/feedbackQuestion';
import { feedbackquestions } from '../model/Feedback/feedbackQuestions';

const router = express.Router();

//Filter question by column and value
router.get('/:column/:value', async (req: Request, res: Response) => {
  try {
    const { column, value } = req.params as { column: string; value: string };    
    const query = await GenericFilterQuery({column, value});
    return res.status(200).send(query);
  }
  catch (err: any) {
    return res.status(500).send(err.message);
  }

});

//Filter question by text
router.get('/:text', async (req: Request, res: Response) => {
  // try {
  //   const { text } = req.params as { text: string };
  //   const questions = await filterQuestion(text);
  //   return res.status(200).send(questions);
  // }
  // catch (err: any) {
  //   return res.status(500).send(err.message);
  // }
});

//Get all feedback questions
router.get('/', async (req: Request, res: Response) => {
  try {
    const questions = await getAllFeedbackQuestions();
    return res.status(200).send(questions);
  }
  catch(err: any){
    return res.status(500).send(err.message);
  }
});

//Add a new feedback question
router.post('/', async (req: Request, res: Response) => {
  try {
    const question = req.body;
    const created = await addQuestion(question);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
});

//Update question
router.put('/:id', async (req: Request, res: Response) => {
  try {    
    const { id } = req.params as { id: string };    
    const data: Partial<feedbackquestions> = req.body
    const updated = await updateQuestion({ id, data });
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
})

export default router;