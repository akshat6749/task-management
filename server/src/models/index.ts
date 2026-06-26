import { sequelize } from '../config/database';
import { initTaskModel, Task, TaskCreationAttributes, TaskStatus } from './task.model';
import { initUserModel, User, UserCreationAttributes } from './user.model';

export function initializeModels(): void {
  initUserModel(sequelize);
  initTaskModel(sequelize);

  // A user can own many tasks. Each task stores the assignee via userId.
  User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks'
  });

  // Each task belongs to one assignee user. This keeps the foreign key direction explicit.
  Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'assignee'
  });
}

export { User, UserCreationAttributes, Task, TaskCreationAttributes, TaskStatus };