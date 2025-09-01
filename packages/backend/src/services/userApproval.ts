import { BaseUser } from '../models/baseuser';
import { User } from '../models/users';
import { UserStatusEnum } from '../enums/baseuser';

export async function updateUserStatus(
  baseUserId: number,
  userId: number,
  status: UserStatusEnum,
  adminId: string
) {
  try {
    
    const [numberOfAffectedRowsBaseUser, [updatedBaseUser]] = await BaseUser.update(
      {
        status, 
        approved_at: new Date(), 
      },
      {
        where: { id: baseUserId },
        returning: true, 
      }
    );

    if (numberOfAffectedRowsBaseUser === 0) {
      throw new Error('BaseUser not found');
    }

    console.log('Updated BaseUser:', updatedBaseUser);

    const [numberOfAffectedRowsUser, [updatedUser]] = await User.update(
      {
        approved_by: adminId, 
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

    return {
      baseUser: updatedBaseUser,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error caught in updateUserStatus:', error);
    throw new Error('Failed to update user status');
  }
}
