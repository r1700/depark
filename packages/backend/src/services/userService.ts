import { BaseUser  } from '../models/baseUser'; // מודול User שלך
import { UserStatusEnum } from '../types/UserStatusEnum'; // טייפ סטטוס שלך

// עדכון סטטוס של משתמש
export async function updateUserStatus(userId: string, status: UserStatusEnum, adminId: string) {
  try {
   console.log('Before User.update');
    console.log('User model tableName:', BaseUser.getTableName());

    // עדכון המשתמש
    const [numberOfAffectedRows, [updatedBaseUser]] = await BaseUser.update(
        
      { 
        status,             // עדכון הסטטוס
        approvedBy: adminId, // עדכון מי אישר
        approvedAt: new Date(), // עדכון זמן האישור
      },
      {
        where: { id: userId }, // סעיף where לפי id של המשתמש
        returning: true,        // מחזיר את המשתמש המעודכן (בעיקר עבור PostgreSQL)
      }
      
    );
  console.log('After User.update');
    // אם לא בוצע עדכון (אין שורות מעודכנות), זרוק שגיאה
    if (numberOfAffectedRows === 0) {
         console.log('No rows affected');
        
      throw new Error('User not found');
    }

   console.log('Updated user:', updatedBaseUser);
        
    // מחזיר את המשתמש המעודכן
    return updatedBaseUser;

  } catch (error) {
     console.error('Error caught in updateUserStatus:', error);
    // אם קרתה שגיאה, זרוק אותה
    throw new Error('Failed to update user status');
  }
}