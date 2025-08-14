// בקובץ האסוציאציות שלך (או הוסף לאותה פונקציה setupAssociations), הוסף את השורות האלה:

import { AdminUser } from './AdminUser';
import { UserSession } from './UserSession';
import { BaseUser } from './BaseUser'; // אם יש לך מודל כזה
export function setupAssociations() {
  // הקשרים הקיימים שלך
  BaseUser.hasOne(AdminUser, { foreignKey: 'baseUserId', as: 'adminUser' });
  AdminUser.belongsTo(BaseUser, { foreignKey: 'baseUserId', as: 'baseUser' });

  // הוסף את הקשרים בין AdminUser ל-UserSession:
  AdminUser.hasMany(UserSession, {
    foreignKey: 'userId',   // האיד שה-UserSession מצביע עליו
    as: 'activeSession',         // תן שם לאסוציאציה (אפשר גם אחרת)
    scope: {
      userType: 'admin'     // תנאי למיצג שה-UserSession באמת שייך ל-admin
    }
  });

  UserSession.belongsTo(AdminUser, {
    foreignKey: 'userId',
    as: 'adminUser'
  });
}