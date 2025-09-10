import sequelize from '../../config/sequelize';
import { QueryTypes } from "sequelize";
import { feedbackquestions } from '../../model/Feedback/feedbackQuestions';

//Add question
const addQuestionToDB = async (payload: feedbackquestions) => {
  try {
    const [rows]: any = await sequelize.query(
      `
      INSERT INTO feedbackquestions 
        (question_text, is_active, "order", created_at, updated_at)
      VALUES 
        (:question_text, :is_active, :order, :created_at, :updated_at)
      RETURNING *;
      `,
      {
        replacements: {
          question_text: payload.question_text,
          is_active: payload.is_active,
          order: payload.order,
          created_at: payload.created_at,
          updated_at: payload.updated_at,
        },
        type: QueryTypes.RAW, 
      }
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};

// Update question
const updateQuestionInDB = async (
  { id, data }: { id: string; data: Partial<feedbackquestions> })
  : Promise<number> => {

  try {
    const fields = Object.keys(data)
      .map((key, i) => `"${key}" = :val${i}`)
      .join(", ");

    const replacements: any = { id };
    Object.values(data).forEach((val, i) => {
      replacements[`val${i}`] = val;
    });

    const [rows]: any = await sequelize.query(
      `
      UPDATE feedbackquestions
      SET ${fields}
      WHERE id = :id
      RETURNING id;
      `,
      {
        replacements,
        type: QueryTypes.RAW,
      }
    );

    return rows.length;
  } catch (err) {    
    throw err;
  }
};

export { addQuestionToDB, updateQuestionInDB };
