import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCreationAttributes = Optional<
  TaskAttributes,
  'id' | 'description' | 'status' | 'userId' | 'createdAt' | 'updatedAt'
>;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare status: TaskStatus;
  declare userId: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initTaskModel(sequelize: Sequelize): typeof Task {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
        allowNull: false,
        defaultValue: 'TODO'
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'tasks',
      timestamps: true
    }
  );

  return Task;
}