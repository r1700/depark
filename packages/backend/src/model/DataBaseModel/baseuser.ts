// models/baseuser.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.config'; // יש לוודא שהקובץ הזה מייצא מופע של sequelize

class baseuser extends Model {
  public id!: number;
  public email!: string;
}

baseuser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'baseuser',
    timestamps: false,
  }
);

export default baseuser;
