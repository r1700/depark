import sequelize from '../../config/sequelize';
import { QueryTypes } from "sequelize";

//Get all feedback questions
const getAllFeedbackQuestions = async () => {
const [results] = await sequelize.query(
    `
    SELECT *
    FROM feedbackquestions
    `
  );  

  return results
};


// Generic filter query
const GenericFilterQuery = async (
  { column, value }: { column: string; value: any }
) => {
  const results = await sequelize.query(
    `
    SELECT *
    FROM feedbackquestions
    WHERE ${column} = :value
    `,
    {
      replacements: { value },
      type: QueryTypes.SELECT
    }
  );

  return results;

}


// Filter question according to text (case insensitive search)
// const filterQuestion = async (text: string) => {
//   const [results] = await sequelize.query(
//     `SELECT questiontext 
//      FROM feedback_questions
//      WHERE question_text ILIKE :pattern`,
//     {
//       replacements: { pattern: `%${text}%` },
//       type: QueryTypes.SELECT
//     }
//   );

//   return results;
// };

// Generic counter rows
const GenericCounterRows = async ({ column, value }: { column?: string, value?: any }) => {
  const query = column
    ? `SELECT COUNT(*)::int AS count FROM feedbackquestions WHERE ${column} = :value`
    : `SELECT COUNT(*)::int AS count FROM feedbackquestions`;

  const results = await sequelize.query(query, {
    replacements: column ? { value } : {},
    type: QueryTypes.SELECT
  });

  const row = (results[0] as any).count as number;
  return row;
};




export { getAllFeedbackQuestions, GenericFilterQuery, GenericCounterRows };