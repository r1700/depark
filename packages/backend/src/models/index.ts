import { AdminUser } from './AdminUser';
import { BaseUser } from './BaseUser';
import { UserSession } from './UserSession';
import UserActivity from './UserActivity';

// אסוציאציה בין AdminUser ל-BaseUser
AdminUser.belongsTo(BaseUser, { foreignKey: 'baseuser_id', as: 'baseUser' });
BaseUser.hasOne(AdminUser, { foreignKey: 'baseuser_id', as: 'adminDetails' });

// אסוציאציה בין AdminUser ל-UserSession (אם ב-DB יש user_id)
AdminUser.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession.belongsTo(AdminUser, { foreignKey: 'user_id', as: 'adminUser' });

// אסוציאציה בין BaseUser ל-UserActivity
BaseUser.hasMany(UserActivity, { foreignKey: 'baseuser_id', as: 'activities' });
UserActivity.belongsTo(BaseUser, { foreignKey: 'baseuser_id', as: 'baseUser' });

// לא להגדיר יותר מפעם את alias 'baseUser' אצל אף אחד