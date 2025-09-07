import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../../config/sequelize";
interface FeedbackQuestionAttributes {
  id: number;
  question_text: string;
  is_active: boolean;
  order: number | null;
  created_by: number;
}
interface FeedbackQuestionCreationAttributes
  extends Optional<FeedbackQuestionAttributes, 'id' | 'order'> {}
export class FeedbackQuestion
  extends Model<FeedbackQuestionAttributes, FeedbackQuestionCreationAttributes>
  implements FeedbackQuestionAttributes {
  public id!: number;
  public question_text!: string;
  public is_active!: boolean;
  public order!: number | null;
  public created_by!: number;
}
FeedbackQuestion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    question_text: { type: DataTypes.STRING, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, tableName: 'feedbackquestions', timestamps: false }
);