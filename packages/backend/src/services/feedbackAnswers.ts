import { QueryTypes } from 'sequelize';
import sequelize from '../config/sequelize';

//Get count of rating for each  questions
const getCountForEachQuestion = async () => {

    try {
        const results = await sequelize.query(
            `
            SELECT 
            fq.question_text, fq.id,
            COUNT(fa.id) AS count
            FROM feedbackquestions fq
            LEFT JOIN feedbackanswers fa 
            ON fa.question_id = fq.id
            GROUP BY fq.id, fq.question_text
            ORDER BY fq.question_text;
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        return results
    }
    catch (err) {
        console.error("Error in getCountForEachQuestion:", err);
        throw new Error("Failed to fetch question counts");
    }
};

//Get count for each rating to spacific questions
const getCountForEachAnswers = async (question: string) => {
    try {
        const results = await sequelize.query(
            `
        SELECT fq.question_text, fa.rating, COUNT(*) as count
        FROM feedbackanswers fa
        INNER JOIN feedbackquestions fq ON fa.question_id = fq.id
        WHERE fq.question_text = :question
        GROUP BY fq.question_text, fa.rating;
      `,
            {
                replacements: { question },
                type: QueryTypes.SELECT,
            }
        );

        return results;
    } catch (err) {
        throw err;
    }
};




export { getCountForEachQuestion, getCountForEachAnswers };