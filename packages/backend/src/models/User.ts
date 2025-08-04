import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Users', timestamps: true })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  idNumber!: string;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'declined', 'suspended'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'system',
  })
  createdBy!: string;
}

console.log('✅ User model loaded');

