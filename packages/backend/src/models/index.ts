// models/index.ts או במודול אסוציאציות

import {AdminUser} from './AdminUser';
import {BaseUser} from './BaseUser';
import {UserSession} from './UserSession';
import UserActivity from './UserActivity';

AdminUser.belongsTo(BaseUser, { foreignKey: 'baseUserId', as: 'baseUser' });
BaseUser.hasOne(AdminUser, { foreignKey: 'baseUserId', as: 'adminDetails' });

AdminUser.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions' });
UserSession.belongsTo(AdminUser, { foreignKey: 'userId', as: 'adminUser' });

AdminUser.hasMany(UserActivity, { foreignKey: 'userId', as: 'activities' });
UserActivity.belongsTo(AdminUser, { foreignKey: 'userId', as: 'adminUser' });

// לא להגדיר יותר מפעם את alias 'baseUser' אצל אף אחד