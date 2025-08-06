import { BaseUser } from '../models/baseUser';
import { User } from '../models/user';
import { UserStatusEnum } from '../types/UserStatusEnum';

// עדכון סטטוס של משתמש - מפוצל לשני עדכונים
export async function updateUserStatus(
  baseUserId: number,
  userId: number,
  status: UserStatusEnum,
  adminId: string
) {
  try {
    // עדכון BaseUser - עדכון status ו-approvedAt בלבד
    const [numberOfAffectedRowsBaseUser, [updatedBaseUser]] = await BaseUser.update(
      {
        status,
        approvedAt: new Date(),
      },
      {
        where: { id: baseUserId },
        returning: true, // מחזיר את האובייקט המעודכן - PostgreSQL
      }
    );

    if (numberOfAffectedRowsBaseUser === 0) {
      throw new Error('BaseUser not found');
    }

    console.log('Updated BaseUser:', updatedBaseUser);

    // עדכון User - רק approvedBy בלבד
    const [numberOfAffectedRowsUser, [updatedUser]] = await User.update(
      {
        approvedBy: adminId,
      },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (numberOfAffectedRowsUser === 0) {
      throw new Error('User not found');
    }

    console.log('Updated User:', updatedUser);

    // מחזיר את שני האובייקטים המעודכנים (אפשר לשנות לפי הצורך)
    return {
      baseUser: updatedBaseUser,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error caught in updateUserStatus:', error);
    throw new Error('Failed to update user status');
  }
}