import e from "express";
import { feedbackquestions } from "../model/Feedback/feedbackQuestions";
import { addQuestionToDB, updateQuestionInDB } from "../services/feedbackQuestions/CRUDfeedback";
import { GenericCounterRows } from "../services/feedbackQuestions/filters";


//Check the count of the active questions
const activeQuestions = async (): Promise<boolean> => {
  try {
    const activeQuestions: number = await GenericCounterRows({ column: "is_active", value: true });
    if (activeQuestions == 5) {
      throw new Error("there are alredy 5 active question")
    }
    return true;
  }
  catch (error: any) {
    throw error
  }
}


//Add new question to DB
const addQuestion = async (question: feedbackquestions) => {
  try {

    //Validate fields
    await feedbackquestions.create(question);

    //Check if there are 5 active questions
    if (question.is_active == true)
      await activeQuestions()

    //Insert Question to DB
    const created = addQuestionToDB({
      ...question,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
      order: await GenericCounterRows({})
    });

    return created;

  } catch (error: any) {

    //If there are validation errors, extract and throw them
    let problems = Array.isArray(error?.problems) ? error.problems : [];

    if (problems.length) {
      problems = problems.map((p: any) => p.message)
      throw new Error(problems)
    }

    //Other errors
    else
      throw error
  }

}

const updateQuestion = async ({ id, data }: { id: string, data: Partial<feedbackquestions> }) => {
  try {    
    await feedbackquestions.update(data);

    if (data.is_active == true)
      await activeQuestions()

    const updated = await updateQuestionInDB({
      id,
      data: {
        ...data,
        updated_at: new Date().toISOString().split("T")[0]
      }
    });

    if (updated === 0) {
      throw new Error(`Question with id ${id} not found`);
    }
    return "updated success"
  }

  catch (error: any) {
    let problems = Array.isArray(error?.problems) ? error.problems : [];

    if (problems.length) {
      problems = problems.map((p: any) => p.message)
      throw new Error(problems)
    }
    else      
      throw error
  }
}
export { addQuestion, updateQuestion }