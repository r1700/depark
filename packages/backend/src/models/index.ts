import { AdminUser } from './AdminUser';
import { BaseUser } from './BaseUser';
import { UserSession } from './UserSession';
import UserActivity from './UserActivity';

AdminUser.belongsTo(BaseUser, { foreignKey: 'baseuser_id', as: 'baseUser' });
BaseUser.hasOne(AdminUser, { foreignKey: 'baseuser_id', as: 'adminDetails' });

AdminUser.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession.belongsTo(AdminUser, { foreignKey: 'user_id', as: 'adminUser' });

BaseUser.hasMany(UserActivity, { foreignKey: 'baseuser_id', as: 'activities' });
UserActivity.belongsTo(BaseUser, { foreignKey: 'baseuser_id', as: 'baseUser' });