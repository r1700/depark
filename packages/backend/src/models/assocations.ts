import { AdminUser } from './AdminUser';
import { UserSession } from './UserSession';
import { BaseUser } from './BaseUser';

export function setupAssociations() {
  BaseUser.hasOne(AdminUser, { foreignKey: 'baseuser_id', as: 'adminDetails' });
  AdminUser.belongsTo(BaseUser, { foreignKey: 'baseuser_id', as: 'baseUser' });

  AdminUser.hasMany(UserSession, {
    foreignKey: 'user_id',
    as: 'sessions',
    scope: {
      user_type: 1
    }
  });

  UserSession.belongsTo(AdminUser, {
    foreignKey: 'user_id',
    as: 'adminUser'
     });
}